import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { TRADEMATE_API_URL } from '../config/api';

interface FundamentalsData {
  stock: string;
  sector: string;
  current_price: number;
  high_52w: number;
  low_52w: number;
  market_cap_cr: number;
  pe_ratio: number;
  price_to_book: number;
  dividend_yield: number;
  roce: number;
  roe: number;
  debt_to_equity: number;
  interest_coverage_ratio: number;
  current_ratio: number;
  quick_ratio: number;
  roa: number;
  operating_cash_flow: number;
  quarterly_results: Array<{
    period: string;
    sales: number;
    net_profit: number;
    opm_pct: number;
    eps: number;
  }>;
  annual_results: Array<{
    year: string;
    sales: number;
    net_profit: number;
    opm_pct: number;
    eps: number;
  }>;
}

const MetricCard = ({ label, value, suffix = '', color }: { label: string; value: any; suffix?: string; color?: string }) => {
  const numVal = typeof value === 'number' ? value : parseFloat(value);
  const displayColor = color || (numVal > 0 ? '#10b981' : numVal < 0 ? '#ef4444' : '#666');
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: displayColor }]}>
        {typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : value || 'N/A'}
        {suffix}
      </Text>
    </View>
  );
};

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function FundamentalsScreen({ route, navigation }: any) {
  const symbolFromRoute = route?.params?.symbol;
  const [symbol, setSymbol] = useState(symbolFromRoute || '');
  const [searchInput, setSearchInput] = useState(symbolFromRoute || '');
  const [data, setData] = useState<FundamentalsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ symbol: string; name: string }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [resultTab, setResultTab] = useState<'quarterly' | 'annual'>('quarterly');

  useEffect(() => {
    if (symbolFromRoute) {
      fetchFundamentals(symbolFromRoute);
    }
  }, [symbolFromRoute]);

  const fetchFundamentals = async (sym: string) => {
    setLoading(true);
    setError('');
    setSuggestions([]);
    setData(null);
    setSymbol(sym);
    setSearchInput(sym);

    try {
      const res = await fetch(`${TRADEMATE_API_URL}/api/fundamentals/${sym}`);
      const json = await res.json();

      if (json.not_found && json.resolution?.suggestions) {
        setSuggestions(json.resolution.suggestions);
        if (json.resolution.resolved_symbol) {
          // Auto-resolve: fetch the resolved symbol
          fetchFundamentals(json.resolution.resolved_symbol);
          return;
        }
        setError(json.resolution?.message || `Symbol "${sym}" not found.`);
      } else if (json.success && json.fundamentals) {
        setData(json.fundamentals);
      } else {
        setError(json.error || 'Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const sym = searchInput.trim().toUpperCase();
    if (sym) fetchFundamentals(sym);
  };

  const onRefresh = async () => {
    if (!symbol) return;
    setRefreshing(true);
    await fetchFundamentals(symbol);
    setRefreshing(false);
  };

  const formatCr = (val: number) => {
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L Cr`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K Cr`;
    return `${val?.toLocaleString('en-IN')} Cr`;
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter stock symbol..."
          placeholderTextColor="#999"
          value={searchInput}
          onChangeText={(t) => setSearchInput(t.toUpperCase())}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Fetching {symbol} fundamentals...</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          {suggestions.length > 0 && (
            <View style={styles.suggestionsBox}>
              <Text style={styles.suggestLabel}>Did you mean:</Text>
              {suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestChip}
                  onPress={() => fetchFundamentals(s.symbol)}
                >
                  <Text style={styles.suggestSymbol}>{s.symbol}</Text>
                  <Text style={styles.suggestName}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* No data prompt */}
      {!loading && !error && !data && (
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📊</Text>
          <Text style={styles.emptyText}>Search for a stock to see fundamentals</Text>
        </View>
      )}

      {/* Fundamentals Data */}
      {data && !loading && (
        <View style={styles.dataContainer}>
          {/* Header */}
          <View style={styles.stockHeader}>
            <Text style={styles.stockSymbol}>{data.stock}</Text>
            <Text style={styles.stockSector}>{data.sector || 'N/A'}</Text>
            <Text style={styles.stockPrice}>₹{data.current_price?.toLocaleString('en-IN')}</Text>
            <View style={styles.rangeRow}>
              <Text style={styles.rangeLabel}>52W: </Text>
              <Text style={[styles.rangeVal, { color: '#ef4444' }]}>₹{data.low_52w?.toLocaleString('en-IN')}</Text>
              <Text style={styles.rangeSep}> — </Text>
              <Text style={[styles.rangeVal, { color: '#10b981' }]}>₹{data.high_52w?.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Valuation */}
          <SectionHeader title="Valuation" icon="💰" />
          <View style={styles.metricsGrid}>
            <MetricCard label="Market Cap" value={data.market_cap_cr ? formatCr(data.market_cap_cr) : 'N/A'} color="#667eea" />
            <MetricCard label="P/E Ratio" value={data.pe_ratio} color="#667eea" />
            <MetricCard label="P/B Ratio" value={data.price_to_book} color="#667eea" />
            <MetricCard label="Div Yield" value={data.dividend_yield} suffix="%" />
          </View>

          {/* Profitability */}
          <SectionHeader title="Profitability" icon="📈" />
          <View style={styles.metricsGrid}>
            <MetricCard label="ROCE" value={data.roce} suffix="%" />
            <MetricCard label="ROE" value={data.roe} suffix="%" />
            <MetricCard label="ROA" value={data.roa} suffix="%" />
          </View>

          {/* Financial Health */}
          <SectionHeader title="Financial Health" icon="🏦" />
          <View style={styles.metricsGrid}>
            <MetricCard label="Debt/Equity" value={data.debt_to_equity} color={data.debt_to_equity < 1 ? '#10b981' : '#ef4444'} />
            <MetricCard label="Interest Coverage" value={data.interest_coverage_ratio} color={data.interest_coverage_ratio > 3 ? '#10b981' : '#ef4444'} />
            <MetricCard label="Current Ratio" value={data.current_ratio} color={data.current_ratio > 1.5 ? '#10b981' : '#f59e0b'} />
            <MetricCard label="Quick Ratio" value={data.quick_ratio} />
          </View>

          {/* Cash Flow */}
          <SectionHeader title="Cash Flow" icon="💵" />
          <View style={styles.metricsGrid}>
            <MetricCard label="Operating CF" value={data.operating_cash_flow ? formatCr(data.operating_cash_flow) : 'N/A'} />
          </View>

          {/* Results Table */}
          {((data.quarterly_results?.length ?? 0) > 0 || (data.annual_results?.length ?? 0) > 0) && (
            <>
              <SectionHeader title="Financial Results" icon="📋" />
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tab, resultTab === 'quarterly' && styles.tabActive]}
                  onPress={() => setResultTab('quarterly')}
                >
                  <Text style={[styles.tabText, resultTab === 'quarterly' && styles.tabTextActive]}>Quarterly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, resultTab === 'annual' && styles.tabActive]}
                  onPress={() => setResultTab('annual')}
                >
                  <Text style={[styles.tabText, resultTab === 'annual' && styles.tabTextActive]}>Annual</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View>
                  {/* Table Header */}
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>Period</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>Sales (Cr)</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>Net Profit</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>OPM %</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>EPS</Text>
                  </View>
                  {/* Rows */}
                  {(resultTab === 'quarterly' ? data.quarterly_results : data.annual_results)
                    ?.slice(0, 8)
                    .map((row: any, i: number) => (
                      <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                        <Text style={[styles.tableCell, { width: 100 }]}>{row.period || row.year}</Text>
                        <Text style={[styles.tableCell, { width: 100 }]}>
                          {row.sales?.toLocaleString('en-IN') || 'N/A'}
                        </Text>
                        <Text
                          style={[
                            styles.tableCell,
                            { width: 100, color: row.net_profit >= 0 ? '#10b981' : '#ef4444' },
                          ]}
                        >
                          {row.net_profit?.toLocaleString('en-IN') || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, { width: 80 }]}>{row.opm_pct ?? 'N/A'}%</Text>
                        <Text style={[styles.tableCell, { width: 80 }]}>₹{row.eps ?? 'N/A'}</Text>
                      </View>
                    ))}
                </View>
              </ScrollView>
            </>
          )}

          <View style={{ height: 40 }} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  searchBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  searchBtn: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#667eea',
    fontSize: 14,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  suggestionsBox: {
    marginTop: 12,
  },
  suggestLabel: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  suggestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  suggestSymbol: {
    fontWeight: '700',
    color: '#667eea',
    marginRight: 8,
  },
  suggestName: {
    color: '#666',
    fontSize: 13,
  },
  dataContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  stockHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  stockSector: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  stockPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#667eea',
    marginTop: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  rangeLabel: {
    color: '#888',
    fontSize: 12,
  },
  rangeVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  rangeSep: {
    color: '#ccc',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    width: '47%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  tabActive: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
  tableHeader: {
    fontWeight: '700',
    color: '#667eea',
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 6,
  },
});
