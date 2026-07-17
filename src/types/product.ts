export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: 'Necklaces' | 'Earrings' | 'Rings' | 'Bracelets' | 'Gifts';
  material: string;
  rating: number;
  reviews: number;
  description: string;
}
