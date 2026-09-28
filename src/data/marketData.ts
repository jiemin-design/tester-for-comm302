export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  category: 'indices' | 'stocks' | 'crypto' | 'futures' | 'forex' | 'bonds' | 'etfs';
  price: number;
  formattedPrice?: string;
  change: number;
  changePercent: number;
  badge?: string;
  badgeColor?: string;
  countryCode?: string;
  sparkline?: number[];
  high52w?: string | number;
  low52w?: string | number;
  marketCap?: string;
  volume?: string;
  peRatio?: number;
  description?: string;
  technicalRating?: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
}

export const QUICK_INDICES: MarketItem[] = [
  {
    id: 'sp500',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    category: 'indices',
    price: 5920.45,
    formattedPrice: '5,920.45',
    change: 22.40,
    changePercent: 0.38,
    badge: '500',
    badgeColor: '#D32F2F',
    sparkline: [5880, 5895, 5910, 5900, 5915, 5920.45],
    high52w: '6,025.00',
    low52w: '4,682.11',
    description: 'The Standard and Poor 500 is a stock market index tracking the stock performance of 500 of the largest companies listed on stock exchanges in the United States.'
  },
  {
    id: 'nasdaq100',
    symbol: 'Nasdaq 100',
    name: 'Nasdaq 100 Index',
    category: 'indices',
    price: 20845.10,
    formattedPrice: '20,845.10',
    change: 149.20,
    changePercent: 0.72,
    badge: '100',
    badgeColor: '#00A3E0',
    sparkline: [20650, 20720, 20700, 20780, 20810, 20845.10],
    high52w: '21,180.50',
    low52w: '16,973.94',
    description: 'The Nasdaq-100 is a stock market index made up of 101 equity securities issued by 100 of the largest non-financial companies listed on the Nasdaq.'
  },
  {
    id: 'dow30',
    symbol: 'Dow 30',
    name: 'Dow Jones Industrial Average',
    category: 'indices',
    price: 43890.20,
    formattedPrice: '43,890.20',
    change: -65.80,
    changePercent: -0.15,
    badge: '30',
    badgeColor: '#0052FF',
    sparkline: [44000, 43980, 43920, 43850, 43870, 43890.20],
    high52w: '44,486.12',
    low52w: '36,750.25',
    description: 'The Dow Jones Industrial Average is a price-weighted stock market index of 30 prominent companies listed on stock exchanges in the United States.'
  },
  {
    id: 'us2000',
    symbol: 'US 2000',
    name: 'Russell 2000 Small Cap',
    category: 'indices',
    price: 2342.15,
    formattedPrice: '2,342.15',
    change: 20.65,
    changePercent: 0.89,
    badge: '2K',
    badgeColor: '#5B6275',
    sparkline: [2315, 2320, 2335, 2330, 2338, 2342.15],
    high52w: '2,442.80',
    low52w: '1,920.40',
    description: 'The Russell 2000 Index measures the performance of the small-cap segment of the US equity universe.'
  },
  {
    id: 'nasdaqcomp',
    symbol: 'Nasdaq Comp',
    name: 'Nasdaq Composite',
    category: 'indices',
    price: 19281.40,
    formattedPrice: '19,281.40',
    change: 122.50,
    changePercent: 0.64,
    badge: 'IX',
    badgeColor: '#4A5060',
    sparkline: [19120, 19180, 19220, 19240, 19260, 19281.40],
    high52w: '19,650.00',
    low52w: '15,500.00',
    description: 'The Nasdaq Composite is a stock market index that includes almost all stocks listed on the Nasdaq stock exchange.'
  },
  {
    id: 'nysecomp',
    symbol: 'NYSE Comp',
    name: 'NYSE Composite Index',
    category: 'indices',
    price: 19890.12,
    formattedPrice: '19,890.12',
    change: -15.90,
    changePercent: -0.08,
    badge: 'NY',
    badgeColor: '#5B6275',
    sparkline: [19920, 19905, 19910, 19875, 19885, 19890.12],
    high52w: '20,250.00',
    low52w: '16,800.00',
    description: 'The NYSE Composite Index measures the performance of all common stocks listed on the New York Stock Exchange.'
  }
];

export interface WorldIndex {
  symbol: string;
  name: string;
  country: string;
  code: string;
  last: string;
  numericLast: number;
  chg: string;
  chgPercent: string;
  isPositive: boolean;
  range52w: string;
}

export const WORLD_INDICES: WorldIndex[] = [
  { symbol: 'NI225', name: 'Japan 225 Index', country: 'Japan', code: 'JP', last: '39,380.50', numericLast: 39380.5, chg: '+110.20', chgPercent: '+0.28%', isPositive: true, range52w: '30,540 - 42,426' },
  { symbol: 'UKX', name: 'FTSE 100 Index', country: 'United Kingdom', code: 'UK', last: '8,348.12', numericLast: 8348.12, chg: '+41.05', chgPercent: '+0.49%', isPositive: true, range52w: '7,400 - 8,474' },
  { symbol: 'DAX', name: 'DAX Index', country: 'Germany', code: 'DE', last: '19,254.90', numericLast: 19254.9, chg: '+130.40', chgPercent: '+0.68%', isPositive: true, range52w: '16,345 - 19,674' },
  { symbol: 'PX1', name: 'CAC 40 Index', country: 'France', code: 'FR', last: '7,380.11', numericLast: 7380.11, chg: '-18.30', chgPercent: '-0.25%', isPositive: false, range52w: '7,100 - 8,259' },
  { symbol: 'FTMIB', name: 'Milano Italia Borsa', country: 'Italy', code: 'IT', last: '34,120.40', numericLast: 34120.4, chg: '+145.00', chgPercent: '+0.43%', isPositive: true, range52w: '28,900 - 35,400' },
  { symbol: '000001', name: 'SSE Composite Index', country: 'China', code: 'CN', last: '3,342.20', numericLast: 3342.2, chg: '+35.80', chgPercent: '+1.08%', isPositive: true, range52w: '2,635 - 3,674' },
  { symbol: 'HSI', name: 'Hang Seng Index', country: 'Hong Kong', code: 'HK', last: '20,530.85', numericLast: 20530.85, chg: '-85.20', chgPercent: '-0.41%', isPositive: false, range52w: '14,794 - 23,241' },
  { symbol: 'NIFTY', name: 'Nifty 50 Index', country: 'India', code: 'IN', last: '24,310.15', numericLast: 24310.15, chg: '+168.30', chgPercent: '+0.70%', isPositive: true, range52w: '18,837 - 26,277' }
];

export const TOP_US_STOCKS: MarketItem[] = [
  { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stocks', price: 141.25, formattedPrice: '$141.25', change: 4.30, changePercent: 3.14, marketCap: '3.47T', volume: '98.2M', peRatio: 64.2, description: 'NVIDIA is the pioneer of GPU-accelerated computing and full-stack AI infrastructure.' },
  { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks', price: 228.40, formattedPrice: '$228.40', change: 1.41, changePercent: 0.62, marketCap: '3.46T', volume: '48.5M', peRatio: 35.8, description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.' },
  { id: 'amzn', symbol: 'AMZN', name: 'Amazon.com, Inc.', category: 'stocks', price: 208.90, formattedPrice: '$208.90', change: 2.99, changePercent: 1.45, marketCap: '2.19T', volume: '38.1M', peRatio: 42.1, description: 'Amazon is a global technology company focused on e-commerce, cloud computing (AWS), and digital streaming.' },
  { id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks', price: 177.10, formattedPrice: '$177.10', change: -0.60, changePercent: -0.34, marketCap: '2.18T', volume: '22.4M', peRatio: 23.4, description: 'Alphabet is a multinational technology conglomerate holding company created through a restructuring of Google.' },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla, Inc.', category: 'stocks', price: 338.74, formattedPrice: '$338.74', change: 15.51, changePercent: 4.80, marketCap: '1.08T', volume: '85.6M', peRatio: 96.5, description: 'Tesla designs, develops, manufactures, and sells electric vehicles and energy storage systems.' },
  { id: 'msft', symbol: 'MSFT', name: 'Microsoft Corp', category: 'stocks', price: 422.50, formattedPrice: '$422.50', change: 1.05, changePercent: 0.25, marketCap: '3.14T', volume: '27.4M', peRatio: 33.9, description: 'Microsoft develops and supports software, services, devices, and solutions worldwide including Azure and Office.' }
];

export const COMMUNITY_TRENDS = [
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: '$138.45', numericPrice: 138.45, change: '+2.89%', isPositive: true },
  { symbol: 'ARM', name: 'Arm Holdings plc', price: '$142.20', numericPrice: 142.2, change: '+5.12%', isPositive: true },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: '$176.40', numericPrice: 176.4, change: '+1.10%', isPositive: true },
  { symbol: 'COIN', name: 'Coinbase Global, Inc.', price: '$312.80', numericPrice: 312.8, change: '+8.40%', isPositive: true },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings', price: '$355.15', numericPrice: 355.15, change: '-0.95%', isPositive: false }
];

export const HIGHEST_VOLUME_STOCKS = [
  { symbol: 'MU', name: 'Micron Technology', volume: '128.4M Vol', price: '$101.50 (+4.1%)', numericPrice: 101.5, change: '+4.1%', isPositive: true },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', volume: '98.2M Vol', price: '$141.25 (+3.1%)', numericPrice: 141.25, change: '+3.1%', isPositive: true },
  { symbol: 'TSLA', name: 'Tesla, Inc.', volume: '85.6M Vol', price: '$338.74 (+4.8%)', numericPrice: 338.74, change: '+4.8%', isPositive: true },
  { symbol: 'META', name: 'Meta Platforms, Inc.', volume: '32.1M Vol', price: '$588.20 (+1.2%)', numericPrice: 588.2, change: '+1.2%', isPositive: true },
  { symbol: 'MSFT', name: 'Microsoft Corp', volume: '27.4M Vol', price: '$422.50 (+0.3%)', numericPrice: 422.5, change: '+0.3%', isPositive: true }
];

export const STOCK_GAINERS = [
  { symbol: 'AXG', name: 'Solowin Holdings', price: '$18.90', numericPrice: 18.9, change: '+62.4%', isPositive: true },
  { symbol: 'WYY', name: 'WidePoint Corporation', price: '$4.85', numericPrice: 4.85, change: '+34.8%', isPositive: true },
  { symbol: 'IFBD', name: 'Infobird Co., Ltd', price: '$2.14', numericPrice: 2.14, change: '+28.2%', isPositive: true },
  { symbol: 'MSGY', name: 'Masonglory Limited', price: '$9.40', numericPrice: 9.4, change: '+21.5%', isPositive: true },
  { symbol: 'GIPR', name: 'Generation Income', price: '$3.70', numericPrice: 3.7, change: '+18.9%', isPositive: true }
];

export const STOCK_LOSERS = [
  { symbol: 'SMCI', name: 'Super Micro Computer', price: '$26.80', numericPrice: 26.8, change: '-18.4%', isPositive: false },
  { symbol: 'DJT', name: 'Trump Media & Tech', price: '$28.15', numericPrice: 28.15, change: '-14.2%', isPositive: false },
  { symbol: 'PLTR', name: 'Palantir Technologies', price: '$58.40', numericPrice: 58.4, change: '-6.8%', isPositive: false },
  { symbol: 'INTC', name: 'Intel Corporation', price: '$23.10', numericPrice: 23.1, change: '-5.9%', isPositive: false },
  { symbol: 'RIVN', name: 'Rivian Automotive', price: '$10.25', numericPrice: 10.25, change: '-4.7%', isPositive: false }
];

export const WORLD_BIGGEST_COMPANIES = [
  { rank: 1, symbol: 'NVDA', name: 'NVIDIA', cap: '5.42 TUSD', numericCap: 5.42, change: '+3.14% today', isPositive: true },
  { rank: 2, symbol: 'AAPL', name: 'Apple', cap: '4.98 TUSD', numericCap: 4.98, change: '+0.62% today', isPositive: true },
  { rank: 3, symbol: 'GOOGL', name: 'Alphabet', cap: '4.19 TUSD', numericCap: 4.19, change: '-0.34% today', isPositive: false },
  { rank: 4, symbol: 'MSFT', name: 'Microsoft', cap: '3.83 TUSD', numericCap: 3.83, change: '+0.25% today', isPositive: true },
  { rank: 5, symbol: 'AMZN', name: 'Amazon', cap: '2.69 TUSD', numericCap: 2.69, change: '+1.45% today', isPositive: true },
  { rank: 6, symbol: '2330', name: 'TSMC', cap: '2.02 TUSD', numericCap: 2.02, change: '+2.05% today', isPositive: true }
];

export const QUICK_CRYPTO: MarketItem[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', category: 'crypto', price: 96410, formattedPrice: '$96,410', change: 2058.00, changePercent: 2.18, badge: '₿', badgeColor: '#c74500', marketCap: '1.67T', volume: '$42.8B', description: 'Bitcoin is the first decentralized digital currency created by Satoshi Nakamoto.' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', category: 'crypto', price: 2780, formattedPrice: '$2,780', change: 105.10, changePercent: 3.92, badge: 'Ξ', badgeColor: '#2962ff', marketCap: '324.77B', volume: '$21.5B', description: 'Ethereum is a decentralized open-source blockchain with smart contract functionality.' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether USDt', category: 'crypto', price: 1.000, formattedPrice: '$1.000', change: 0.00, changePercent: 0.00, badge: '₮', badgeColor: '#006b59', marketCap: '183.73B', volume: '$68.2B', description: 'Tether converts cash into digital currency to anchor the value to the price of national currencies like the US dollar.' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', category: 'crypto', price: 645.20, formattedPrice: '$645.20', change: 6.70, changePercent: 1.05, badge: 'B', badgeColor: '#5B6275', marketCap: '101.54B', volume: '$1.8B', description: 'BNB powers the BNB Chain ecosystem and was initially launched through an Initial Coin Offering.' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', category: 'crypto', price: 198.40, formattedPrice: '$198.40', change: 10.18, changePercent: 5.41, badge: 'S', badgeColor: '#5B6275', marketCap: '94.2B', volume: '$7.4B', description: 'Solana is a high-performance blockchain supporting builders with high throughput and sub-second finality.' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP', category: 'crypto', price: 1.58, formattedPrice: '$1.58', change: -0.013, changePercent: -0.82, badge: '✕', badgeColor: '#5B6275', marketCap: '93.38B', volume: '$4.1B', description: 'XRP is the native token of the XRP Ledger, an open-source, permissionless blockchain.' }
];

export const CRYPTO_MARKET_CAP_TABLE = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$96,410', numericPrice: 96410, change: '+2.18%', isPositive: true, marketCap: '1.67 T' },
  { symbol: 'ETH', name: 'Ethereum', price: '$2,780', numericPrice: 2780, change: '+3.92%', isPositive: true, marketCap: '324.77 B' },
  { symbol: 'USDT', name: 'Tether USDt', price: '$1.000', numericPrice: 1.0, change: '0.00%', isPositive: true, marketCap: '183.73 B' },
  { symbol: 'BNB', name: 'BNB', price: '$645.20', numericPrice: 645.2, change: '+1.05%', isPositive: true, marketCap: '101.54 B' },
  { symbol: 'XRP', name: 'XRP', price: '$1.58', numericPrice: 1.58, change: '-0.82%', isPositive: false, marketCap: '93.38 B' },
  { symbol: 'USDC', name: 'USD Coin', price: '$1.000', numericPrice: 1.0, change: '0.00%', isPositive: true, marketCap: '75.15 B' }
];

export const DEFI_TVL_TABLE = [
  { protocol: 'Aave', symbol: 'AAVE', price: '$215.40', numericPrice: 215.4, change: '+4.20%', isPositive: true, tvl: '32.34 B' },
  { protocol: 'Lido DAO', symbol: 'LDO', price: '$1.82', numericPrice: 1.82, change: '-1.15%', isPositive: false, tvl: '26.05 B' },
  { protocol: 'Ethena', symbol: 'ENA', price: '$0.64', numericPrice: 0.64, change: '+7.35%', isPositive: true, tvl: '5.44 B' },
  { protocol: 'Uniswap', symbol: 'UNI', price: '$11.20', numericPrice: 11.2, change: '+2.14%', isPositive: true, tvl: '3.90 B' },
  { protocol: 'Babylon', symbol: 'BABYL', price: '$4.10', numericPrice: 4.1, change: '+1.80%', isPositive: true, tvl: '3.37 B' },
  { protocol: 'Monad', symbol: 'MONAD', price: '$2.89', numericPrice: 2.89, change: '+6.45%', isPositive: true, tvl: '2.89 B' }
];

export const FUTURES_COMMODITIES = [
  { symbol: 'GC1!', name: 'Gold', price: '$2,684.30', numericPrice: 2684.3, change: '+0.48%', isPositive: true, unit: 'USD / oz' },
  { symbol: 'SI1!', name: 'Silver', price: '$31.42', numericPrice: 31.42, change: '+1.22%', isPositive: true, unit: 'USD / oz' },
  { symbol: 'HG1!', name: 'Copper', price: '$4.184', numericPrice: 4.184, change: '-0.35%', isPositive: false, unit: 'USD / lb' },
  { symbol: 'CL1!', name: 'Crude Oil', price: '$68.42', numericPrice: 68.42, change: '-1.12%', isPositive: false, unit: 'USD / bbl' },
  { symbol: 'NG1!', name: 'Natural Gas', price: '$2.940', numericPrice: 2.94, change: '+2.85%', isPositive: true, unit: 'USD / MMBtu' },
  { symbol: 'ES1!', name: 'E-mini S&P', price: '5,945.75', numericPrice: 5945.75, change: '+0.40%', isPositive: true, unit: 'Points' }
];

export const FOREX_CURRENCIES = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0542', numericPrice: 1.0542, change: '-0.18%', isPositive: false },
  { symbol: 'USD/JPY', name: 'US Dollar / Yen', price: '154.28', numericPrice: 154.28, change: '+0.32%', isPositive: true },
  { symbol: 'GBP/USD', name: 'British Pound / USD', price: '1.2640', numericPrice: 1.264, change: '-0.12%', isPositive: false },
  { symbol: 'AUD/USD', name: 'Aussie / USD', price: '0.6515', numericPrice: 0.6515, change: '+0.22%', isPositive: true },
  { symbol: 'USD/CAD', name: 'USD / Canadian Dollar', price: '1.4012', numericPrice: 1.4012, change: '+0.15%', isPositive: true },
  { symbol: 'DXY', name: 'US Dollar Index', price: '106.82', numericPrice: 106.82, change: '+0.20%', isPositive: true }
];

export interface BondData {
  maturity: string;
  symbol: string;
  price: string;
  dayChange: string;
  yieldRate: string;
  numericYield: number;
  isNegative: boolean;
}

export const US_BONDS: BondData[] = [
  { maturity: '1 year', symbol: 'US01Y', price: '95.702', dayChange: '-0.02%', yieldRate: '4.494%', numericYield: 4.494, isNegative: true },
  { maturity: '2 years', symbol: 'US02Y', price: '99.672', dayChange: '-0.12%', yieldRate: '4.924%', numericYield: 4.924, isNegative: true },
  { maturity: '5 years', symbol: 'US05Y', price: '99.703', dayChange: '-0.33%', yieldRate: '5.068%', numericYield: 5.068, isNegative: true },
  { maturity: '10 years', symbol: 'US10Y', price: '95.375', dayChange: '-0.49%', yieldRate: '5.230%', numericYield: 5.230, isNegative: true },
  { maturity: '30 years', symbol: 'US30Y', price: '94.063', dayChange: '-0.64%', yieldRate: '5.533%', numericYield: 5.533, isNegative: true }
];

export const ECONOMIC_INDICATORS = [
  { country: 'USA', gdp: '$27.36 T', gdpGrowth: '+2.8%', gdpPositive: true, interestRate: '4.75%', inflationRate: '2.6%', inflationStatus: 'warning', unemployment: '4.1%' },
  { country: 'Mainland China', gdp: '$17.79 T', gdpGrowth: '+4.6%', gdpPositive: true, interestRate: '3.10%', inflationRate: '0.3%', inflationStatus: 'cool', unemployment: '5.1%' },
  { country: 'European Union', gdp: '$18.35 T', gdpGrowth: '+0.9%', gdpPositive: true, interestRate: '3.25%', inflationRate: '2.0%', inflationStatus: 'warning', unemployment: '5.9%' },
  { country: 'Japan', gdp: '$4.21 T', gdpGrowth: '+0.3%', gdpPositive: true, interestRate: '0.25%', inflationRate: '2.3%', inflationStatus: 'warning', unemployment: '2.4%' },
  { country: 'United Kingdom', gdp: '$3.33 T', gdpGrowth: '+1.0%', gdpPositive: true, interestRate: '4.75%', inflationRate: '2.3%', inflationStatus: 'warning', unemployment: '4.3%' }
];

export const ETFS_DATA = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: '$592.10', change: '+0.39%', aum: '$580 B', expense: '0.09%' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: '$512.40', change: '+0.74%', aum: '$290 B', expense: '0.20%' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: '$543.20', change: '+0.38%', aum: '$480 B', expense: '0.03%' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', price: '$232.80', change: '+0.88%', aum: '$72 B', expense: '0.19%' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', price: '$247.90', change: '+0.46%', aum: '$70 B', expense: '0.40%' }
];

// Helper to generate simulated candlestick/history data for charts
export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function generateHistoricalCandles(basePrice: number, count: number = 30): CandlePoint[] {
  const candles: CandlePoint[] = [];
  let currentClose = basePrice * 0.95;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const volatility = currentClose * 0.02;
    const delta = (Math.random() - 0.48) * volatility;
    const open = currentClose;
    const close = Math.max(0.1, open + delta);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 5000000 + 1000000);

    candles.push({
      time: dateStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });
    currentClose = close;
  }
  // Anchor last close to the requested basePrice
  if (candles.length > 0) {
    candles[candles.length - 1].close = basePrice;
    candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, basePrice);
  }
  return candles;
}
