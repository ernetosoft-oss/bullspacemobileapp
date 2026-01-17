// Shared types for the application
export interface BacktestResult {
  symbol?: string;
  tradingSymbol?: string;
  side?: string;
  isClosed?: boolean;
  pnl?: number;
  executionTime?: string;
  [key: string]: any;
}

export interface Analytics {
  buyWinRate?: number;
  sellWinRate?: number;
  buyTrades?: number;
  sellTrades?: number;
  totalPnl?: number;
  winRate?: number;
  [key: string]: any;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface FeedItem {
  category: string;
  containerName: string;
  blobName: string;
  lastModified: string;
  size: number;
}

export interface TokenMetadata {
  functionApp?: string;
  configKey?: string;
  retrievedAt?: string;
}
