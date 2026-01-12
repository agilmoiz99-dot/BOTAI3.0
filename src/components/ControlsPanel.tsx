import { Play, Pause, Trash2, TrendingUp, Settings } from 'lucide-react';

interface ControlsPanelProps {
  isAutoMode: boolean;
  nextSignalIn: string;
  isGenerating: boolean;
  onToggleMode: () => void;
  onGenerateSignal: () => void;
  onClearHistory: () => void;
}

export default function ControlsPanel({
  isAutoMode,
  nextSignalIn,
  isGenerating,
  onToggleMode,
  onGenerateSignal,
  onClearHistory,
}: ControlsPanelProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-fit sticky top-28">
      <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-200">
        <Settings className="w-5 h-5 text-slate-600" />
        <span className="text-sm font-bold text-slate-900">Controls</span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-3">Operation Mode</p>
          <button
            onClick={onToggleMode}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isAutoMode
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            {isAutoMode ? (
              <>
                <Pause className="w-4 h-4" />
                Auto Mode
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Manual Mode
              </>
            )}
          </button>
        </div>

        {isAutoMode && nextSignalIn && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Next Signal</p>
            <p className="text-3xl font-bold text-blue-600 font-mono">{nextSignalIn}</p>
          </div>
        )}

        {!isAutoMode && (
          <button
            onClick={onGenerateSignal}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-300 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-5 h-5" />
            {isGenerating ? 'Analyzing...' : 'Generate Signal'}
          </button>
        )}

        <button
          onClick={onClearHistory}
          className="w-full bg-red-50 hover:bg-red-100 border border-red-200 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-red-600 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>
    </div>
  );
}
