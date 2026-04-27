import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'INFY', name: 'Infosys' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'ITC', name: 'ITC Limited' },
];

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleSearch = () => {
    const symbol = searchQuery.trim().toUpperCase();
    if (!symbol) return;
    setIsSearching(true);
    Keyboard.dismiss();
    navigation.navigate('Fundamentals', { symbol });
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleQuickSearch = (symbol: string) => {
    setSearchQuery(symbol);
    navigation.navigate('Fundamentals', { symbol });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>BP</Text>
          </View>
        </View>
        <Text style={styles.title}>BullsPlace</Text>
        <Text style={styles.tagline}>Ride your money at bullsplace</Text>

        {/* Auth Status */}
        {isAuthenticated && user ? (
          <Text style={styles.welcome}>Welcome, {user.name || user.email}!</Text>
        ) : (
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Box */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stock symbol (e.g., RELIANCE)"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(t) => setSearchQuery(t.toUpperCase())}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.searchBtn, !searchQuery.trim() && styles.searchBtnDisabled]}
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.searchBtnText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Popular Stocks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Stocks</Text>
        <View style={styles.stockGrid}>
          {POPULAR_STOCKS.map((stock) => (
            <TouchableOpacity
              key={stock.symbol}
              style={styles.stockChip}
              onPress={() => handleQuickSearch(stock.symbol)}
            >
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <Text style={styles.stockName}>{stock.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why BullsPlace?</Text>
        {[
          { icon: '🔍', title: 'Stock Analysis', desc: 'Deep dive into company fundamentals and financials' },
          { icon: '📊', title: 'Financial Data', desc: 'Quarterly & annual results, ratios, and metrics' },
          { icon: '🤖', title: 'AI Insights', desc: 'AI-powered verdicts and investment recommendations' },
          { icon: '📈', title: 'Live Tracking', desc: 'Real-time price data and market information' },
        ].map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoContainer: {
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  welcome: {
    marginTop: 16,
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  signInBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#667eea',
  },
  signInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  searchBtn: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchBtnDisabled: {
    backgroundColor: '#ccc',
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stockChip: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    width: '47%',
  },
  stockSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#667eea',
  },
  stockName: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  featureDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },
});
