export type DualBook = { spotQty: number; perpQty: number };

export function createDualBook(): DualBook {
  return { spotQty: 0, perpQty: 0 };
}

export function applyFill(book: DualBook, market: "spot" | "perp", side: "buy" | "sell", amount: number): void {
  const signed = side === "buy" ? amount : -amount;
  if (market === "spot") book.spotQty += signed;
  else book.perpQty += signed;
}

export function netDelta(book: DualBook): number {
  return book.spotQty + book.perpQty;
}
