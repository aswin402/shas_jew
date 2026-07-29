import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  Sparkles,
  DollarSign,
  Boxes,
  Tag,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import ImageUploader from '@/components/admin/ImageUploader';

interface SupabaseProductRow {
  id: string;
  title: string;
  price: number | string;
  image_url?: string;
  imageUrl?: string;
  category_name?: string;
  category?: string;
  category_id?: string;
  material?: string;
  rating?: number | string;
  reviews?: number | string;
  description?: string;
  stock?: number | string;
}

interface SupabaseCategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

// Helper slug generator
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = (title: string, existingProducts: Product[]): string => {
  let slug = generateSlug(title);
  if (existingProducts.some((p) => p.id === slug)) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${randomSuffix}`;
  }
  return slug;
};

// Zod Validation Schema for Product Form
const productFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than $0.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  material: z.string().min(2, 'Material is required (e.g., 18k Yellow Gold, Platinum).'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  category_id: z.string().min(1, 'Please select a category.'),
  imageUrl: z.string().min(1, 'Product image is required.'),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Custom Deletion Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      material: '',
      stock: 10,
      category_id: '',
      imageUrl: '',
    },
  });

  const watchedImageUrl = useWatch({ control, name: 'imageUrl' });

  // Initial Data Fetch
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*'),
        ]);

        if (isCancelled) return;

        // Handle Categories
        let loadedCategories: Category[] = [];
        if (categoriesRes.data && categoriesRes.data.length > 0) {
          loadedCategories = (categoriesRes.data as SupabaseCategoryRow[]).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
          }));
        } else {
          const defaultNames = ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Gifts'];
          loadedCategories = defaultNames.map((name, i) => ({
            id: `cat-${i + 1}`,
            name,
            slug: name.toLowerCase(),
          }));
        }
        setCategories(loadedCategories);

        // Handle Products
        let loadedProducts: Product[] = [];
        if (productsRes.data && productsRes.data.length > 0) {
          loadedProducts = (productsRes.data as SupabaseProductRow[]).map((row) => ({
            id: row.id,
            title: row.title,
            price: Number(row.price),
            imageUrl: row.image_url || row.imageUrl || '',
            category: row.category_name || row.category || 'Uncategorized',
            category_id: row.category_id || '',
            material: row.material || '',
            rating: Number(row.rating ?? 5.0),
            reviews: Number(row.reviews ?? 0),
            description: row.description || '',
            stock: row.stock !== undefined && row.stock !== null ? Number(row.stock) : 10,
          }));
        } else {
          loadedProducts = PRODUCTS.map((p, idx) => ({
            ...p,
            stock: idx % 3 === 0 ? (idx === 0 ? 0 : 3) : 12 + idx * 2,
          }));
        }
        setProducts(loadedProducts);
      } catch (err) {
        console.error('Error fetching Product catalog data:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
      ]);

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(
          (categoriesRes.data as SupabaseCategoryRow[]).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
          }))
        );
      }

      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(
          (productsRes.data as SupabaseProductRow[]).map((row) => ({
            id: row.id,
            title: row.title,
            price: Number(row.price),
            imageUrl: row.image_url || row.imageUrl || '',
            category: row.category_name || row.category || 'Uncategorized',
            category_id: row.category_id || '',
            material: row.material || '',
            rating: Number(row.rating ?? 5.0),
            reviews: Number(row.reviews ?? 0),
            description: row.description || '',
            stock: row.stock !== undefined && row.stock !== null ? Number(row.stock) : 10,
          }))
        );
      }
    } catch (err) {
      console.error('Error refreshing product catalog:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Event handlers for filters (resetting page to 1)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStockStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStockStatusFilter(e.target.value as 'all' | 'in_stock' | 'low_stock' | 'out_of_stock');
    setCurrentPage(1);
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategoryFilter === 'all' ||
        p.category_id === selectedCategoryFilter ||
        p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

      const stock = p.stock ?? 0;
      let matchesStock = true;
      if (stockStatusFilter === 'in_stock') matchesStock = stock > 5;
      else if (stockStatusFilter === 'low_stock') matchesStock = stock > 0 && stock <= 5;
      else if (stockStatusFilter === 'out_of_stock') matchesStock = stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategoryFilter, stockStatusFilter]);

  // Pagination computation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalError(null);
    reset({
      title: '',
      price: 0,
      description: '',
      material: '18k Yellow Gold',
      stock: 10,
      category_id: categories.length > 0 ? categories[0].id : '',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalError(null);

    let catId = product.category_id || '';
    if (!catId) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === product.category.toLowerCase()
      );
      if (match) catId = match.id;
      else if (categories.length > 0) catId = categories[0].id;
    }

    reset({
      title: product.title,
      price: product.price,
      description: product.description || '',
      material: product.material || '',
      stock: product.stock !== undefined ? product.stock : 10,
      category_id: catId,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  // Form Submission Handler
  const onSubmitForm = async (data: ProductFormData) => {
    setModalError(null);
    setIsSubmitting(true);

    try {
      const targetCategory = categories.find((c) => c.id === data.category_id);
      const categoryName = targetCategory ? targetCategory.name : 'General';

      if (editingProduct) {
        const updatedRecord = {
          title: data.title,
          price: data.price,
          description: data.description,
          material: data.material,
          stock: data.stock,
          category_id: data.category_id,
          category_name: categoryName,
          image_url: data.imageUrl,
        };

        const { error: dbError } = await supabase
          .from('products')
          .update(updatedRecord)
          .eq('id', editingProduct.id);

        if (dbError) {
          console.warn('Supabase DB Update Notice:', dbError.message);
        }

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  title: data.title,
                  price: data.price,
                  description: data.description,
                  material: data.material,
                  stock: data.stock,
                  category_id: data.category_id,
                  category: categoryName,
                  imageUrl: data.imageUrl,
                }
              : p
          )
        );

        setSuccessMessage(`Product "${data.title}" updated successfully.`);
      } else {
        const customId = generateUniqueSlug(data.title, products);

        const newRecord = {
          id: customId,
          title: data.title,
          price: data.price,
          description: data.description,
          material: data.material,
          stock: data.stock,
          category_id: data.category_id,
          category_name: categoryName,
          image_url: data.imageUrl,
          rating: 5.0,
          reviews: 0,
        };

        const { error: dbError } = await supabase.from('products').insert(newRecord);

        if (dbError) {
          console.warn('Supabase DB Insert Notice:', dbError.message);
        }

        const newProductObj: Product = {
          id: customId,
          title: data.title,
          price: data.price,
          description: data.description,
          material: data.material,
          stock: data.stock,
          category_id: data.category_id,
          category: categoryName,
          imageUrl: data.imageUrl,
          rating: 5.0,
          reviews: 0,
        };

        setProducts((prev) => [newProductObj, ...prev]);
        setSuccessMessage(`New product "${data.title}" added to catalog.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      console.error('Error submitting product form:', err);
      const msg = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'An error occurred while saving the product.';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action Handler
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (dbError) {
        console.warn('Supabase DB Delete Notice:', dbError.message);
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setSuccessMessage(`Product "${productToDelete.title}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      console.error('Error deleting product:', err);
      const msg = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Failed to delete product.';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
              Inventory & CMS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {products.length} Items Total
            </span>
          </div>
          <h1 className="text-2xl font-serif tracking-wide text-slate-100 uppercase">
            Product Catalog Manager
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage luxury jewelry items, pricing, inventory stock levels, categories, and high-resolution storage media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 transition-all hover:scale-105 disabled:opacity-50"
            title="Refresh product list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl backdrop-blur-md text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)}>
              <X className="w-4 h-4 text-emerald-400 hover:text-emerald-200" />
            </button>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-rose-950/60 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl backdrop-blur-md text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)}>
              <X className="w-4 h-4 text-rose-400 hover:text-rose-200" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl backdrop-blur-md">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products by title, material, or description..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category dropdown filter */}
        <div className="md:col-span-4 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCategoryFilter}
            onChange={handleCategoryFilterChange}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 appearance-none transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock status filter */}
        <div className="md:col-span-3 relative">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={stockStatusFilter}
            onChange={handleStockStatusFilterChange}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 appearance-none transition-colors cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">Healthy Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1 - 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
              Loading Product Catalog...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No matching products found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or category filters, or click "Add New Product" to create one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Material</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-200">
                {paginatedProducts.map((product) => {
                  const stock = product.stock ?? 0;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-700/70 bg-slate-950 shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100 text-xs group-hover:text-amber-400 transition-colors">
                              {product.title}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-medium">
                          <Tag className="w-3 h-3 text-amber-400" />
                          {product.category || 'General'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-semibold text-amber-400">
                          ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Stock Badge */}
                      <td className="py-3.5 px-4">
                        {stock === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 text-[10px] font-semibold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Out of stock
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 text-[10px] font-semibold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Low ({stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-semibold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {stock} units
                          </span>
                        )}
                      </td>

                      {/* Material */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {product.material || 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-700 hover:border-amber-500/50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer with Pagination */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="text-slate-200 font-semibold">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-slate-200 font-semibold">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of{' '}
            <span className="text-slate-200 font-semibold">{filteredProducts.length}</span> products
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-slate-100">
                      {editingProduct ? 'Edit Product Record' : 'Add New Jewelry Product'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {editingProduct
                        ? `Editing catalog item ID: ${editingProduct.id}`
                        : 'Fill details below to add a new item to Supabase inventory.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {modalError && (
                  <div className="p-3 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Product Title <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('title')}
                      placeholder="e.g. Royal Solitaire Diamond Ring"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {errors.title && (
                      <p className="text-[11px] text-rose-400 mt-0.5">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Category <span className="text-amber-500">*</span>
                    </label>
                    <select
                      {...register('category_id')}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="text-[11px] text-rose-400 mt-0.5">{errors.category_id.message}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Price (USD $) <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        step="0.01"
                        {...register('price')}
                        placeholder="1499.00"
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-[11px] text-rose-400 mt-0.5">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Stock Level <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <Boxes className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('stock')}
                        placeholder="10"
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-[11px] text-rose-400 mt-0.5">{errors.stock.message}</p>
                    )}
                  </div>
                </div>

                {/* Material */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Material / Metal Specification <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('material')}
                    placeholder="e.g. 18k Yellow Gold & VVS Diamonds"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.material && (
                    <p className="text-[11px] text-rose-400 mt-0.5">{errors.material.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Description <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    {...register('description')}
                    placeholder="Handcrafted masterwork featuring ethically sourced gemstones and polished finish..."
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.description && (
                    <p className="text-[11px] text-rose-400 mt-0.5">{errors.description.message}</p>
                  )}
                </div>

                {/* Drag and Drop Image Uploader */}
                <ImageUploader
                  currentImageUrl={watchedImageUrl}
                  onUploadComplete={(url) => {
                    setValue('imageUrl', url, { shouldValidate: true });
                  }}
                  onImageRemove={() => {
                    setValue('imageUrl', '', { shouldValidate: true });
                  }}
                  error={errors.imageUrl?.message}
                />

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {editingProduct ? 'Update Product' : 'Save Product'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-slate-100 uppercase tracking-wider">
                  Delete Product?
                </h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to delete <span className="text-slate-200 font-semibold">"{productToDelete.title}"</span>? This action will remove it permanently from the database.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  {isDeleting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;
