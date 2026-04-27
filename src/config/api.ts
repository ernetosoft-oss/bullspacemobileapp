// API Configuration for Mobile App
export const API_BASE_URL = 'https://backtestapi-app-20251224115020.victoriousdune-87d9c161.australiaeast.azurecontainerapps.io';
export const CHAT_API_URL = 'https://earneto-api.yellowtree-180e8998.eastus.azurecontainerapps.io';
export const TRADEMATE_API_URL = 'https://trademate-api.icymeadow-1e7fd3ee.eastus.azurecontainerapps.io';

export const API_ENDPOINTS = {
  BACKTEST_RUN: `${API_BASE_URL}/api/backtest/run`,
  KITE_ACCESS_TOKEN: `${API_BASE_URL}/api/Backtest/kite-access-token`,
  SET_ACCESS_TOKEN: `${API_BASE_URL}/api/backtest/set-access-token`,
  START_MARKET: `${API_BASE_URL}/api/market/start`,
  STOP_MARKET: `${API_BASE_URL}/api/market/stop`,
  GET_FEEDS: `${API_BASE_URL}/api/feeds`,
  CHAT_STREAM: `${CHAT_API_URL}/api/LLM/streamchat`,
  FUNDAMENTALS: (symbol: string) => `${TRADEMATE_API_URL}/api/fundamentals/${symbol}`,
  STOCKS_SEARCH: (query: string, limit: number = 10) => `${TRADEMATE_API_URL}/api/stocks/search?q=${encodeURIComponent(query)}&limit=${limit}`,
  AUTH_LOGIN: `${TRADEMATE_API_URL}/api/auth/login`,
  AUTH_REGISTER: `${TRADEMATE_API_URL}/api/auth/register`,
  AUTH_GOOGLE: `${TRADEMATE_API_URL}/api/auth/google`,
  AUTH_ME: `${TRADEMATE_API_URL}/api/auth/me`,
  AUTH_LOGOUT: `${TRADEMATE_API_URL}/api/auth/logout`,
};

export const REQUEST_TIMEOUT = 300000; // 5 minutes
