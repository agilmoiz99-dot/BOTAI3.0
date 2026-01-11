import { TradingSignal } from '../lib/types';
import { TrendingUp, TrendingDown, Target, Clock, Gauge } from 'lucide-react';

interface SignalCardProps {
  signal: TradingSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isBuy = signal.action === 'BUY';

  return (
    <div className={`rounded-xl overflow-hidden shadow-md border transition-all hover:shadow-lg hover:scale-105 ${
      isBuy
        ? 'bg-white border-emerald-200'
        : 'bg-white border-red-200'
    }`}>
      <div className={`h-2 ${isBuy ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{signal.session} Session</p>
            <p className="text-3xl font-bold text-slate-900">{signal.pair}</p>
          </div>
          <div className={`p-3 rounded-lg ${isBuy ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {isBuy ? (
              <TrendingUp className={`w-6 h-6 ${isBuy ? 'text-emerald-600' : 'text-red-600'}`} />
            ) : (
              <TrendingDown className={`w-6 h-6 ${isBuy ? 'text-emerald-600' : 'text-red-600'}`} />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-semibold text-slate-600">Signal</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${isBuy ? 'text-emerald-600' : 'text-red-600'}`}>
                {signal.action}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${isBuy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {isBuy ? 'CALL' : 'PUT'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-600">Confidence</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{signal.confidence}%</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <p className="text-xs font-semibold text-slate-600">Start</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{formatTime(signal.start_time)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                <Target className="w-4 h-4 text-slate-600" />
                <p className="text-xs font-semibold text-slate-600">End</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{formatTime(signal.end_time)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
