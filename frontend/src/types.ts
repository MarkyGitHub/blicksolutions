// Datenmodell für einen Einkaufslisteneintrag
export interface ShoppingItem {
  _id: string;
  name: string;
  bought: boolean;
  createdAt: string;
}
