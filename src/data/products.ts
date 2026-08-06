import type { Product } from '../types/product';

import dsc09342 from '../assets/sampleproducts/DSC09342.jpg';
import dsc09345 from '../assets/sampleproducts/DSC09345.jpg';
import dsc09349 from '../assets/sampleproducts/DSC09349.jpg';
import dsc09351 from '../assets/sampleproducts/DSC09351.jpg';
import dsc09355 from '../assets/sampleproducts/DSC09355.jpg';
import dsc09360 from '../assets/sampleproducts/DSC09360.jpg';
import dsc09366 from '../assets/sampleproducts/DSC09366.jpg';
import dsc09372 from '../assets/sampleproducts/DSC09372.jpg';
import dsc09373 from '../assets/sampleproducts/DSC09373.jpg';
import dsc09377 from '../assets/sampleproducts/DSC09377.jpg';
import dsc09397 from '../assets/sampleproducts/DSC09397.jpg';
import dsc09404 from '../assets/sampleproducts/DSC09404.jpg';
import dsc09405 from '../assets/sampleproducts/DSC09405.jpg';
import dsc09409 from '../assets/sampleproducts/DSC09409.jpg';
import dsc09414 from '../assets/sampleproducts/DSC09414.jpg';
import dsc09421 from '../assets/sampleproducts/DSC09421.jpg';
import dsc09433 from '../assets/sampleproducts/DSC09433.jpg';
import dsc09435 from '../assets/sampleproducts/DSC09435.jpg';
import dsc09445 from '../assets/sampleproducts/DSC09445.jpg';
import dsc09449 from '../assets/sampleproducts/DSC09449.jpg';
import dsc09450 from '../assets/sampleproducts/DSC09450.jpg';

export const SAMPLE_IMAGES = [
  dsc09342, dsc09345, dsc09349, dsc09351, dsc09355, dsc09360,
  dsc09366, dsc09372, dsc09373, dsc09377, dsc09397, dsc09404,
  dsc09405, dsc09409, dsc09414, dsc09421, dsc09433, dsc09435,
  dsc09445, dsc09449, dsc09450
];

export function getProductImage(productId: string): string {
  const mapping: Record<string, string> = {
    'dlicatine-necklace': dsc09342,
    'finellase-bracelet': dsc09345,
    'hoop-earrings': dsc09349,
    'aurelia-pearl-ring': dsc09351,
    'celestial-pendant': dsc09355,
    'elara-choker': dsc09360,
    'soleil-studs': dsc09366,
    'aurora-droplets': dsc09372,
    'solstice-band': dsc09373,
    'lumina-stack': dsc09377,
    'seraphina-cuff': dsc09397,
    'marina-chain': dsc09404
  };

  if (mapping[productId]) {
    return mapping[productId];
  }

  // Consistent fallback using string hash
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % SAMPLE_IMAGES.length;
  return SAMPLE_IMAGES[idx];
}

export const PRODUCTS: Product[] = [
  {
    id: 'dlicatine-necklace',
    title: 'Dlicatine Necklace',
    price: 85.00,
    imageUrl: dsc09342,
    category: 'Necklaces',
    material: '14k Gold Vermeil',
    rating: 5.0,
    reviews: 24,
    description: 'A delicate 14k gold chain adorned with a single selected freshwater pearl and star accent. Perfect for daily layering.'
  },
  {
    id: 'finellase-bracelet',
    title: 'Finellase Bracelet',
    price: 95.00,
    imageUrl: dsc09345,
    category: 'Bracelets',
    material: '14k Gold Vermeil',
    rating: 4.9,
    reviews: 18,
    description: 'Minimalist links crafted with precision, reflecting light with every movement. Complete with a signature clasp.'
  },
  {
    id: 'hoop-earrings',
    title: 'Hoop Earrings',
    price: 65.00,
    imageUrl: dsc09349,
    category: 'Earrings',
    material: '14k Gold & Baroque Pearl',
    rating: 5.0,
    reviews: 32,
    description: 'Organic handpicked baroque pearls suspended from textured, hand-hammered 14k gold hoops.'
  },
  {
    id: 'aurelia-pearl-ring',
    title: 'Aurelia Pearl Ring',
    price: 75.00,
    imageUrl: dsc09351,
    category: 'Rings',
    material: '14k Gold & Freshwater Pearl',
    rating: 4.8,
    reviews: 15,
    description: 'A twisted rope band meticulously detailed with a central freshwater pearl and micro-pave diamond-like accents.'
  },
  {
    id: 'celestial-pendant',
    title: 'Celestial Pendant',
    price: 120.00,
    imageUrl: dsc09355,
    category: 'Necklaces',
    material: '14k Gold & Diamond Accent',
    rating: 4.9,
    reviews: 14,
    description: 'A hand-sculpted golden disk depicting the lunar phase transitions, detailed with a central conflict-free diamond.'
  },
  {
    id: 'elara-choker',
    title: 'Elara Pearl Choker',
    price: 145.00,
    imageUrl: dsc09360,
    category: 'Necklaces',
    material: 'Freshwater Pearls & 14k Clasp',
    rating: 5.0,
    reviews: 20,
    description: 'A classic line of uniform high-luster freshwater pearls, bound by a signature custom 14k gold toggle clasp.'
  },
  {
    id: 'soleil-studs',
    title: 'Soleil Pearl Studs',
    price: 55.00,
    imageUrl: dsc09366,
    category: 'Earrings',
    material: '14k Gold & Freshwater Pearl',
    rating: 4.7,
    reviews: 19,
    description: 'Fine rays of hand-etched gold radiating from a central pearl, capturing the organic beauty of early dawn.'
  },
  {
    id: 'aurora-droplets',
    title: 'Aurora Baroque Droplets',
    price: 110.00,
    imageUrl: dsc09372,
    category: 'Earrings',
    material: 'Baroque Pearls & 14k Gold Wires',
    rating: 4.9,
    reviews: 11,
    description: 'Glistening matched baroque pearls suspended from slender gold wires that capture delicate reflections.'
  },
  {
    id: 'solstice-band',
    title: 'Solstice Gold Band',
    price: 90.00,
    imageUrl: dsc09373,
    category: 'Rings',
    material: '14k Gold Vermeil',
    rating: 4.6,
    reviews: 8,
    description: 'A heavy, organic hand-carved band layered with gold shell over solid sterling silver.'
  },
  {
    id: 'lumina-stack',
    title: 'Lumina Stack Set',
    price: 135.00,
    imageUrl: dsc09377,
    category: 'Rings',
    material: '14k Gold & White Topaz',
    rating: 4.8,
    reviews: 22,
    description: 'A triple-band nesting ring set featuring delicate hammered surfaces and white topaz diamond-style pave settings.'
  },
  {
    id: 'seraphina-cuff',
    title: 'Seraphina Cuff',
    price: 115.00,
    imageUrl: dsc09397,
    category: 'Bracelets',
    material: '14k Gold Vermeil',
    rating: 4.9,
    reviews: 7,
    description: 'An open ripple cuff bracelet evoking organic waves, sized to sit elegantly on the wrist.'
  },
  {
    id: 'marina-chain',
    title: 'Marina Toggle Link',
    price: 80.00,
    imageUrl: dsc09404,
    category: 'Bracelets',
    material: '14k Gold Vermeil',
    rating: 4.7,
    reviews: 13,
    description: 'Classic elongated link paperclip chain detailed with an integrated structural toggle bar.'
  }
];
