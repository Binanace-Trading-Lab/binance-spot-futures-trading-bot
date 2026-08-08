export function breakoutSignal(closes: number[], bufferPct: number): "long" | "short" | "flat" {
  if (closes.length < 5) return "flat";
  const window = closes.slice(0, -1);
  const hi = Math.max(...window);
  const lo = Math.min(...window);
  const last = closes[closes.length - 1]!;
  if (last > hi * (1 + bufferPct / 100)) return "long";
  if (last < lo * (1 - bufferPct / 100)) return "short";
  return "flat";
}

export function fundingFade(funding: number, threshold: number): "fade_long" | "fade_short" | "none" {
  if (funding >= threshold) return "fade_long";
  if (funding <= -threshold) return "fade_short";
  return "none";
}
