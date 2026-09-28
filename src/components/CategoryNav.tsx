import React from 'react';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CATEGORIES = [
  { id: 'indices', label: 'Indices' },
  { id: 'us-stocks', label: 'US stocks' },
  { id: 'world-stocks', label: 'World stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures & commodities' },
  { id: 'forex', label: 'Forex & currencies' },
  { id: 'bonds', label: 'Government bonds' },
  { id: 'corporate-bonds', label: 'Corporate bonds' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'economy', label: 'Economy' },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-16 z-40 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md py-3 overflow-x-auto no-scrollbar flex items-center gap-2 border-b border-[#E0E3EB]/50 dark:border-[#2a2e39]/50 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shrink-0 ${
              isActive
                ? 'bg-[#2962ff] text-white shadow-sm'
                : 'bg-[#F0F3FA] dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39]'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
