export interface CartItem {
  id: number;
  name: string;
  pictureUrl: string;
  price: number;
  brand: string;
  category: string;
  quantity: number;
}

  export interface CustomerBasket {
    id: string;
    items: CartItem[];
  }
  