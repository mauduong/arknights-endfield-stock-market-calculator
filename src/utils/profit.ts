import type { StockItem } from "../types";

export function calculateItemProfit(item: StockItem): number {
  const marketPrice: number = Number(item.marketPrice) || 0;
  const playerPrice: number = Number(item.playerPrice) || 0;
  const marketQty: number = Number(item.marketQuantity) || 0;
  const ownedQty: number = Number(item.playerQuantity) || 0;

  // Not nullable as this is the important field required to do any calculations
  const friendPrice: number = Number(item.friendPrice) || 0;
  if (friendPrice === 0) return 0;

  // Market Quantity defaults to 1 per elastic good. Overwrite if user sets quantity
  const effectiveMarketQty = marketQty > 0 ? marketQty : 1;
  const marketProfit: number | null =
    marketPrice > 0 ? (friendPrice - marketPrice) * effectiveMarketQty : null;
  const ownedProfit: number | null =
    playerPrice > 0 && ownedQty > 0
      ? playerPrice * ownedQty - friendPrice
      : null;

  if (marketProfit !== null && ownedProfit !== null)
    return marketProfit + ownedProfit;
  if (marketProfit !== null) return marketProfit;
  if (ownedProfit !== null) return ownedProfit;

  if (marketPrice === 0) return 0;
  return friendPrice - marketPrice;
}

export function calculateTotalGains(items: StockItem[]): number {
  return items.reduce((acc, item) => acc + calculateItemProfit(item), 0);
}
