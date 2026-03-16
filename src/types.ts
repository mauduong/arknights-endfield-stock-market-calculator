export interface StockItem {
  id: string;
  title: string;
  marketPrice: number | "";
  marketQuantity: number | "";
  playerPrice: number | "";
  playerQuantity: number;
  friendPrice: number | "";
}
