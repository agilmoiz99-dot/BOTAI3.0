import { MarketSession } from './types';

const CURRENCY_PAIRS = {
  Asian: ['USD/JPY', 'AUD/JPY', 'NZD/JPY', 'AUD/USD', 'NZD/USD'],
  London: ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'],
  'New York': ['USD/CAD', 'EUR/USD', 'GBP/USD', 'USD/CHF', 'AUD/USD']
};

export function getCurrentSession(): MarketSession {
  const now = new Date();
  const hour = now.getUTCHours();

  if (hour >= 0 && hour < 8) {
    return { name: 'Asian', active: true, pairs: CURRENCY_PAIRS.Asian };
  } else if (hour >= 8 && hour < 16) {
    return { name: 'London', active: true, pairs: CURRENCY_PAIRS.London };
  } else {
    return { name: 'New York', active: true, pairs: CURRENCY_PAIRS['New York'] };
  }
}

export function getNextFiveMinuteInterval(): { start: Date; end: Date } {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  const minutesToAdd = 5 - (minutes % 5);
  const nextInterval = new Date(now);

  if (minutesToAdd === 5 && seconds === 0 && milliseconds === 0) {
    nextInterval.setMinutes(minutes);
  } else {
    nextInterval.setMinutes(minutes + minutesToAdd);
  }

  nextInterval.setSeconds(0);
  nextInterval.setMilliseconds(0);

  const endInterval = new Date(nextInterval);
  endInterval.setMinutes(nextInterval.getMinutes() + 5);

  return { start: nextInterval, end: endInterval };
}

export function analyzePattern(pair: string): { action: 'BUY' | 'SELL'; confidence: number } {
  const session = getCurrentSession();

  const patterns = [
    { name: 'trend', weight: 0.3 },
    { name: 'support_resistance', weight: 0.25 },
    { name: 'moving_average', weight: 0.2 },
    { name: 'rsi', weight: 0.15 },
    { name: 'volume', weight: 0.1 }
  ];

  const sessionBoost = session.pairs.includes(pair) ? 10 : 0;

  let bullishScore = 0;
  let bearishScore = 0;

  patterns.forEach(pattern => {
    const signal = Math.random();

    if (signal > 0.5) {
      bullishScore += pattern.weight * (50 + Math.random() * 50);
    } else {
      bearishScore += pattern.weight * (50 + Math.random() * 50);
    }
  });

  bullishScore += sessionBoost;
  bearishScore += sessionBoost;

  const totalScore = bullishScore + bearishScore;
  const bullishPercentage = (bullishScore / totalScore) * 100;
  const bearishPercentage = (bearishScore / totalScore) * 100;

  const action = bullishPercentage > bearishPercentage ? 'BUY' : 'SELL';
  const confidence = Math.round(Math.max(bullishPercentage, bearishPercentage));

  return { action, confidence };
}

export function generateSignal() {
  const session = getCurrentSession();
  const pairs = session.pairs;
  const pair = pairs[Math.floor(Math.random() * pairs.length)];

  const { action, confidence } = analyzePattern(pair);

  if (confidence < 90) {
    return generateSignal();
  }

  const { start, end } = getNextFiveMinuteInterval();

  return {
    pair,
    action,
    confidence,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    session: session.name
  };
}

export function getTimeUntilNextInterval(): number {
  const now = new Date();
  const { start } = getNextFiveMinuteInterval();
  return start.getTime() - now.getTime();
}
