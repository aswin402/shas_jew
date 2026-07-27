import React from 'react';
import { LayoutDashboard, TrendingUp, Package, Users, DollarSign } from 'lucide-react';

export const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif tracking-wide text-slate-100 uppercase">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Welcome to Shas Jewelry administrative control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$45,230', icon: DollarSign, change: '+12.5%' },
          { label: 'Active Products', value: '128', icon: Package, change: '+4 new' },
          { label: 'Total Orders', value: '342', icon: TrendingUp, change: '+8.2%' },
          { label: 'Customers', value: '1,204', icon: Users, change: '+15.3%' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-semibold text-slate-100">{stat.value}</div>
            <div className="text-xs text-amber-400 mt-1">{stat.change} from last month</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
