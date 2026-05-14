export interface CartItemMetadata {
  name: string;
  description?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  metadata: CartItemMetadata;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface CartTotals {
  subtotal: number;
  itemCount: number;
}

export interface CartView extends Cart {
  totals: CartTotals;
}
