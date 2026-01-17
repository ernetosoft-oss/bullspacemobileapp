import apiService from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface BacktestResult {
  symbol?: string;
  side?: string;
  isClosed?: boolean;
  pnl?: number;
  [key: string]: any;
}

export interface BacktestAnalytics {
  buyWinRate?: number;
  sellWinRate?: number;
  buyTrades?: number;
  sellTrades?: number;
  [key: string]: any;
}

export interface BacktestResponse {
  results?: BacktestResult[];
  analytics?: BacktestAnalytics;
}

export const backtestService = {
  async runBacktest(tag: string, symbol: string): Promise<BacktestResponse> {
    return apiService.post(API_ENDPOINTS.BACKTEST_RUN, { tag, symbol });
  },

  async getKiteAccessToken(): Promise<any> {
    return apiService.get(API_ENDPOINTS.KITE_ACCESS_TOKEN);
  },

  async setAccessToken(accessToken: string): Promise<any> {
    return apiService.post(API_ENDPOINTS.SET_ACCESS_TOKEN, { accessToken });
  },

  async startMarket(): Promise<any> {
    return apiService.post(API_ENDPOINTS.START_MARKET);
  },

  async stopMarket(): Promise<any> {
    return apiService.post(API_ENDPOINTS.STOP_MARKET);
  },

  async getFeeds(): Promise<any> {
    return apiService.get(API_ENDPOINTS.GET_FEEDS);
  },
};
