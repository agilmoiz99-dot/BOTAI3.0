import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: 'trending' | 'signals' | 'success';
  theme?: 'blue' | 'emerald' | 'orange';
}

export default function StatsCard({ label, value, change, icon, theme = 'blue' }: StatsCardProps) {
  const themeClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const iconMap = {
    trending: TrendingUp,
    signals: Zap,
    success: TrendingUp,
  };

  const IconComponent = iconMap[icon];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${themeClasses[theme]}`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {change && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          change.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {change.trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change.value)}% this session
        </div>
      )}
    </div>
  );
}
