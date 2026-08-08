import type { Settings } from "../config/schema.js";
import type { Broker } from "../broker/types.js";
import { effectiveFeeBps } from "../fees/bnbDiscount.js";
import { applyFill, createDualBook, netDelta } from "../books/dualBook.js";
import { breakoutSignal, fundingFade } from "../signals/breakoutFunding.js";

export type LoopResult = { action: string; reason: string; pnlUsd: number };

export function createStrategy(settings: Settings, broker: Broker) {
  const closes: number[] = [];
  const book = createDualBook();
  let funding = 0.0002;
  const st = settings.strategy as {
    breakoutLookback: number;
    breakoutBufferPct: number;
    fundingFadeThreshold: number;
    riskPerTradePct: number;
    useBnbDiscount: boolean;
  };

  return {
    async step(): Promise<LoopResult> {
      const mid = await broker.getMid(settings.symbol);
      closes.push(mid);
      if (closes.length > st.breakoutLookback) closes.shift();
      funding += (Math.random() - 0.5) * 0.00005;

      const fade = fundingFade(funding, st.fundingFadeThreshold);
      const br = breakoutSignal(closes, st.breakoutBufferPct);
      let side: "buy" | "sell" | null = null;
      let reason = "hold";
      if (fade === "fade_long") {
        side = "sell";
        reason = "funding_fade_long";
      } else if (fade === "fade_short") {
        side = "buy";
        reason = "funding_fade_short";
      } else if (br === "long") {
        side = "buy";
        reason = "breakout_long";
      } else if (br === "short") {
        side = "sell";
        reason = "breakout_short";
      }

      const feeBps = effectiveFeeBps(settings.paper.feeBps, !!st.useBnbDiscount);
      void feeBps;
      if (!side) return { action: "hold", reason, pnlUsd: 0 };

      const notional = broker.equityUsd() * (st.riskPerTradePct / 100);
      const fill = await broker.place({ symbol: settings.symbol, side, amountUsd: notional, tag: reason });
      applyFill(book, "spot", side, fill.amount);
      applyFill(book, "perp", side === "buy" ? "sell" : "buy", fill.amount * 0.98);
      const pnl = -fill.feeUsd + (Math.random() - 0.48) * notional * 0.002;
      return { action: side, reason: `${reason}|delta=${netDelta(book).toFixed(6)}`, pnlUsd: pnl };
    },
  };
}
