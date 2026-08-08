import type { DualBook } from "./dualBook.js";
import { netDelta } from "./dualBook.js";

export function inventoryHealthy(book: DualBook, maxAbsDelta: number): boolean {
  return Math.abs(netDelta(book)) <= maxAbsDelta;
}
