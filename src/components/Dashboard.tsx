import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TradingSignal } from '../lib/types';
import { generateSignal, getCurrentSession, getTimeUntilNextInterval } from '../lib/signalGenerator';
import SignalCard from './SignalCard';
import SessionIndicator from './SessionIndicator';
import { Play, Pause, Trash2, Activity, TrendingUp, Zap, History, Settings } from 'lucide-react';

export default function Dashboard() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [session, setSession] = useState(getCurrentSession());
  const [nextSignalIn, setNextSignalIn] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadSignals();

    const subscription = supabase
      .channel('trading_signals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trading_signals' }, () => {
        loadSignals();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getCurrentSession());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isAutoMode) {
      const scheduleNextSignal = () => {
        const timeUntil = getTimeUntilNextInterval();

        const updateCountdown = () => {
          const remaining = getTimeUntilNextInterval();
          const seconds = Math.floor(remaining / 1000);
          const minutes = Math.floor(seconds / 60);
          const secs = seconds % 60;
          setNextSignalIn(`${minutes}:${secs.toString().padStart(2, '0')}`);
        };

        interval = setInterval(updateCountdown, 1000);
        updateCountdown();

        timeout = setTimeout(async () => {
          await generateAndSaveSignal();
          scheduleNextSignal();
        }, timeUntil);
      };

      scheduleNextSignal();
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setNextSignalIn('');
    };
  }, [isAutoMode]);

  const loadSignals = async () => {
    const { data, error } = await supabase
      .from('trading_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setSignals(data);
      if (data.length > 0) {
        const latest = data[0];
        const now = new Date();
        const endTime = new Date(latest.end_time);
        if (now < endTime) {
          setCurrentSignal(latest);
        } else {
          setCurrentSignal(null);
        }
      }
    }
  };

  const sendToTelegram = async (signal: TradingSignal) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-telegram-signal`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signal }),
      });

      if (!response.ok) {
        console.error('Failed to send Telegram notification');
      }
    } catch (error) {
      console.error('Telegram error:', error);
    }
  };

  const generateAndSaveSignal = async () => {
    setIsGenerating(true);
    const newSignal = generateSignal();

    if (newSignal) {
      const { data, error } = await supabase
        .from('trading_signals')
        .insert([newSignal])
        .select()
        .single();

      if (!error && data) {
        setCurrentSignal(data);
        await sendToTelegram(data);
      }
    }
    setIsGenerating(false);
  };

  const clearHistory = async () => {
    const confirmed = window.confirm('Are you sure you want to clear all signal history?');
    if (confirmed) {
      await supabase.from('trading_signals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      setSignals([]);
      setCurrentSignal(null);
    }
  };

  const toggleMode = () => {
    setIsAutoMode(!isAutoMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900">Trading Signals</h1>
          </div>
          <p className="text-slate-500 ml-12 text-lg">AI-powered M5 binary options signal generator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SessionIndicator session={session} />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Operation Mode</span>
              </div>
            </div>

            <button
              onClick={toggleMode}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mb-4 ${
                isAutoMode
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {isAutoMode ? (
                <>
                  <Pause className="w-4 h-4" />
                  Auto Mode Active
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Manual Mode
                </>
              )}
            </button>

            {isAutoMode && nextSignalIn && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-4 border border-blue-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">Next Signal In</p>
                <p className="text-3xl font-bold text-blue-600">{nextSignalIn}</p>
              </div>
            )}

            {!isAutoMode && (
              <button
                onClick={generateAndSaveSignal}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-300 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                {isGenerating ? 'Analyzing...' : 'Generate Signal'}
              </button>
            )}

            <button
              onClick={clearHistory}
              className="w-full mt-3 bg-red-50 hover:bg-red-100 border border-red-200 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        </div>

        {currentSignal && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-slate-900">Active Signal</h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">LIVE</span>
            </div>
            <SignalCard signal={currentSignal} />
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-5">
            <History className="w-6 h-6 text-slate-900" />
            <h2 className="text-2xl font-bold text-slate-900">Signal History</h2>
          </div>
          {signals.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-sm">
              <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No signals generated yet</p>
              <p className="text-slate-400 text-sm mt-2">Start generating signals to see the history here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {signals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
