export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  category_id?: string;
  material: string;
  rating: number;
  reviews: number;
  description: string;
  stock?: number;
}

