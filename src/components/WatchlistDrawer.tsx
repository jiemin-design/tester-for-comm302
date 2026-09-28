import React from 'react';
import { X, Trash2, ArrowUpRight, Plus, Bookmark } from 'lucide-react';
import { MarketItem, TOP_US_STOCKS, QUICK_CRYPTO } from '../data/marketData';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: MarketItem) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  onRemoveFromWatchlist,
  onAddToWatchlist,
  onSelectAsset,
}) => {
  if (!isOpen) return null;

  // Find all items in watchlist from available pool
  const allPool: MarketItem[] = [...TOP_US_STOCKS, ...QUICK_CRYPTO];
  const watchlistedItems = allPool.filter((item) => watchlistSymbols.includes(item.symbol));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white dark:bg-[#1e222d] h-full shadow-2xl border-l border-[#E0E3EB] dark:border-[#2a2e39] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#2962ff]" />
            <h3 className="font-bold text-[#131722] dark:text-white text-base">Watchlist</h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#F0F3FA] dark:bg-[#131722] text-[#6A6D78] dark:text-[#787b86]">
              {watchlistSymbols.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6A6D78] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watchlist Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {watchlistedItems.length === 0 ? (
            <div className="py-12 text-center text-[#6A6D78] dark:text-[#787b86] space-y-3">
              <Bookmark className="w-10 h-10 mx-auto opacity-30 text-[#2962ff]" />
              <p className="text-sm font-medium">Your watchlist is empty</p>
              <p className="text-xs text-[#6A6D78] dark:text-[#787b86] max-w-xs mx-auto">
                Click the bookmark icon on any ticker or add popular assets below to monitor them.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {['NVDA', 'AAPL', 'BTC', 'TSLA'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => onAddToWatchlist(sym)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F0F3FA] dark:bg-[#131722] text-[#2962ff] hover:bg-[#2962ff] hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{sym}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            watchlistedItems.map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F0F3FA] dark:bg-[#131722] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39] transition-all group"
                >
                  <button
                    onClick={() => {
                      onSelectAsset(item);
                      onClose();
                    }}
                    className="flex-1 text-left flex items-center gap-3 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#2962ff] shrink-0">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff] truncate">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-[#6A6D78] dark:text-[#787b86] truncate">
                        {item.name}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#131722] dark:text-white">
                        {item.formattedPrice || `$${item.price.toFixed(2)}`}
                      </div>
                      <div
                        className={`font-mono text-[11px] font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromWatchlist(item.symbol)}
                      title="Remove from watchlist"
                      className="p-1 rounded-lg text-[#6A6D78] hover:text-[#f23645] hover:bg-white dark:hover:bg-[#1e222d] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E0E3EB] dark:border-[#2a2e39] bg-[#F0F3FA]/50 dark:bg-[#131722]/50">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#2962ff] hover:bg-[#0049db] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Close Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};
