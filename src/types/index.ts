export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  specs: string[];
}

export interface CartItem extends Product {
  quantity: number;
}