import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  TrendingUp,
  BarChart2,
  Flame,
  Globe,
  SlidersHorizontal,
  ExternalLink,
  ArrowUpRight,
  Info
} from 'lucide-react';

import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { SearchModal } from './components/SearchModal';
import { ChartModal } from './components/ChartModal';
import { ScreenerModal } from './components/ScreenerModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';

import {
  QUICK_INDICES,
  WORLD_INDICES,
  TOP_US_STOCKS,
  COMMUNITY_TRENDS,
  HIGHEST_VOLUME_STOCKS,
  STOCK_GAINERS,
  STOCK_LOSERS,
  WORLD_BIGGEST_COMPANIES,
  QUICK_CRYPTO,
  CRYPTO_MARKET_CAP_TABLE,
  DEFI_TVL_TABLE,
  FUTURES_COMMODITIES,
  FOREX_CURRENCIES,
  US_BONDS,
  ECONOMIC_INDICATORS,
  ETFS_DATA,
  MarketItem,
  WorldIndex,
  BondData
} from './data/marketData';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modals and Drawers
  const [searchOpen, setSearchOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [screenerOpen, setScreenerOpen] = useState(false);
  const [screenerInitialType, setScreenerInitialType] = useState<'stocks' | 'crypto'>('stocks');
  const [selectedAsset, setSelectedAsset] = useState<MarketItem | null>(null);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'BTC', 'ETH']);

  // UI States
  const [stockTab, setStockTab] = useState<'gainers' | 'losers'>('gainers');
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('everywhere');
  const [activeCategory, setActiveCategory] = useState('indices');
  const [yieldCurveMode, setYieldCurveMode] = useState<'normal' | 'inverted'>('normal');

  // Live price updates toggle & simulation
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live ticking
  useEffect(() => {
    if (!liveUpdates) return;
    const interval = setInterval(() => {
      const candidates = ['NVDA', 'AAPL', 'BTC', 'TSLA', 'SP500', 'Gold', 'EUR/USD'];
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const direction = Math.random() > 0.4 ? 'up' : 'down';

      setFlashingSymbols((prev) => ({ ...prev, [chosen]: direction }));

      setTimeout(() => {
        setFlashingSymbols((prev) => {
          const next = { ...prev };
          delete next[chosen];
          return next;
        });
      }, 1200);
    }, 3500);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleOpenScreener = (type: 'stocks' | 'crypto') => {
    setScreenerInitialType(type);
    setScreenerOpen(true);
  };

  const scrollToSection = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Convert generic rows to MarketItem for Superchart inspection
  const openChartForSymbol = (symbol: string, name: string, price: number, changePercent: number, category: MarketItem['category'] = 'stocks') => {
    setSelectedAsset({
      id: symbol.toLowerCase(),
      symbol,
      name,
      category,
      price,
      formattedPrice: typeof price === 'number' ? `$${price.toLocaleString()}` : price,
      change: (price * changePercent) / 100,
      changePercent,
    });
  };

  return (
    <div className="bg-white dark:bg-[#131722] text-[#131722] dark:text-[#d1d4dc] min-h-screen font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        liveUpdates={liveUpdates}
        onToggleLiveUpdates={() => setLiveUpdates(!liveUpdates)}
        onSelectNav={(path) => {
          if (path === 'markets') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setSearchOpen(true);
          }
        }}
        activeNav="markets"
      />

      {/* Main Content Viewport */}
      <main className="w-full pt-16">
        <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-12">
          {/* Hero Section with Dropdown Region Selector */}
          <div className="flex flex-col items-center justify-center text-center pt-4 pb-2 relative">
            <div className="relative">
              <button
                onClick={() => setRegionMenuOpen(!regionMenuOpen)}
                className="group inline-flex items-center gap-2 text-[#131722] dark:text-white hover:text-[#2962ff] dark:hover:text-[#2962ff] transition-colors cursor-pointer select-none"
                type="button"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-extrabold group-hover:text-[#2962ff] transition-colors">
                  {selectedRegion === 'everywhere' && 'Markets, everywhere'}
                  {selectedRegion === 'us' && 'Markets, United States'}
                  {selectedRegion === 'europe' && 'Markets, Europe'}
                  {selectedRegion === 'asia' && 'Markets, Asia-Pacific'}
                  {selectedRegion === 'crypto' && 'Markets, Crypto & Web3'}
                </h1>
                <ChevronDown className="w-8 h-8 text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-transform group-hover:translate-y-0.5" />
              </button>

              {/* Region Dropdown Menu */}
              {regionMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39] rounded-2xl shadow-xl py-2 z-50 text-left">
                  <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] dark:text-[#787b86]">
                    Select Market Region
                  </div>
                  {[
                    { id: 'everywhere', label: 'Everywhere (Global)' },
                    { id: 'us', label: 'United States' },
                    { id: 'europe', label: 'Europe' },
                    { id: 'asia', label: 'Asia-Pacific' },
                    { id: 'crypto', label: 'Crypto & Web3' },
                  ].map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => {
                        setSelectedRegion(reg.id);
                        setRegionMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                        selectedRegion === reg.id
                          ? 'bg-[#2962ff]/10 text-[#2962ff] font-bold'
                          : 'text-[#131722] dark:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39]'
                      }`}
                    >
                      <span>{reg.label}</span>
                      {selectedRegion === reg.id && <span className="w-2 h-2 rounded-full bg-[#2962ff]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-[#6A6D78] dark:text-[#787b86] mt-2 max-w-xl">
              Real-time quotes, global indices, equities, crypto, and macroeconomic health in one place
            </p>

            {/* Quick Market Sentiment & Breadth Pill */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F3FA] dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39]">
                <span className="text-[#6A6D78] dark:text-[#787b86]">Market Breadth:</span>
                <span className="font-mono font-bold text-[#089981]">62% Advancing</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F3FA] dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39]">
                <span className="text-[#6A6D78] dark:text-[#787b86]">Fear &amp; Greed:</span>
                <span className="font-mono font-bold text-[#089981]">64 (Greed)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F3FA] dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39]">
                <span className="text-[#6A6D78] dark:text-[#787b86]">VIX Volatility:</span>
                <span className="font-mono font-bold text-[#131722] dark:text-white">14.82 (-2.1%)</span>
              </div>
            </div>
          </div>

          {/* Sticky Category Filter Bar */}
          <CategoryNav activeCategory={activeCategory} onSelectCategory={scrollToSection} />

          {/* SECTION 1: INDICES */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="indices">
            <div className="flex items-center justify-between">
              <a
                href="#indices"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('indices');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Indices
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#6A6D78] dark:text-[#787b86]">
                <span>Market Open</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#089981]"></span>
                </span>
              </div>
            </div>

            {/* Quick Index Pill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              {QUICK_INDICES.map((idx) => {
                const isPositive = idx.changePercent >= 0;
                const isFlashing = flashingSymbols[idx.symbol];
                return (
                  <button
                    key={idx.symbol}
                    onClick={() => setSelectedAsset(idx)}
                    className={`flex flex-col justify-between p-3.5 rounded-2xl bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all shadow-xs hover:shadow text-left group border border-transparent hover:border-[#2962ff]/30 ${
                      isFlashing === 'up' ? 'flash-up' : isFlashing === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
                          style={{ backgroundColor: idx.badgeColor }}
                        >
                          {idx.badge}
                        </span>
                        <span className="text-[14px] font-semibold text-[#131722] dark:text-white truncate group-hover:text-[#2962ff] transition-colors">
                          {idx.symbol}
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[12px] font-semibold shrink-0 ${
                          isPositive
                            ? 'text-[#089981] bg-[#089981]/10'
                            : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {idx.changePercent}%
                      </span>
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <span className="font-mono text-[18px] text-[#131722] dark:text-white font-bold">
                        {idx.formattedPrice}
                      </span>
                      <svg
                        className={`w-16 h-6 ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}
                        fill="none"
                        viewBox="0 0 64 24"
                      >
                        {isPositive ? (
                          <path
                            d="M1 18 L14 12 L28 15 L42 7 L54 9 L63 2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        ) : (
                          <path
                            d="M1 4 L16 9 L30 6 L44 14 L55 12 L63 20"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        )}
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* World Indices Table Block */}
            <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 md:p-6 shadow-xs flex flex-col gap-4 border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
              <div className="flex items-center justify-between">
                <a
                  href="#indices"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('indices');
                  }}
                  className="group inline-flex items-center gap-1"
                >
                  <h3 className="text-xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                    World indices
                  </h3>
                  <ChevronRight className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
                </a>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-xs text-[#2962ff] hover:underline font-semibold"
                >
                  See all major indices
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#6A6D78] dark:text-[#787b86] text-xs">
                      <th className="py-2 font-semibold">Index</th>
                      <th className="py-2 font-semibold text-right">Last</th>
                      <th className="py-2 font-semibold text-right">Chg</th>
                      <th className="py-2 font-semibold text-right">Chg %</th>
                      <th className="py-2 font-semibold text-right hidden sm:table-cell">52W Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {WORLD_INDICES.map((w) => (
                      <tr
                        key={w.symbol}
                        onClick={() =>
                          openChartForSymbol(w.symbol, w.name, w.numericLast, parseFloat(w.chgPercent.replace('%', '')), 'indices')
                        }
                        className="hover:bg-[#E0E3EB]/70 dark:hover:bg-[#2a2e39]/70 transition-colors group cursor-pointer rounded-xl"
                      >
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#E0E3EB] dark:bg-[#2a2e39] text-[#131722] dark:text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {w.code}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-semibold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                                {w.symbol}
                              </span>
                              <span className="text-xs text-[#6A6D78] dark:text-[#787b86]">{w.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-mono text-[13px] font-bold text-[#131722] dark:text-white">
                          {w.last}
                        </td>
                        <td
                          className={`py-2.5 text-right font-mono text-[13px] font-semibold ${
                            w.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {w.chg}
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded font-mono text-[13px] font-semibold ${
                              w.isPositive
                                ? 'text-[#089981] bg-[#089981]/10'
                                : 'text-[#f23645] bg-[#f23645]/10'
                            }`}
                          >
                            {w.chgPercent}
                          </span>
                        </td>
                        <td className="py-2.5 text-right hidden sm:table-cell font-mono text-xs text-[#6A6D78] dark:text-[#787b86]">
                          {w.range52w}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 2: US STOCKS */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="us-stocks">
            <div className="flex items-center justify-between">
              <a
                href="#us-stocks"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('us-stocks');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  US stocks
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => handleOpenScreener('stocks')}
                className="px-4 py-1.5 rounded-full bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2962ff]" />
                <span>Stock Screener</span>
              </button>
            </div>

            {/* Quick Ticker Horizontal Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {TOP_US_STOCKS.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                const isFlashing = flashingSymbols[stock.symbol];
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedAsset(stock)}
                    className={`p-3.5 rounded-2xl bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all flex flex-col justify-between group text-left border border-transparent hover:border-[#2962ff]/30 ${
                      isFlashing === 'up' ? 'flash-up' : isFlashing === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                        {stock.symbol}
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {stock.changePercent}%
                      </span>
                    </div>
                    <span className="text-xs text-[#6A6D78] dark:text-[#787b86] truncate mt-0.5">
                      {stock.name}
                    </span>
                    <span className="font-mono text-[18px] text-[#131722] dark:text-white font-bold mt-2">
                      {stock.formattedPrice}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3-Column US Stocks Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Col 1: Community Trends */}
              <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 shadow-xs flex flex-col justify-between border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#131722] dark:text-white">Community trends</h3>
                    <Flame className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    {COMMUNITY_TRENDS.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() =>
                          openChartForSymbol(item.symbol, item.name, item.numericPrice, parseFloat(item.change.replace('%', '')))
                        }
                        className="w-full flex items-center justify-between p-2 hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] rounded-xl transition-colors group text-left"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#6A6D78] dark:text-[#787b86] truncate max-w-[140px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-[#131722] dark:text-white">
                            {item.price}
                          </div>
                          <div
                            className={`font-mono text-[11px] ${
                              item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {item.change}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="mt-4 text-center py-2 rounded-full bg-white dark:bg-[#131722] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white text-xs font-semibold transition-colors border border-[#E0E3EB] dark:border-[#2a2e39]"
                >
                  See all community trends
                </button>
              </div>

              {/* Col 2: Highest Volume Stocks */}
              <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 shadow-xs flex flex-col justify-between border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#131722] dark:text-white">
                      Highest volume stocks
                    </h3>
                    <BarChart2 className="w-5 h-5 text-[#2962ff]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    {HIGHEST_VOLUME_STOCKS.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() =>
                          openChartForSymbol(item.symbol, item.name, item.numericPrice, parseFloat(item.change.replace('%', '')))
                        }
                        className="w-full flex items-center justify-between p-2 hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] rounded-xl transition-colors group text-left"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#6A6D78] dark:text-[#787b86] truncate max-w-[140px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-[#131722] dark:text-white">
                            {item.volume}
                          </div>
                          <div className="font-mono text-[11px] text-[#089981]">{item.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenScreener('stocks')}
                  className="mt-4 text-center py-2 rounded-full bg-white dark:bg-[#131722] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white text-xs font-semibold transition-colors border border-[#E0E3EB] dark:border-[#2a2e39]"
                >
                  See all actively traded stocks
                </button>
              </div>

              {/* Col 3: Stock Gainers & Losers Tabbed */}
              <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 shadow-xs flex flex-col justify-between border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 p-0.5 rounded-full bg-white dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2a2e39]">
                      <button
                        onClick={() => setStockTab('gainers')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          stockTab === 'gainers'
                            ? 'bg-[#089981] text-white shadow-xs'
                            : 'text-[#6A6D78] dark:text-[#787b86] hover:text-[#131722]'
                        }`}
                      >
                        Gainers
                      </button>
                      <button
                        onClick={() => setStockTab('losers')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          stockTab === 'losers'
                            ? 'bg-[#f23645] text-white shadow-xs'
                            : 'text-[#6A6D78] dark:text-[#787b86] hover:text-[#131722]'
                        }`}
                      >
                        Losers
                      </button>
                    </div>
                    <span className="text-xs text-[#6A6D78] dark:text-[#787b86]">Regular hours</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {(stockTab === 'gainers' ? STOCK_GAINERS : STOCK_LOSERS).map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() =>
                          openChartForSymbol(item.symbol, item.name, item.numericPrice, parseFloat(item.change.replace('%', '')))
                        }
                        className="w-full flex items-center justify-between p-2 hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] rounded-xl transition-colors group text-left"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#6A6D78] dark:text-[#787b86] truncate max-w-[140px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-[#131722] dark:text-white">
                            {item.price}
                          </div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded font-mono text-[11px] font-bold ${
                              item.isPositive
                                ? 'text-[#089981] bg-[#089981]/10'
                                : 'text-[#f23645] bg-[#f23645]/10'
                            }`}
                          >
                            {item.change}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenScreener('stocks')}
                  className="mt-4 text-center py-2 rounded-full bg-white dark:bg-[#131722] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white text-xs font-semibold transition-colors border border-[#E0E3EB] dark:border-[#2a2e39]"
                >
                  {stockTab === 'gainers' ? 'See all stock gainers' : 'See all stock losers'}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: WORLD BIGGEST COMPANIES */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="world-stocks">
            <div className="flex items-center justify-between">
              <a
                href="#world-stocks"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('world-stocks');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  World biggest companies
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs text-[#2962ff] hover:underline font-semibold"
              >
                See all world major companies
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              {WORLD_BIGGEST_COMPANIES.map((company) => (
                <button
                  key={company.symbol}
                  onClick={() =>
                    openChartForSymbol(company.symbol, company.name, company.numericCap * 100, company.isPositive ? 1.5 : -0.5)
                  }
                  className="bg-[#F0F3FA] dark:bg-[#1e222d] p-3.5 rounded-2xl flex flex-col justify-between hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all text-left group border border-transparent hover:border-[#2962ff]/30 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-full bg-[#E0E3EB] dark:bg-[#2a2e39] text-[#131722] dark:text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {company.rank}
                    </span>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-[#131722] dark:text-white truncate group-hover:text-[#2962ff]">
                        {company.name}
                      </span>
                      <span className="text-[11px] text-[#6A6D78] dark:text-[#787b86]">
                        {company.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#131722] dark:text-white">{company.cap}</div>
                  <span
                    className={`font-mono text-xs mt-1 ${
                      company.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {company.change}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 4: CRYPTO */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="crypto">
            <div className="flex items-center justify-between">
              <a
                href="#crypto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('crypto');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Crypto
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#6A6D78] dark:text-[#787b86] hidden sm:inline">
                  24h Vol: $128.5B
                </span>
                <button
                  onClick={() => handleOpenScreener('crypto')}
                  className="text-xs text-[#2962ff] hover:underline font-semibold"
                >
                  Crypto Screener
                </button>
              </div>
            </div>

            {/* Crypto Coins Quick Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {QUICK_CRYPTO.map((coin) => {
                const isPositive = coin.changePercent >= 0;
                const isFlashing = flashingSymbols[coin.symbol];
                return (
                  <button
                    key={coin.symbol}
                    onClick={() => setSelectedAsset(coin)}
                    className={`p-3.5 rounded-2xl bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all flex flex-col justify-between group text-left border border-transparent hover:border-[#2962ff]/30 shadow-xs ${
                      isFlashing === 'up' ? 'flash-up' : isFlashing === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                          style={{ backgroundColor: coin.badgeColor }}
                        >
                          {coin.badge}
                        </span>
                        <span className="text-xs font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                          {coin.symbol}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold ${
                          coin.changePercent === 0
                            ? 'text-[#6A6D78]'
                            : isPositive
                            ? 'text-[#089981]'
                            : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive && coin.changePercent > 0 ? '+' : ''}
                        {coin.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <span className="text-xs text-[#6A6D78] dark:text-[#787b86] mt-1 truncate">
                      {coin.name}
                    </span>
                    <span className="font-mono text-[18px] text-[#131722] dark:text-white font-bold mt-2">
                      {coin.formattedPrice}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Crypto Market Cap & TVL Split Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Market Cap Ranking Table */}
              <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 shadow-xs flex flex-col justify-between border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#131722] dark:text-white">
                      Crypto market cap ranking
                    </h3>
                    <button
                      onClick={() => handleOpenScreener('crypto')}
                      className="text-xs text-[#2962ff] hover:underline font-semibold"
                    >
                      See all coins
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[#6A6D78] dark:text-[#787b86] text-xs">
                          <th className="py-1.5 font-semibold">Symbol</th>
                          <th className="py-1.5 font-semibold text-right">Price</th>
                          <th className="py-1.5 font-semibold text-right">24h</th>
                          <th className="py-1.5 font-semibold text-right">Market cap</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-transparent text-xs">
                        {CRYPTO_MARKET_CAP_TABLE.map((c) => (
                          <tr
                            key={c.symbol}
                            onClick={() =>
                              openChartForSymbol(c.symbol, c.name, c.numericPrice, parseFloat(c.change.replace('%', '')), 'crypto')
                            }
                            className="hover:bg-[#E0E3EB]/70 dark:hover:bg-[#2a2e39]/70 transition-colors group cursor-pointer"
                          >
                            <td className="py-2 pr-2 font-bold text-[#131722] dark:text-white">
                              <span className="group-hover:text-[#2962ff]">{c.name}</span>
                              <span className="text-[#6A6D78] dark:text-[#787b86] font-normal ml-1">
                                {c.symbol}
                              </span>
                            </td>
                            <td className="py-2 text-right font-mono font-bold text-[#131722] dark:text-white">
                              {c.price}
                            </td>
                            <td
                              className={`py-2 text-right font-mono font-semibold ${
                                c.change.startsWith('+') ? 'text-[#089981]' : c.change === '0.00%' ? 'text-[#6A6D78]' : 'text-[#f23645]'
                              }`}
                            >
                              {c.change}
                            </td>
                            <td className="py-2 text-right font-mono text-[#6A6D78] dark:text-[#787b86] font-semibold">
                              {c.marketCap}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* TVL Ranking (DeFi) Table */}
              <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 shadow-xs flex flex-col justify-between border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#131722] dark:text-white">
                      TVL ranking (DeFi)
                    </h3>
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="text-xs text-[#2962ff] hover:underline font-semibold"
                    >
                      See all protocols
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[#6A6D78] dark:text-[#787b86] text-xs">
                          <th className="py-1.5 font-semibold">Protocol</th>
                          <th className="py-1.5 font-semibold text-right">Price</th>
                          <th className="py-1.5 font-semibold text-right">24h</th>
                          <th className="py-1.5 font-semibold text-right">Total Value Locked</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-transparent text-xs">
                        {DEFI_TVL_TABLE.map((d) => (
                          <tr
                            key={d.symbol}
                            onClick={() =>
                              openChartForSymbol(d.symbol, d.protocol, d.numericPrice, parseFloat(d.change.replace('%', '')), 'crypto')
                            }
                            className="hover:bg-[#E0E3EB]/70 dark:hover:bg-[#2a2e39]/70 transition-colors group cursor-pointer"
                          >
                            <td className="py-2 pr-2 font-bold text-[#131722] dark:text-white">
                              <span className="group-hover:text-[#2962ff]">{d.protocol}</span>
                              <span className="text-[#6A6D78] dark:text-[#787b86] font-normal ml-1">
                                {d.symbol}
                              </span>
                            </td>
                            <td className="py-2 text-right font-mono font-bold text-[#131722] dark:text-white">
                              {d.price}
                            </td>
                            <td
                              className={`py-2 text-right font-mono font-semibold ${
                                d.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                              }`}
                            >
                              {d.change}
                            </td>
                            <td className="py-2 text-right font-mono text-[#6A6D78] dark:text-[#787b86] font-semibold">
                              {d.tvl}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: FUTURES & COMMODITIES */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="futures">
            <div className="flex items-center justify-between">
              <a
                href="#futures"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('futures');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Futures and commodities
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs text-[#2962ff] hover:underline font-semibold"
              >
                See all futures
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {FUTURES_COMMODITIES.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() =>
                    openChartForSymbol(item.symbol, item.name, item.numericPrice, parseFloat(item.change.replace('%', '')), 'futures')
                  }
                  className="p-3.5 rounded-2xl bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all flex flex-col justify-between group text-left border border-transparent hover:border-[#2962ff]/30 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] truncate">
                      {item.name}
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                  <span className="text-xs text-[#6A6D78] dark:text-[#787b86]">{item.symbol}</span>
                  <span className="font-mono text-[18px] text-[#131722] dark:text-white font-bold mt-2">
                    {item.price}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 6: FOREX & CURRENCIES */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="forex">
            <div className="flex items-center justify-between">
              <a
                href="#forex"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('forex');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Forex and currencies
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs text-[#2962ff] hover:underline font-semibold"
              >
                See all major pairs
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {FOREX_CURRENCIES.map((fx) => (
                <button
                  key={fx.symbol}
                  onClick={() =>
                    openChartForSymbol(fx.symbol, fx.name, fx.numericPrice, parseFloat(fx.change.replace('%', '')), 'forex')
                  }
                  className="p-3.5 rounded-2xl bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all flex flex-col justify-between group text-left border border-transparent hover:border-[#2962ff]/30 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                      {fx.symbol}
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        fx.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {fx.change}
                    </span>
                  </div>
                  <span className="text-xs text-[#6A6D78] dark:text-[#787b86] truncate">{fx.name}</span>
                  <span className="font-mono text-[18px] text-[#131722] dark:text-white font-bold mt-2">
                    {fx.price}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 7: GOVERNMENT BONDS & YIELD CURVE */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="bonds">
            <div className="flex items-center justify-between">
              <a
                href="#bonds"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('bonds');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Government bonds
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => setYieldCurveMode(yieldCurveMode === 'normal' ? 'inverted' : 'normal')}
                className="text-xs text-[#2962ff] hover:underline font-semibold"
              >
                Customize curves ({yieldCurveMode === 'normal' ? 'Normal' : 'Inverted'})
              </button>
            </div>

            {/* US Yield Curve Visual & Table Block */}
            <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 md:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6 items-center border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
              {/* Yield Curve Spark Area Visual */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#131722] dark:text-white">
                    US Treasury Yield Curve
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                      yieldCurveMode === 'normal'
                        ? 'text-[#089981] bg-[#089981]/10'
                        : 'text-[#f23645] bg-[#f23645]/10'
                    }`}
                  >
                    {yieldCurveMode === 'normal' ? 'Normal' : 'Inverted'}
                  </span>
                </div>
                <p className="text-xs text-[#6A6D78] dark:text-[#787b86]">
                  Yield by maturity: 1Y through 30Y Treasury benchmark sovereign obligations.
                </p>

                {/* Interactive SVG Curve */}
                <div className="w-full h-32 flex items-end pt-4 pb-2">
                  <svg className="w-full h-full text-[#2962ff]" fill="none" viewBox="0 0 300 100">
                    <defs>
                      <linearGradient id="bondGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2962ff" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {yieldCurveMode === 'normal' ? (
                      <>
                        <path
                          d="M 10 70 Q 50 35, 100 28 T 200 18 T 290 12 L 290 95 L 10 95 Z"
                          fill="url(#bondGrad)"
                        />
                        <path
                          d="M 10 70 Q 50 35, 100 28 T 200 18 T 290 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="10" cy="70" fill="currentColor" r="4" />
                        <circle cx="65" cy="40" fill="currentColor" r="4" />
                        <circle cx="140" cy="24" fill="currentColor" r="4" />
                        <circle cx="215" cy="16" fill="currentColor" r="4" />
                        <circle cx="290" cy="12" fill="currentColor" r="4" />
                      </>
                    ) : (
                      <>
                        <path
                          d="M 10 20 Q 70 30, 150 45 T 290 75 L 290 95 L 10 95 Z"
                          fill="url(#bondGrad)"
                        />
                        <path
                          d="M 10 20 Q 70 30, 150 45 T 290 75"
                          stroke="#f23645"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="10" cy="20" fill="#f23645" r="4" />
                        <circle cx="70" cy="30" fill="#f23645" r="4" />
                        <circle cx="150" cy="45" fill="#f23645" r="4" />
                        <circle cx="220" cy="62" fill="#f23645" r="4" />
                        <circle cx="290" cy="75" fill="#f23645" r="4" />
                      </>
                    )}
                  </svg>
                </div>

                <div className="flex justify-between text-[#6A6D78] dark:text-[#787b86] font-mono text-xs px-2">
                  <span>1Y (4.49%)</span>
                  <span>2Y (4.92%)</span>
                  <span>5Y (5.07%)</span>
                  <span>10Y (5.23%)</span>
                  <span>30Y (5.53%)</span>
                </div>
              </div>

              {/* US Bonds Table */}
              <div className="lg:col-span-2 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#6A6D78] dark:text-[#787b86] text-xs">
                      <th className="py-2 font-semibold">Bond Symbol</th>
                      <th className="py-2 font-semibold text-right">Price</th>
                      <th className="py-2 font-semibold text-right">Day Chg</th>
                      <th className="py-2 font-semibold text-right">Yield %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent text-xs">
                    {US_BONDS.map((b) => (
                      <tr
                        key={b.symbol}
                        onClick={() =>
                          openChartForSymbol(b.symbol, `${b.maturity} Benchmark`, b.numericYield, -0.05, 'bonds')
                        }
                        className="hover:bg-[#E0E3EB]/70 dark:hover:bg-[#2a2e39]/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-2 font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                          {b.maturity} ({b.symbol})
                        </td>
                        <td className="py-2 text-right font-mono font-medium text-[#131722] dark:text-white">
                          {b.price}
                        </td>
                        <td className="py-2 text-right font-mono text-[#f23645] font-semibold">
                          {b.dayChange}
                        </td>
                        <td className="py-2 text-right font-mono text-[#2962ff] font-bold">
                          {b.yieldRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 8: ECONOMIC INDICATORS HEATMAP */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="economy">
            <div className="flex items-center justify-between">
              <a
                href="#economy"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('economy');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Economic indicators heatmap
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs text-[#2962ff] hover:underline font-semibold"
              >
                Economic Calendar
              </button>
            </div>

            <div className="bg-[#F0F3FA] dark:bg-[#1e222d] rounded-3xl p-5 md:p-6 shadow-xs overflow-x-auto border border-[#E0E3EB]/60 dark:border-[#2a2e39]/60">
              <table className="w-full text-left min-w-[680px]">
                <thead>
                  <tr className="text-[#6A6D78] dark:text-[#787b86] text-xs">
                    <th className="py-2 font-semibold">Country / Zone</th>
                    <th className="py-2 font-semibold text-right">GDP</th>
                    <th className="py-2 font-semibold text-right">GDP Growth</th>
                    <th className="py-2 font-semibold text-right">Interest Rate</th>
                    <th className="py-2 font-semibold text-right">Inflation Rate</th>
                    <th className="py-2 font-semibold text-right">Unemployment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent font-mono text-xs">
                  {ECONOMIC_INDICATORS.map((eco) => (
                    <tr
                      key={eco.country}
                      className="hover:bg-[#E0E3EB]/70 dark:hover:bg-[#2a2e39]/70 transition-colors"
                    >
                      <td className="py-2.5 font-sans font-bold text-[#131722] dark:text-white">
                        {eco.country}
                      </td>
                      <td className="py-2.5 text-right text-[#131722] dark:text-white font-bold">
                        {eco.gdp}
                      </td>
                      <td className="py-2.5 text-right text-[#089981] font-semibold">{eco.gdpGrowth}</td>
                      <td className="py-2.5 text-right text-[#2962ff] font-semibold">
                        {eco.interestRate}
                      </td>
                      <td
                        className={`py-2.5 text-right font-semibold ${
                          eco.inflationStatus === 'cool' ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {eco.inflationRate}
                      </td>
                      <td className="py-2.5 text-right text-[#6A6D78] dark:text-[#787b86]">
                        {eco.unemployment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 9: POPULAR ETFS */}
          <section className="flex flex-col gap-5 scroll-mt-28" id="etfs">
            <div className="flex items-center justify-between">
              <a
                href="#etfs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('etfs');
                }}
                className="group inline-flex items-center gap-1"
              >
                <h2 className="text-2xl font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Popular ETFs &amp; Index Funds
                </h2>
                <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition-all" />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs text-[#2962ff] hover:underline font-semibold"
              >
                ETF Screener
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {ETFS_DATA.map((etf) => (
                <button
                  key={etf.symbol}
                  onClick={() =>
                    openChartForSymbol(etf.symbol, etf.name, parseFloat(etf.price.replace('$', '')), parseFloat(etf.change.replace('%', '')), 'etfs')
                  }
                  className="p-3.5 rounded-2xl bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all flex flex-col justify-between group text-left border border-transparent hover:border-[#2962ff]/30 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                      {etf.symbol}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#089981]">
                      {etf.change}
                    </span>
                  </div>
                  <span className="text-xs text-[#6A6D78] dark:text-[#787b86] truncate mt-1">
                    {etf.name}
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-mono text-[16px] text-[#131722] dark:text-white font-bold">
                      {etf.price}
                    </span>
                    <span className="text-[10px] text-[#6A6D78] font-mono">AUM {etf.aum}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white dark:bg-[#131722] border-t border-[#E0E3EB] dark:border-[#2a2e39] mt-16 transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12">
          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12 text-xs">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#131722] dark:text-white">Products</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setSearchOpen(true); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Supercharts</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSearchOpen(true); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Pine Script™</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleOpenScreener('stocks'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Stock Screener</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('etfs'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">ETF Screener</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('crypto'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Crypto Coins</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleOpenScreener('crypto'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">DEX Screener</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#131722] dark:text-white">Community</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Trading Ideas</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Scripts &amp; Indicators</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Live Streams</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">House Rules</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Moderators</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#131722] dark:text-white">Markets</span>
              <a href="#indices" onClick={(e) => { e.preventDefault(); scrollToSection('indices'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Indices Overview</a>
              <a href="#us-stocks" onClick={(e) => { e.preventDefault(); scrollToSection('us-stocks'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Stocks &amp; Equities</a>
              <a href="#crypto" onClick={(e) => { e.preventDefault(); scrollToSection('crypto'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Crypto Currencies</a>
              <a href="#forex" onClick={(e) => { e.preventDefault(); scrollToSection('forex'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Forex Rates</a>
              <a href="#bonds" onClick={(e) => { e.preventDefault(); scrollToSection('bonds'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Bonds &amp; Yields</a>
              <a href="#futures" onClick={(e) => { e.preventDefault(); scrollToSection('futures'); }} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Futures &amp; Metals</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#131722] dark:text-white">Brokers</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Integrated Brokers</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Broker Awards</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">User Reviews</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Brokerage Connect API</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#131722] dark:text-white">Company</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">About Us</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Careers</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Press Kit</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Blog &amp; Updates</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Brand Assets</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#131722] dark:text-white">Legal &amp; Support</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Terms of Use</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Disclaimer</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Security Status</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#6A6D78] dark:text-[#787b86] hover:text-[#2962ff] transition-colors">Help Center</a>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-6 border-t border-[#E0E3EB] dark:border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6A6D78] dark:text-[#787b86]">
            <div className="flex items-center gap-2">
              <img
                alt="TradingView Logo"
                className="h-5 w-auto object-contain opacity-80"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XE7LhibD5rNEOEfHNw4woFLmmKWsnOuBvE1wwWivmC-e0-sPJpAAhus9p9zicsIYFZwr2Z_R48i7rMPuSiL9dEhMqrr2dLnt6p1iSfY7tj4c8o7HQTtWx9sUxxNREQzo9twJp1tLv7y1yEvlUUrVwuwOCeeShm4r7gUXy-bvQZakGGKUnIaavr9pVLxTh7qQlxdSsR6vBErL1sSHpiB7jCaHREPsmjHpGutSbIjrIXuFsJgLKICh-G6ZHv"
              />
              <span>© 2024 TradingView, Inc. All rights reserved.</span>
            </div>
            <div>Select Market Data: Real-time &amp; BATS</div>
          </div>
        </div>
      </footer>

      {/* Search Dialog Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* Interactive Superchart Modal */}
      <ChartModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={selectedAsset ? watchlist.includes(selectedAsset.symbol) : false}
        onToggleWatchlist={(sym) => toggleWatchlist(sym)}
      />

      {/* Stock & Crypto Screener Modal */}
      <ScreenerModal
        isOpen={screenerOpen}
        onClose={() => setScreenerOpen(false)}
        initialType={screenerInitialType}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* Watchlist Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        onRemoveFromWatchlist={(sym) => toggleWatchlist(sym)}
        onAddToWatchlist={(sym) => toggleWatchlist(sym)}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />
    </div>
  );
}
