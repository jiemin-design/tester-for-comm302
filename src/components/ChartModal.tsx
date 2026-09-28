import React, { useState, useMemo } from 'react';
import {
  X,
  Bookmark,
  TrendingUp,
  BarChart2,
  Maximize2,
  Share2,
  Check,
  Activity,
  Layers,
  Clock
} from 'lucide-react';
import { MarketItem, generateHistoricalCandles, CandlePoint } from '../data/marketData';

interface ChartModalProps {
  asset: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

export const ChartModal: React.FC<ChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1M');
  const [chartType, setChartType] = useState<'area' | 'candles' | 'line'>('area');
  const [hoveredPoint, setHoveredPoint] = useState<CandlePoint | null>(null);

  // Generate candle data seeded by asset price
  const candleData = useMemo(() => {
    if (!asset) return [];
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 30 : timeframe === '1M' ? 30 : 60;
    return generateHistoricalCandles(asset.price, count);
  }, [asset, timeframe]);

  if (!asset) return null;

  const isPositive = asset.changePercent >= 0;
  const strokeColor = isPositive ? '#089981' : '#f23645';
  const fillColor = isPositive ? 'rgba(8, 153, 129, 0.12)' : 'rgba(242, 54, 69, 0.12)';

  // Calculate SVG dimensions and coordinate mapping
  const width = 720;
  const height = 300;
  const padding = 24;

  const minPrice = Math.min(...candleData.map((c) => c.low));
  const maxPrice = Math.max(...candleData.map((c) => c.high));
  const priceRange = Math.max(0.0001, maxPrice - minPrice);

  const getX = (index: number) => {
    return padding + (index / (candleData.length - 1 || 1)) * (width - padding * 2);
  };

  const getY = (val: number) => {
    return height - padding - ((val - minPrice) / priceRange) * (height - padding * 2);
  };

  // Build SVG path strings
  const points = candleData.map((c, i) => `${getX(i)},${getY(c.close)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(candleData.length - 1)},${height - padding} L ${getX(0)},${height - padding} Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1e222d] rounded-3xl shadow-2xl border border-[#E0E3EB] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E3EB] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d]">
          <div className="flex items-center gap-3">
            {asset.badge ? (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
                style={{ backgroundColor: asset.badgeColor || '#2962ff' }}
              >
                {asset.badge}
              </div>
            ) : asset.countryCode ? (
              <div className="w-8 h-8 rounded-full bg-[#E0E3EB] dark:bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#131722] dark:text-white">
                {asset.countryCode}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                {asset.symbol.slice(0, 3)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722] dark:text-white">{asset.symbol}</h2>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-[#F0F3FA] dark:bg-[#131722] text-[#6A6D78] dark:text-[#787b86]">
                  {asset.category}
                </span>
              </div>
              <p className="text-xs text-[#6A6D78] dark:text-[#787b86] truncate max-w-sm sm:max-w-md">
                {asset.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isWatchlisted
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'bg-[#F0F3FA] dark:bg-[#2a2e39] text-[#131722] dark:text-white hover:bg-[#E0E3EB]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6A6D78] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2a2e39] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Price and Key Numbers Strip */}
        <div className="px-6 py-3.5 bg-[#F0F3FA]/50 dark:bg-[#131722]/50 border-b border-[#E0E3EB] dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-[#131722] dark:text-white">
              {hoveredPoint ? `$${hoveredPoint.close.toFixed(2)}` : asset.formattedPrice || `$${asset.price.toFixed(2)}`}
            </span>
            <div
              className={`font-mono text-sm font-bold flex items-center gap-1 ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
            </div>
          </div>

          {/* Timeframe & Chart Style Toggles */}
          <div className="flex items-center gap-3">
            {/* Chart Type */}
            <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-[#1e222d] border border-[#E0E3EB] dark:border-[#2a2e39]">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  chartType === 'area'
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#6A6D78] dark:text-[#787b86] hover:text-[#131722]'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  chartType === 'candles'
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#6A6D78] dark:text-[#787b86] hover:text-[#131722]'
                }`}
              >
                Candles
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  chartType === 'line'
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#6A6D78] dark:text-[#787b86] hover:text-[#131722]'
                }`}
              >
                Line
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    timeframe === tf
                      ? 'bg-[#2962ff] text-white'
                      : 'text-[#6A6D78] dark:text-[#787b86] hover:bg-[#E0E3EB] dark:hover:bg-[#2a2e39]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Chart Canvas View */}
        <div className="relative p-6 overflow-hidden flex-1 bg-white dark:bg-[#1e222d] min-h-[300px]">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-x-6 inset-y-6 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-[#6A6D78]" />
            <div className="border-b border-[#6A6D78]" />
            <div className="border-b border-[#6A6D78]" />
            <div className="border-b border-[#6A6D78]" />
          </div>

          {/* SVG Chart */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[260px] overflow-visible"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area or Line View */}
            {chartType === 'area' && (
              <>
                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}

            {chartType === 'line' && (
              <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Candlestick Mode */}
            {chartType === 'candles' &&
              candleData.map((candle, i) => {
                const cx = getX(i);
                const isBull = candle.close >= candle.open;
                const candleColor = isBull ? '#089981' : '#f23645';
                const yHigh = getY(candle.high);
                const yLow = getY(candle.low);
                const yOpen = getY(candle.open);
                const yClose = getY(candle.close);
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                return (
                  <g key={i}>
                    {/* Wick */}
                    <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={candleColor} strokeWidth="1.2" />
                    {/* Body */}
                    <rect
                      x={cx - 3.5}
                      y={bodyTop}
                      width={7}
                      height={bodyHeight}
                      fill={candleColor}
                      rx={1}
                    />
                  </g>
                );
              })}

            {/* Interactive hover crosshair dots */}
            {candleData.map((candle, i) => {
              const cx = getX(i);
              const cy = getY(candle.close);
              const isHovered = hoveredPoint === candle;

              return (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(candle)}>
                  {/* Invisible wide hit area */}
                  <rect
                    x={cx - (width / candleData.length) / 2}
                    y={0}
                    width={width / candleData.length}
                    height={height}
                    fill="transparent"
                  />
                  {isHovered && (
                    <>
                      <line
                        x1={cx}
                        y1={padding}
                        x2={cx}
                        y2={height - padding}
                        stroke="#2962ff"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <circle cx={cx} cy={cy} r="5" fill="#2962ff" stroke="#ffffff" strokeWidth="2" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Crosshair Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-8 right-8 bg-white/95 dark:bg-[#131722]/95 border border-[#E0E3EB] dark:border-[#2a2e39] rounded-xl shadow-lg p-3 text-xs font-mono backdrop-blur-md z-20 pointer-events-none">
              <div className="text-[#6A6D78] dark:text-[#787b86] mb-1 font-sans">{hoveredPoint.time}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <span className="text-[#6A6D78]">O: <strong className="text-[#131722] dark:text-white">${hoveredPoint.open}</strong></span>
                <span className="text-[#6A6D78]">H: <strong className="text-[#131722] dark:text-white">${hoveredPoint.high}</strong></span>
                <span className="text-[#6A6D78]">L: <strong className="text-[#131722] dark:text-white">${hoveredPoint.low}</strong></span>
                <span className="text-[#6A6D78]">C: <strong className="text-[#131722] dark:text-white">${hoveredPoint.close}</strong></span>
              </div>
            </div>
          )}

          {/* Time axis labels */}
          <div className="flex justify-between items-center px-4 mt-2 text-[11px] text-[#6A6D78] dark:text-[#787b86] font-mono">
            <span>{candleData[0]?.time || 'Start'}</span>
            <span>{candleData[Math.floor(candleData.length / 2)]?.time || 'Mid'}</span>
            <span>{candleData[candleData.length - 1]?.time || 'Latest'}</span>
          </div>
        </div>

        {/* Technical Indicators & Company Overview */}
        <div className="p-6 bg-[#F0F3FA]/40 dark:bg-[#131722]/40 border-t border-[#E0E3EB] dark:border-[#2a2e39] grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A6D78] dark:text-[#787b86]">Key Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-white dark:bg-[#1e222d] border border-[#E0E3EB]/50 dark:border-[#2a2e39]/50">
                <span className="text-[#6A6D78] block text-[10px]">52W Range</span>
                <span className="font-bold text-[#131722] dark:text-white truncate block">
                  {asset.low52w || '$120.00'} - {asset.high52w || '$250.00'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-[#1e222d] border border-[#E0E3EB]/50 dark:border-[#2a2e39]/50">
                <span className="text-[#6A6D78] block text-[10px]">Market Cap</span>
                <span className="font-bold text-[#131722] dark:text-white truncate block">
                  {asset.marketCap || '2.45T'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-[#1e222d] border border-[#E0E3EB]/50 dark:border-[#2a2e39]/50">
                <span className="text-[#6A6D78] block text-[10px]">Volume</span>
                <span className="font-bold text-[#131722] dark:text-white truncate block">
                  {asset.volume || '54.2M'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-[#1e222d] border border-[#E0E3EB]/50 dark:border-[#2a2e39]/50">
                <span className="text-[#6A6D78] block text-[10px]">P/E Ratio</span>
                <span className="font-bold text-[#131722] dark:text-white truncate block">
                  {asset.peRatio || '32.4'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Summary Gauge */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A6D78] dark:text-[#787b86]">Technical Analysis</h4>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1e222d] border border-[#E0E3EB]/50 dark:border-[#2a2e39]/50 flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#131722] dark:text-white">Summary</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#089981]/15 text-[#089981]">
                  Strong Buy
                </span>
              </div>
              {/* 5-segment colored gauge bar */}
              <div className="space-y-1">
                <div className="grid grid-cols-5 gap-1 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#f23645]/40" />
                  <div className="bg-[#f23645]/70" />
                  <div className="bg-amber-400" />
                  <div className="bg-[#089981]/60" />
                  <div className="bg-[#089981] relative">
                    <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-white shadow" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-[#6A6D78] dark:text-[#787b86]">
                  <span>Strong Sell</span>
                  <span>Neutral</span>
                  <span>Strong Buy</span>
                </div>
              </div>
              <div className="text-[11px] text-[#6A6D78] dark:text-[#787b86]">
                16 Buy · 8 Neutral · 2 Sell
              </div>
            </div>
          </div>

          {/* About / Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A6D78] dark:text-[#787b86]">Asset Profile</h4>
            <p className="text-xs text-[#6A6D78] dark:text-[#787b86] leading-relaxed line-clamp-4">
              {asset.description ||
                `${asset.name} (${asset.symbol}) provides leading market exposure in global financial markets. Listed on major international exchanges with high liquidity.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
