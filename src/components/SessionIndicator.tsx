import { MarketSession } from '../lib/types';
import { Globe } from 'lucide-react';

interface SessionIndicatorProps {
  session: MarketSession;
}

export default function SessionIndicator({ session }: SessionIndicatorProps) {
  const getSessionColor = (name: string) => {
    switch (name) {
      case 'Asian':
        return 'from-amber-500 to-orange-600';
      case 'London':
        return 'from-blue-600 to-blue-700';
      case 'New York':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <div className={`rounded-xl p-6 bg-gradient-to-br ${getSessionColor(session.name)} text-white shadow-lg border border-white/10`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold opacity-90">Market Session</p>
            <p className="text-2xl font-bold">{session.name}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/20">
        <p className="text-xs font-semibold opacity-75 mb-3">Trading Pairs</p>
        <div className="flex flex-wrap gap-2">
          {session.pairs.map((pair) => (
            <span key={pair} className="px-3 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold transition-colors">
              {pair}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
