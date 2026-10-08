import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../data/products';

declare const process: any;


const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.warn('⚠️ Notice: VITE_SUPABASE_URL contains placeholder values.');
  console.warn('To seed your remote database, update .env with your real Supabase URL and Anon Key, then run: bun run seed');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding categories...');
  
  // Extract unique categories
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  const categoryMap: { [key: string]: string } = {};

  for (const catName of categories) {
    const slug = catName.toLowerCase().replace(/ /g, '-');
    try {
      const { data, error } = await supabase
        .from('categories')
        .upsert({ name: catName, slug }, { onConflict: 'name' })
        .select()
        .single();

      if (error) {
        console.error(`Error inserting category ${catName}:`, error.message);
      } else if (data) {
        categoryMap[catName] = data.id;
        console.log(`Seeded category: ${catName} (${data.id})`);
      }
    } catch (err: any) {
      console.error(`Network or execution error inserting category ${catName}:`, err.message || err);
    }
  }

  console.log('Seeding products...');
  for (const product of PRODUCTS) {
    const categoryId = categoryMap[product.category] || null;
    try {
      const { error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          material: product.material,
          image_url: product.imageUrl,
          gallery_images: product.galleryImages || [product.imageUrl],
          category_id: categoryId,
          category_name: product.category,
          rating: product.rating,
          reviews: product.reviews,
          stock: product.stock ?? Math.floor(Math.random() * 20) + 1,
          tag_no: product.tagNo,
          gross_weight: product.grossWeight,
          net_weight: product.netWeight
        }, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting product ${product.title}:`, error.message);
      } else {
        console.log(`Seeded product: ${product.title}`);
      }
    } catch (err: any) {
      console.error(`Network or execution error inserting product ${product.title}:`, err.message || err);
    }
  }

  console.log('Seeding completed successfully!');
}

seed();
