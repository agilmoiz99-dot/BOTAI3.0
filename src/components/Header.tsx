import { Zap, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Trading Signals</h1>
              <p className="text-xs text-slate-500">AI-Powered Signal Generator</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Active
            </span>
          </div>

          <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
