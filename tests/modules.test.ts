import test from "node:test";
import assert from "node:assert/strict";
import { effectiveFeeBps } from "../src/fees/bnbDiscount.js";
import { applyFill, createDualBook, netDelta } from "../src/books/dualBook.js";
import { breakoutSignal, fundingFade } from "../src/signals/breakoutFunding.js";

test("bnb discount reduces fees", () => {
  assert.equal(effectiveFeeBps(8, false), 8);
  assert.ok(effectiveFeeBps(8, true) < 8);
});

test("dual book net delta near flat when hedged", () => {
  const book = createDualBook();
  applyFill(book, "spot", "buy", 1);
  applyFill(book, "perp", "sell", 0.98);
  assert.ok(Math.abs(netDelta(book)) < 0.05);
});

test("signals produce expected sides", () => {
  const closes = [1, 1.01, 1.02, 1.03, 1.04, 1.1];
  assert.equal(breakoutSignal(closes, 0.1), "long");
  assert.equal(fundingFade(0.002, 0.0008), "fade_long");
  assert.equal(fundingFade(-0.002, 0.0008), "fade_short");
});
