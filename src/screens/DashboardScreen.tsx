import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { backtestService, BacktestResult } from '../services/backtestService';

export default function DashboardScreen() {
  const [symbol, setSymbol] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const handleRunBacktest = async () => {
    if (!symbol.trim() || !tag.trim()) {
      Alert.alert('Error', 'Please enter both symbol and tag');
      return;
    }

    setLoading(true);
    setResults([]);
    setAnalytics(null);

    try {
      const response = await backtestService.runBacktest(tag, symbol);
      const dataArray = Array.isArray(response) ? response : (response.results || []);
      
      setResults(dataArray);

      // Calculate analytics
      if (response.analytics || dataArray.length > 0) {
        const buyTrades = dataArray.filter((r: BacktestResult) => r.side === 'BUY' && r.isClosed);
        const sellTrades = dataArray.filter((r: BacktestResult) => r.side === 'SELL' && r.isClosed);

        const buyWins = buyTrades.filter((r: BacktestResult) => (r.pnl || 0) > 0).length;
        const sellWins = sellTrades.filter((r: BacktestResult) => (r.pnl || 0) > 0).length;

        const buyWinRate = buyTrades.length > 0 ? (buyWins / buyTrades.length) : 0;
        const sellWinRate = sellTrades.length > 0 ? (sellWins / sellTrades.length) : 0;

        setAnalytics({
          ...response.analytics,
          buyWinRate,
          sellWinRate,
          buyTrades: buyTrades.length,
          sellTrades: sellTrades.length,
        });
      }

      Alert.alert('Success', `Loaded ${dataArray.length} results`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to run backtest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Symbol</Text>
        <TextInput
          style={styles.input}
          value={symbol}
          onChangeText={setSymbol}
          placeholder="Enter symbol (e.g., SBIN)"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Tag</Text>
        <TextInput
          style={styles.input}
          value={tag}
          onChangeText={setTag}
          placeholder="Enter tag"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRunBacktest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Run Backtest</Text>
          )}
        </TouchableOpacity>
      </View>

      {analytics && (
        <View style={styles.analyticsContainer}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Total Trades</Text>
              <Text style={styles.analyticsValue}>{results.length}</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Buy Trades</Text>
              <Text style={styles.analyticsValue}>{analytics.buyTrades || 0}</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Sell Trades</Text>
              <Text style={styles.analyticsValue}>{analytics.sellTrades || 0}</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Buy Win Rate</Text>
              <Text style={styles.analyticsValue}>
                {((analytics.buyWinRate || 0) * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Sell Win Rate</Text>
              <Text style={styles.analyticsValue}>
                {((analytics.sellWinRate || 0) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Results ({results.length})</Text>
          {results.slice(0, 20).map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.resultText}>
                Symbol: {result.symbol || 'N/A'}
              </Text>
              <Text style={styles.resultText}>
                Side: {result.side || 'N/A'}
              </Text>
              <Text
                style={[
                  styles.resultText,
                  { color: (result.pnl || 0) >= 0 ? '#28a745' : '#dc3545' },
                ]}
              >
                PnL: {result.pnl?.toFixed(2) || '0.00'}
              </Text>
            </View>
          ))}
          {results.length > 20 && (
            <Text style={styles.moreText}>
              + {results.length - 20} more results
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analyticsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  moreText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
