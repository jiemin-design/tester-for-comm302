import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ChevronRight } from 'lucide-react';
import {
  QUICK_INDICES,
  WORLD_INDICES,
  TOP_US_STOCKS,
  COMMUNITY_TRENDS,
  QUICK_CRYPTO,
  FUTURES_COMMODITIES,
  FOREX_CURRENCIES,
  US_BONDS,
  ETFS_DATA,
  MarketItem
} from '../data/marketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten searchable pool into standard MarketItem structure
  const allSearchItems: MarketItem[] = [
    ...QUICK_INDICES,
    ...WORLD_INDICES.map((w) => ({
      id: w.symbol.toLowerCase(),
      symbol: w.symbol,
      name: w.name,
      category: 'indices' as const,
      price: w.numericLast,
      formattedPrice: w.last,
      change: w.isPositive ? 10 : -10,
      changePercent: parseFloat(w.chgPercent.replace('%', '')),
      countryCode: w.code,
    })),
    ...TOP_US_STOCKS,
    ...COMMUNITY_TRENDS.map((t) => ({
      id: t.symbol.toLowerCase(),
      symbol: t.symbol,
      name: t.name,
      category: 'stocks' as const,
      price: t.numericPrice,
      formattedPrice: t.price,
      change: t.isPositive ? 2.5 : -2.5,
      changePercent: parseFloat(t.change.replace('%', '')),
    })),
    ...QUICK_CRYPTO,
    ...FUTURES_COMMODITIES.map((f) => ({
      id: f.symbol.toLowerCase(),
      symbol: f.symbol,
      name: f.name,
      category: 'futures' as const,
      price: f.numericPrice,
      formattedPrice: f.price,
      change: f.isPositive ? 1.2 : -1.2,
      changePercent: parseFloat(f.change.replace('%', '')),
    })),
    ...FOREX_CURRENCIES.map((fx) => ({
      id: fx.symbol.toLowerCase(),
      symbol: fx.symbol,
      name: fx.name,
      category: 'forex' as const,
      price: fx.numericPrice,
      formattedPrice: fx.price,
      change: fx.isPositive ? 0.002 : -0.002,
      changePercent: parseFloat(fx.change.replace('%', '')),
    })),
    ...US_BONDS.map((b) => ({
      id: b.symbol.toLowerCase(),
      symbol: b.symbol,
      name: `${b.maturity} Treasury Yield`,
      category: 'bonds' as const,
      price: b.numericYield,
      formattedPrice: b.yieldRate,
      change: -0.1,
      changePercent: parseFloat(b.dayChange.replace('%', '')),
    })),
    ...ETFS_DATA.map((e) => ({
      id: e.symbol.toLowerCase(),
      symbol: e.symbol,
      name: e.name,
      category: 'etfs' as const,
      price: parseFloat(e.price.replace('$', '')),
      formattedPrice: e.price,
      change: 1.5,
      changePercent: parseFloat(e.change.replace('%', '')),
    })),
  ];

  // Deduplicate by symbol
  const uniqueItems = Array.from(new Map(allSearchItems.map((item) => [item.symbol, item])).values());

  const filtered = uniqueItems.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      item.category === activeTab ||
      (activeTab === 'stocks' && item.category === 'stocks') ||
      (activeTab === 'crypto' && item.category === 'crypto') ||
      (activeTab === 'indices' && item.category === 'indices');

    const matchesQuery =
      query.trim() === '' ||
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());

    return matchesTab && matchesQuery;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'indices', label: 'Indices' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-[#E0E3EB] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E0E3EB] dark:border-[#2a2e39] gap-3">
          <Search className="w-5 h-5 text-[#6A6D78] dark:text-[#787b86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, crypto, or forex pair (e.g. AAPL, BTC, Gold)..."
            className="flex-1 bg-transparent text-[#131722] dark:text-white placeholder-[#6A6D78] dark:placeholder-[#787b86] focus:outline-none text-[15px]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2e39] text-[#6A6D78]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-[#F0F3FA] dark:bg-[#2a2e39] text-[#6A6D78] dark:text-[#9ea2b0] hover:text-[#131722]"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#E0E3EB] dark:border-[#2a2e39] overflow-x-auto no-scrollbar bg-[#F0F3FA]/40 dark:bg-[#131722]/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#6A6D78] dark:text-[#9ea2b0] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#E0E3EB]/40 dark:divide-[#2a2e39]/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#6A6D78] dark:text-[#787b86]">
              <p className="text-sm">No assets found matching "{query}"</p>
              <p className="text-xs mt-1">Try searching for AAPL, NVDA, BTC, Gold, or EUR/USD</p>
            </div>
          ) : (
            filtered.slice(0, 15).map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <button
                  key={item.symbol}
                  onClick={() => {
                    onSelectAsset(item);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39] transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F0F3FA] dark:bg-[#131722] flex items-center justify-center font-bold text-xs text-[#2962ff] shrink-0 border border-[#E0E3EB] dark:border-[#2a2e39]">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F0F3FA] dark:bg-[#131722] text-[#6A6D78] dark:text-[#787b86]">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#6A6D78] dark:text-[#787b86] truncate">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <div className="font-mono text-sm font-bold text-[#131722] dark:text-white">
                        {item.formattedPrice || `$${item.price.toFixed(2)}`}
                      </div>
                      <div
                        className={`font-mono text-xs font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6A6D78] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F0F3FA]/70 dark:bg-[#131722]/70 border-t border-[#E0E3EB] dark:border-[#2a2e39] flex items-center justify-between text-[11px] text-[#6A6D78] dark:text-[#787b86]">
          <span>Real-time quotes powered by BATS & Global Exchanges</span>
          <span className="font-mono">Showing {Math.min(filtered.length, 15)} of {filtered.length}</span>
        </div>
      </div>
    </div>
  );
};
