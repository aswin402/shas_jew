import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Tag,
  Layers,
  X,
  Lock,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Form State for Adding Category
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatSlug, setNewCatSlug] = useState<string>('');
  const [newCatDescription, setNewCatDescription] = useState<string>('');
  const [isSlugCustomized, setIsSlugCustomized] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Deletion Modal / Error State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Helper to convert category name to slug
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto update slug as user types category name unless customized
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewCatName(val);
    if (!isSlugCustomized) {
      setNewCatSlug(slugify(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCatSlug(e.target.value);
    setIsSlugCustomized(true);
  };

  const handleResetSlug = () => {
    setIsSlugCustomized(false);
    setNewCatSlug(slugify(newCatName));
  };

  // Fetch categories and products from Supabase
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('products').select('*'),
      ]);

      let loadedProducts: Product[] = [];
      if (productsRes.data && productsRes.data.length > 0) {
        loadedProducts = productsRes.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          price: Number(row.price),
          imageUrl: row.image_url || row.imageUrl || '',
          category: row.category_name || row.category || '',
          category_id: row.category_id || '',
          material: row.material || '',
          rating: Number(row.rating ?? 5.0),
          reviews: Number(row.reviews ?? 0),
          description: row.description || '',
          stock: Number(row.stock ?? 0),
        }));
      } else {
        loadedProducts = PRODUCTS;
      }
      setProducts(loadedProducts);

      let loadedCategories: Category[] = [];
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        loadedCategories = categoriesRes.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          created_at: c.created_at,
        }));
      } else {
        // Fallback default category set
        const defaultNames = ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Gifts'];
        loadedCategories = defaultNames.map((name, i) => ({
          id: `cat-${i + 1}`,
          name,
          slug: name.toLowerCase(),
          description: `Handcrafted ${name.toLowerCase()} jewelry collection.`,
        }));
      }
      setCategories(loadedCategories);
    } catch (err) {
      console.error('Error fetching categories & products:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute product counts for each category
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => {
      const matching = products.filter((p) => {
        return (
          (p.category_id && p.category_id === cat.id) ||
          p.category.toLowerCase() === cat.name.toLowerCase() ||
          (p as any).category_name?.toLowerCase() === cat.name.toLowerCase()
        );
      });
      return {
        ...cat,
        productCount: matching.length,
        matchingProducts: matching,
      };
    });
  }, [categories, products]);

  // Filtered categories for display
  const filteredCategories = useMemo(() => {
    return categoriesWithCounts.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [categoriesWithCounts, searchQuery]);

  // Handle Adding New Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = newCatName.trim();
    const slug = newCatSlug.trim();
    const description = newCatDescription.trim();

    // Validation
    if (!name || name.length < 2) {
      setFormError('Category name must be at least 2 characters.');
      return;
    }

    if (!slug) {
      setFormError('Category slug cannot be empty.');
      return;
    }

    // Check duplicate
    const existing = categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() || c.slug.toLowerCase() === slug.toLowerCase()
    );
    if (existing) {
      setFormError(`A category with name "${name}" or slug "${slug}" already exists.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newCategoryObj = {
        name,
        slug,
        description: description || `Jewelry selection for ${name}`,
      };

      const { data, error } = await supabase
        .from('categories')
        .insert([newCategoryObj])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert failed, adding to local view:', error.message);
        // Add to local state if offline/RLS restricts
        const localCat: Category = {
          id: `cat-${Date.now()}`,
          ...newCategoryObj,
        };
        setCategories((prev) => [...prev, localCat]);
      } else if (data) {
        setCategories((prev) => [...prev, data]);
      }

      setSuccessMessage(`Category "${name}" created successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);

      // Reset form
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDescription('');
      setIsSlugCustomized(false);
      setIsAddFormOpen(false);
    } catch (err: any) {
      console.error('Error adding category:', err);
      setFormError(err.message || 'Failed to add category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Category Deletion Check & Execution
  const initiateDelete = (cat: Category & { productCount: number; matchingProducts: Product[] }) => {
    setDeleteError(null);
    setCategoryToDelete(cat);

    // Check constraint: check if matching products exist
    if (cat.productCount > 0) {
      const sampleTitles = cat.matchingProducts
        .slice(0, 3)
        .map((p) => `"${p.title}"`)
        .join(', ');
      setDeleteError(
        `Cannot delete category "${cat.name}". It is associated with ${cat.productCount} product(s) in your catalog (${sampleTitles}${
          cat.productCount > 3 ? '...' : ''
        }). Reassign or delete those products first to maintain catalog integrity.`
      );
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    if (deleteError) return; // Block deletion if constraint violated

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);

      if (error) {
        // Try fallback by name if id match missed
        await supabase.from('categories').delete().eq('name', categoryToDelete.name);
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id && c.name !== categoryToDelete.name));
      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setCategoryToDelete(null);
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setDeleteError(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-serif tracking-wider text-slate-100 uppercase">
              Category CMS Manager
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              Live CMS
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Create, manage, and organize jewelry categories and collection tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              setIsAddFormOpen(!isAddFormOpen);
              setFormError(null);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-950/20 flex items-center gap-2 cursor-pointer"
          >
            {isAddFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddFormOpen ? 'Close Form' : 'Add Category'}</span>
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
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-between text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400/60 hover:text-emerald-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Category Form Drawer / Panel */}
      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-serif text-slate-100 uppercase tracking-wide">
                    Create New Category
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Auto Slug Generation Enabled</span>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddCategory} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Category Name *</span>
                      <span className="text-[10px] text-slate-500 font-normal">e.g. Fine Gold</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fine Gold"
                      value={newCatName}
                      onChange={handleNameChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  {/* Category Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Category Slug *</span>
                      </span>
                      {isSlugCustomized ? (
                        <button
                          type="button"
                          onClick={handleResetSlug}
                          className="text-[10px] text-amber-400 hover:underline"
                        >
                          Reset Auto-Slug
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono">Auto-Generated</span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. fine-gold"
                      value={newCatSlug}
                      onChange={handleSlugChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of this jewelry collection..."
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Save Category</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main CMS Categories Grid & Filter */}
      <div className="space-y-6">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>
              Showing {filteredCategories.length} of {categories.length} Categories
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="py-12 text-center text-slate-500 font-mono">
            Loading jewelry categories from Supabase database...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
            <FolderTree className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-300">No categories found matching your query.</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or click Add Category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id || cat.name}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-5 relative group"
              >
                <div>
                  {/* Top Badge & Slug */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-950 border border-slate-800 text-amber-400 font-medium">
                      <Tag className="w-3 h-3" />
                      <span>/{cat.slug}</span>
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        cat.productCount > 0
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-serif font-bold text-slate-100 uppercase tracking-wide">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-2 font-sans line-clamp-2 leading-relaxed">
                    {cat.description || `Collection of exquisite ${cat.name.toLowerCase()} jewelry.`}
                  </p>
                </div>

                {/* Footer / Actions */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {cat.productCount > 0 ? (
                      <span className="text-emerald-400/90 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Active in Catalog</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Empty Category</span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => initiateDelete(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      cat.productCount > 0
                        ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-slate-950'
                    }`}
                    title={
                      cat.productCount > 0
                        ? `Protected: ${cat.productCount} product(s) linked`
                        : 'Delete Category'
                    }
                  >
                    {cat.productCount > 0 ? <Lock className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal / Integrity Warning Dialog */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl border shrink-0 ${
                    deleteError
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-100">
                    {deleteError ? 'Integrity Constraint Alert' : 'Confirm Category Deletion'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Category: <span className="font-bold text-slate-200">{categoryToDelete.name}</span>
                  </p>
                </div>
              </div>

              {/* Error Message if deletion is prevented */}
              {deleteError ? (
                <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl space-y-2 text-xs text-red-300">
                  <div className="font-semibold text-red-200 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span>Deletion Blocked</span>
                  </div>
                  <p className="leading-relaxed">{deleteError}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to delete category{' '}
                  <strong className="text-amber-400">"{categoryToDelete.name}"</strong>? This action cannot be undone.
                </p>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  {deleteError ? 'Close' : 'Cancel'}
                </button>

                {!deleteError && (
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Confirm Delete</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManager;
