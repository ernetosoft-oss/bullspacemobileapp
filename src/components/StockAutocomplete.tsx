import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Modal,
  Pressable,
} from 'react-native';
import { TRADEMATE_API_URL } from '../config/api';

interface StockSuggestion {
  symbol: string;
  name: string;
  sector: string;
  market_cap_cr: number;
}

interface StockAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (symbol: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function StockAutocomplete({
  value,
  onChangeText,
  onSelect,
  placeholder = 'Search stock symbol...',
  autoFocus = false,
}: StockAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounced search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const fetchSuggestions = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${TRADEMATE_API_URL}/api/stocks/search?q=${encodeURIComponent(query)}&limit=10`
      );
      const data = await response.json();
      
      if (data.success && data.results) {
        setSuggestions(data.results);
        setShowDropdown(data.results.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Stock search error:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onChangeText(symbol);
    setSuggestions([]);
    setShowDropdown(false);
    Keyboard.dismiss();
    onSelect(symbol);
  };

  const formatMarketCap = (mcap: number) => {
    if (mcap >= 100000) return `₹${(mcap / 100000).toFixed(1)}L Cr`;
    if (mcap >= 1000) return `₹${(mcap / 1000).toFixed(1)}K Cr`;
    return `₹${mcap?.toLocaleString('en-IN')} Cr`;
  };

  const renderSuggestion = ({ item }: { item: StockSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelect(item.symbol)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionMain}>
        <Text style={styles.symbolText}>{item.symbol}</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.suggestionMeta}>
        <Text style={styles.sectorText} numberOfLines={1}>
          {item.sector}
        </Text>
        {item.market_cap_cr > 0 && (
          <Text style={styles.mcapText}>{formatMarketCap(item.market_cap_cr)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus={autoFocus}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (value.trim()) {
              handleSelect(value.trim().toUpperCase());
            }
          }}
        />
        {loading && (
          <ActivityIndicator size="small" color="#2196F3" style={styles.loader} />
        )}
        {value.length > 0 && !loading && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onChangeText('');
              setSuggestions([]);
              setShowDropdown(false);
            }}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown && suggestions.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.symbol}
              style={styles.suggestionList}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={true}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  loader: {
    marginLeft: 8,
  },
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearText: {
    fontSize: 18,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 120, // Position below search bar
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  suggestionList: {
    flexGrow: 0,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionMain: {
    marginBottom: 4,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 14,
    color: '#666',
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectorText: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    marginRight: 8,
  },
  mcapText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
});
