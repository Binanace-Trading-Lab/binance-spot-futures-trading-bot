export type VipTier = { level: number; makerBps: number; takerBps: number };

export const BINANCE_VIP: VipTier[] = [
  { level: 0, makerBps: 10, takerBps: 10 },
  { level: 1, makerBps: 9, takerBps: 10 },
  { level: 2, makerBps: 8, takerBps: 10 },
  { level: 3, makerBps: 7, takerBps: 9 },
];

export function pickTier(volume30dUsd: number): VipTier {
  if (volume30dUsd > 50_000_000) return BINANCE_VIP[3]!;
  if (volume30dUsd > 15_000_000) return BINANCE_VIP[2]!;
  if (volume30dUsd > 5_000_000) return BINANCE_VIP[1]!;
  return BINANCE_VIP[0]!;
}
