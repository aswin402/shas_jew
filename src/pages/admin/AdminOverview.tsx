import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Star,
  FolderTree,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

// Palette for Category distribution visualization
const CATEGORY_COLORS = [
  'from-amber-500 to-amber-600 text-amber-400 bg-amber-500/10 border-amber-500/30',
  'from-rose-500 to-rose-600 text-rose-400 bg-rose-500/10 border-rose-500/30',
  'from-indigo-500 to-indigo-600 text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  'from-emerald-500 to-emerald-600 text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'from-cyan-500 to-cyan-600 text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'from-purple-500 to-purple-600 text-purple-400 bg-purple-500/10 border-purple-500/30',
  'from-yellow-500 to-yellow-600 text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
];

const BAR_COLOR_CLASSES = [
  'bg-amber-400',
  'bg-rose-400',
  'bg-indigo-400',
  'bg-emerald-400',
  'bg-cyan-400',
  'bg-purple-400',
  'bg-yellow-400',
];

export const AdminOverview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Filter state for stock table
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'healthy'>('all');

  const fetchData = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
      ]);

      let loadedProducts: Product[] = [];
      if (productsRes.data && productsRes.data.length > 0) {
        loadedProducts = productsRes.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          price: Number(row.price),
          imageUrl: row.image_url || row.imageUrl || '/images/shas_product_necklace.jpg',
          category: row.category_name || row.category || 'Uncategorized',
          category_id: row.category_id || '',
          material: row.material || '',
          rating: Number(row.rating ?? 5.0),
          reviews: Number(row.reviews ?? 0),
          description: row.description || '',
          stock: row.stock !== undefined && row.stock !== null ? Number(row.stock) : 8,
        }));
      } else {
        // Fallback mock data with assigned stock numbers for demonstration
        loadedProducts = PRODUCTS.map((p, idx) => ({
          ...p,
          stock: idx % 3 === 0 ? (idx === 0 ? 2 : 4) : 12 + idx * 2, // inject some low stock items (<5)
        }));
      }
      setProducts(loadedProducts);

      let loadedCategories: Category[] = [];
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        loadedCategories = categoriesRes.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
        }));
      } else {
        // Fallback category set
        const uniqueCatNames = Array.from(new Set(loadedProducts.map((p) => p.category)));
        loadedCategories = uniqueCatNames.map((name, i) => ({
          id: `cat-${i + 1}`,
          name,
          slug: name.toLowerCase().replace(/ /g, '-'),
        }));
      }
      setCategories(loadedCategories);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching admin overview data:', err);
      // Fallback if error
      const fallbackProds = PRODUCTS.map((p, idx) => ({
        ...p,
        stock: idx === 0 ? 2 : idx === 3 ? 3 : 15,
      }));
      setProducts(fallbackProds);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Key Metrics
  const totalProducts = products.length;
  
  // Low stock products count (items with stock < 5)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (p.stock ?? 0) < 5);
  }, [products]);

  const lowStockCount = lowStockProducts.length;

  // Average rating of products in catalog
  const avgRating = useMemo(() => {
    if (products.length === 0) return 0;
    const total = products.reduce((acc, p) => acc + (p.rating || 0), 0);
    return Number((total / products.length).toFixed(2));
  }, [products]);

  // Category breakdown & distribution
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    const list = Array.from(map.entries()).map(([name, count]) => {
      const percentage = totalProducts > 0 ? ((count / totalProducts) * 100).toFixed(1) : '0';
      return {
        name,
        count,
        percentage: Number(percentage),
      };
    });

    // Ensure all registered categories appear even if count is 0
    categories.forEach((cat) => {
      if (!map.has(cat.name)) {
        list.push({ name: cat.name, count: 0, percentage: 0 });
      }
    });

    return list.sort((a, b) => b.count - a.count);
  }, [products, categories, totalProducts]);

  // Filtered Products for Quick Stock Table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());

      const stockNum = p.stock ?? 0;
      if (stockFilter === 'low') return matchesSearch && stockNum < 5;
      if (stockFilter === 'healthy') return matchesSearch && stockNum >= 5;
      return matchesSearch;
    });
  }, [products, searchQuery, stockFilter]);

  return (
    <div className="space-y-8 text-slate-100 font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-serif tracking-wider text-slate-100 uppercase">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              Live Metrics
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time catalog metrics, inventory alerts, and category breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert Header Banner if items are critically low */}
      {lowStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-rose-950/80 via-amber-950/40 to-slate-900 border border-orange-500/40 rounded-2xl p-5 shadow-lg shadow-orange-950/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center p-3 bg-orange-500/20 border border-orange-500/40 rounded-xl">
              <span className="relative flex h-3 w-3 absolute -top-1 -right-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <ShieldAlert className="w-6 h-6 text-orange-400" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-200 uppercase tracking-wider flex items-center gap-2">
                <span>Inventory Action Required</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/30 border border-red-500/50 text-red-300 font-bold font-mono">
                  {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'} Critical
                </span>
              </h3>
              <p className="text-xs text-orange-300/80 mt-0.5">
                {lowStockCount === 1
                  ? '1 product has stock under 5 units.'
                  : `${lowStockCount} products have stock below the threshold of 5 units.`}{' '}
                Review catalog inventory levels below to restock.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStockFilter('low')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>View Low Stock</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Key Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Products */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-serif text-slate-100">
              {isLoading ? '...' : totalProducts}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Catalog Inventory</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Low Stock Alert Card with Pulsing Red-Orange Indicator */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className={`bg-slate-900/70 border rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between transition-colors ${
            lowStockCount > 0
              ? 'border-orange-500/50 bg-gradient-to-b from-orange-950/20 to-slate-900/80 hover:border-orange-400'
              : 'border-slate-800/80 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Low Stock Alert (<5)
            </span>
            <div
              className={`p-2.5 rounded-xl border relative ${
                lowStockCount > 0
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}
            >
              {/* Animated Red-Orange Pulse Indicator */}
              {lowStockCount > 0 && (
                <span className="relative flex h-3 w-3 absolute -top-1 -right-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold font-serif ${lowStockCount > 0 ? 'text-orange-400' : 'text-slate-100'}`}>
                {isLoading ? '...' : lowStockCount}
              </span>
              <span className="text-xs text-slate-400 font-normal">items critical</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-2 font-medium">
              {lowStockCount > 0 ? (
                <span className="text-orange-400 flex items-center gap-1.5 font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Restock recommended
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All stock healthy
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Average Product Rating */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/70 border border-slate-800/80 hover:border-yellow-500/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rating</span>
            <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Star className="w-5 h-5 fill-yellow-500/20" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-serif text-slate-100">
                {isLoading ? '...' : avgRating}
              </span>
              <span className="text-xs text-yellow-400 font-semibold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 font-medium">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-[11px] text-slate-500">Customer feedback</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 4: Active Categories */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Categories</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-serif text-slate-100">
              {isLoading ? '...' : categories.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>Jewelry Collections</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown & Distribution Chart Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-4">
          <div>
            <h2 className="text-lg font-serif tracking-wide text-slate-100 uppercase flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-400" />
              <span>Category Distribution</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual proportion of products listed per collection.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/50 self-start sm:self-auto font-mono">
            {categories.length} Registered Categories
          </span>
        </div>

        {/* Custom Progress Bar Distribution Chart */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Catalog Spread</span>
            <span>100% Total ({totalProducts} Products)</span>
          </div>

          <div className="h-4 w-full bg-slate-950/80 rounded-xl overflow-hidden p-0.5 border border-slate-800 flex">
            {categoryBreakdown.map((item, idx) => {
              if (item.percentage === 0) return null;
              const colorClass = BAR_COLOR_CLASSES[idx % BAR_COLOR_CLASSES.length];
              return (
                <div
                  key={item.name}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.name}: ${item.count} items (${item.percentage}%)`}
                  className={`h-full ${colorClass} transition-all duration-500 first:rounded-l-lg last:rounded-r-lg hover:brightness-125 cursor-pointer relative group`}
                />
              );
            })}
          </div>

          {/* Legend row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
            {categoryBreakdown.map((item, idx) => {
              const colorClass = BAR_COLOR_CLASSES[idx % BAR_COLOR_CLASSES.length];
              return (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                  <span className="font-medium">{item.name}:</span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.count} ({item.percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid of Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
          {categoryBreakdown.map((cat, idx) => {
            const styleColor = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            const barColor = BAR_COLOR_CLASSES[idx % BAR_COLOR_CLASSES.length];
            return (
              <div
                key={cat.name}
                className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700/80 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate">{cat.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styleColor}`}>
                    {cat.count} items
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Catalog ratio</span>
                    <span>{cat.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stock Check & Recent Products Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div>
            <h2 className="text-lg font-serif tracking-wide text-slate-100 uppercase flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>Catalog Quick Stock Check</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inventory statuses, stock alerts, and product overview.
            </p>
          </div>

          {/* Controls: Search + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 w-44 md:w-56"
              />
            </div>

            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  stockFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setStockFilter('low')}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  stockFilter === 'low'
                    ? 'bg-orange-500 text-slate-950 font-bold'
                    : 'text-orange-400 hover:text-orange-300'
                }`}
              >
                {lowStockCount > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                Low Stock ({lowStockCount})
              </button>
              <button
                onClick={() => setStockFilter('healthy')}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  stockFilter === 'healthy'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Healthy ({products.length - lowStockCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    Loading live inventory data from database...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    No products found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockNum = product.stock ?? 0;
                  const isLow = stockNum < 5;
                  return (
                    <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-950"
                          />
                          <div>
                            <div className="font-serif font-semibold text-slate-100 text-sm">
                              {product.title}
                            </div>
                            <div className="text-[11px] text-slate-400 italic font-sans truncate max-w-xs">
                              {product.material}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-amber-400 text-sm">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-slate-200">{product.rating}</span>
                          <span className="text-slate-500 text-[10px]">({product.reviews})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-400 font-semibold text-xs">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                            <span>Low Stock ({stockNum} left)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock ({stockNum} units)</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
