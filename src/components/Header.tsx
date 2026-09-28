import React, { useState } from 'react';
import { Search, Globe, Moon, Sun, Bookmark, Sparkles, Check, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  liveUpdates: boolean;
  onToggleLiveUpdates: () => void;
  onSelectNav: (path: string) => void;
  activeNav: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  darkMode,
  onToggleDarkMode,
  liveUpdates,
  onToggleLiveUpdates,
  onSelectNav,
  activeNav,
}) => {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [profileOpen, setProfileOpen] = useState(false);

  const languages = ['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-b border-[#E0E3EB] dark:border-[#2a2e39] transition-colors">
      <div className="h-16 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Left Zone: Brand + Search + Navigation */}
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 shrink-0 group focus:outline-none"
          >
            <img
              alt="TradingView Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XE7LhibD5rNEOEfHNw4woFLmmKWsnOuBvE1wwWivmC-e0-sPJpAAhus9p9zicsIYFZwr2Z_R48i7rMPuSiL9dEhMqrr2dLnt6p1iSfY7tj4c8o7HQTtWx9sUxxNREQzo9twJp1tLv7y1yEvlUUrVwuwOCeeShm4r7gUXy-bvQZakGGKUnIaavr9pVLxTh7qQlxdSsR6vBErL1sSHpiB7jCaHREPsmjHpGutSbIjrIXuFsJgLKICh-G6ZHv"
            />
            <span className="text-[19px] tracking-tight font-bold text-[#131722] dark:text-white hidden sm:inline-block">
              TradingView
            </span>
          </a>

          {/* Quick Search Bar */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-[#F0F3FA] dark:bg-[#1e222d] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-colors rounded-full px-3.5 py-1.5 gap-2 w-52 lg:w-64 cursor-pointer text-left border border-transparent hover:border-[#2962ff]/30"
          >
            <Search className="w-4 h-4 text-[#6A6D78] dark:text-[#787b86]" />
            <span className="text-[13px] text-[#6A6D78] dark:text-[#787b86] select-none truncate">
              Search (Ctrl+K)
            </span>
            <kbd className="hidden lg:inline-block ml-auto text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#131722] text-[#6A6D78] dark:text-[#787b86] border border-[#E0E3EB] dark:border-[#2a2e39]">
              ⌘K
            </kbd>
          </button>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 shrink-0">
            {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => {
              const isActive = activeNav.toLowerCase() === item.toLowerCase();
              return (
                <button
                  key={item}
                  onClick={() => onSelectNav(item.toLowerCase())}
                  className={`text-[14px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#2962ff] font-semibold'
                      : 'text-[#434656] dark:text-[#9ea2b0] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Zone: Controls & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Tick Indicator Toggle */}
          <button
            onClick={onToggleLiveUpdates}
            title={liveUpdates ? 'Simulated Live Stream ON' : 'Live Stream Paused'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              liveUpdates
                ? 'bg-[#089981]/10 text-[#089981] dark:bg-[#089981]/20'
                : 'bg-neutral-100 dark:bg-[#1e222d] text-[#6A6D78] dark:text-[#787b86]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveUpdates ? 'bg-[#089981] animate-pulse' : 'bg-neutral-400'
              }`}
            />
            <span className="font-mono text-[11px] font-semibold">
              {liveUpdates ? 'LIVE' : 'PAUSED'}
            </span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={onOpenWatchlist}
            className="relative flex items-center justify-center w-8 h-8 rounded-full text-[#6A6D78] dark:text-[#9ea2b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#1e222d] transition-colors"
            title="Open Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#2962ff] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-center w-8 h-8 rounded-full text-[#6A6D78] dark:text-[#9ea2b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#1e222d] transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[#6A6D78] dark:text-[#9ea2b0] hover:text-[#131722] dark:hover:text-white px-2 py-1 rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1e222d] transition-colors text-xs font-semibold"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39] rounded-xl shadow-lg py-1 z-50 text-xs">
                {languages.map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      setCurrentLang(lng);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white"
                  >
                    <span>{lng}</span>
                    {currentLang === lng && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-[#0049db] flex items-center justify-center hover:opacity-90 transition-opacity text-white font-medium text-xs shadow-sm"
              title="Account"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39] rounded-2xl shadow-xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#E0E3EB] dark:border-[#2a2e39] mb-1">
                  <div className="font-semibold text-[#131722] dark:text-white">Pro Trader</div>
                  <div className="text-[11px] text-[#6A6D78] dark:text-[#787b86]">Standard Plan</div>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenWatchlist();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white"
                >
                  My Watchlists
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onToggleLiveUpdates();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white"
                >
                  {liveUpdates ? 'Pause Stream' : 'Resume Stream'}
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onToggleDarkMode();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-white"
                >
                  {darkMode ? 'Light Theme' : 'Dark Theme'}
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenWatchlist}
            className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#2962ff] text-white text-[13px] font-semibold hover:bg-[#0049db] transition-colors shadow-[0_2px_8px_rgba(41,98,255,0.25)] cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
