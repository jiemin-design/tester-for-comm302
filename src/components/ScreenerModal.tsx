import React, { useState } from 'react';
import { X, ArrowUpDown, Search, Filter } from 'lucide-react';
import { TOP_US_STOCKS, QUICK_CRYPTO, MarketItem } from '../data/marketData';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'stocks' | 'crypto';
  onSelectAsset: (asset: MarketItem) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  initialType = 'stocks',
  onSelectAsset,
}) => {
  const [screenerType, setScreenerType] = useState<'stocks' | 'crypto'>(initialType);
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'symbol'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const dataset = screenerType === 'stocks' ? TOP_US_STOCKS : QUICK_CRYPTO;

  const filtered = dataset
    .filter(
      (item) =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const handleSort = (field: 'price' | 'changePercent' | 'symbol') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1e222d] rounded-3xl shadow-2xl border border-[#E0E3EB] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E3EB] dark:border-[#2a2e39]">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-[#131722] dark:text-white">
              {screenerType === 'stocks' ? 'Stock Screener' : 'Crypto Screener'}
            </h3>
            <div className="flex p-0.5 rounded-lg bg-[#F0F3FA] dark:bg-[#131722]">
              <button
                onClick={() => setScreenerType('stocks')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  screenerType === 'stocks'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-[#6A6D78] dark:text-[#787b86]'
                }`}
              >
                Stocks
              </button>
              <button
                onClick={() => setScreenerType('crypto')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  screenerType === 'crypto'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-[#6A6D78] dark:text-[#787b86]'
                }`}
              >
                Crypto
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6A6D78] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar within screener */}
        <div className="px-6 py-3 border-b border-[#E0E3EB] dark:border-[#2a2e39] bg-[#F0F3FA]/30 dark:bg-[#131722]/30 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6A6D78]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter screener..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39] rounded-xl text-[#131722] dark:text-white focus:outline-none focus:border-[#2962ff]"
            />
          </div>
          <span className="text-xs text-[#6A6D78] dark:text-[#787b86]">
            Showing {filtered.length} matched assets
          </span>
        </div>

        {/* Screener Table */}
        <div className="overflow-x-auto flex-1 p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#6A6D78] dark:text-[#787b86] text-xs border-b border-[#E0E3EB] dark:border-[#2a2e39]">
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-2.5 px-3 font-semibold cursor-pointer hover:text-[#2962ff]"
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol / Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#2962ff]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#2962ff]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-2.5 px-3 font-semibold text-right hidden md:table-cell">Volume</th>
                <th className="py-2.5 px-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3EB]/40 dark:divide-[#2a2e39]/40 text-xs">
              {filtered.map((item) => {
                const isPositive = item.changePercent >= 0;
                return (
                  <tr
                    key={item.symbol}
                    className="hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39]/70 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectAsset(item);
                      onClose();
                    }}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#2962ff]/10 text-[#2962ff] font-bold flex items-center justify-center text-[11px]">
                          {item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] block">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#6A6D78] dark:text-[#787b86]">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#131722] dark:text-white">
                      {item.formattedPrice || `$${item.price.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold ${
                          isPositive
                            ? 'text-[#089981] bg-[#089981]/10'
                            : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#6A6D78] dark:text-[#787b86] hidden sm:table-cell">
                      {item.marketCap || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#6A6D78] dark:text-[#787b86] hidden md:table-cell">
                      {item.volume || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#2962ff]/10 text-[#2962ff] hover:bg-[#2962ff] hover:text-white font-semibold transition-colors text-[11px]"
                      >
                        Chart
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
