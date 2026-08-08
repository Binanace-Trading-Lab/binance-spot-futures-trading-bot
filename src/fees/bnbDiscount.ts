export function effectiveFeeBps(baseBps: number, useBnbDiscount: boolean): number {
  return useBnbDiscount ? Math.max(1, baseBps * 0.75) : baseBps;
}
