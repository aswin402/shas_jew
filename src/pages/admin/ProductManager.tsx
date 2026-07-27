import React from 'react';
import { Package, Plus } from 'lucide-react';

export const ProductManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif tracking-wide text-slate-100 uppercase">Product Catalog Manager</h1>
          <p className="text-sm text-slate-400">Manage luxury jewelry inventory, pricing, and variants.</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 backdrop-blur-md text-center text-slate-400">
        <Package className="w-12 h-12 text-amber-500/50 mx-auto mb-3" />
        <p className="text-sm">Product Manager functionality will be fully implemented in Task 5.</p>
      </div>
    </div>
  );
};

export default ProductManager;
