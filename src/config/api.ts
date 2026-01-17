// API Configuration for Mobile App
export const API_BASE_URL = 'https://backtestapi-app-20251224115020.victoriousdune-87d9c161.australiaeast.azurecontainerapps.io';
export const CHAT_API_URL = 'https://earneto-api.yellowtree-180e8998.eastus.azurecontainerapps.io';

export const API_ENDPOINTS = {
  BACKTEST_RUN: `${API_BASE_URL}/api/backtest/run`,
  KITE_ACCESS_TOKEN: `${API_BASE_URL}/api/Backtest/kite-access-token`,
  SET_ACCESS_TOKEN: `${API_BASE_URL}/api/backtest/set-access-token`,
  START_MARKET: `${API_BASE_URL}/api/market/start`,
  STOP_MARKET: `${API_BASE_URL}/api/market/stop`,
  GET_FEEDS: `${API_BASE_URL}/api/feeds`,
  CHAT_STREAM: `${CHAT_API_URL}/api/LLM/streamchat`,
};

export const REQUEST_TIMEOUT = 300000; // 5 minutes
