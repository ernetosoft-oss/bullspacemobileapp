import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from 'react-native';
import { backtestService } from '../services/backtestService';

interface FeedItem {
  category: string;
  containerName: string;
  blobName: string;
  lastModified: string;
  size: number;
}

interface FeedsData {
  feeds: FeedItem[];
  timestamp: string;
}

export default function LiveFeedsScreen() {
  const [feedsData, setFeedsData] = useState<FeedsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Market Data');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await backtestService.getFeeds();
      setFeedsData(data);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feeds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();

    let intervalId: NodeJS.Timeout;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchFeeds();
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, fetchFeeds]);

  const categories =
    feedsData && feedsData.feeds
      ? [...new Set(feedsData.feeds.map((feed) => feed.category))]
      : [];

  const feedsInCategory =
    feedsData && feedsData.feeds
      ? feedsData.feeds.filter((feed) => feed.category === selectedCategory)
      : [];

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const extractSymbol = (blobName: string) => {
    if (!blobName) return '';
    const parts = blobName.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace('.json', '').replace('.log', '');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'market data': '#667eea',
      orders: '#f5576c',
      logs: '#fa709a',
      'raw data': '#4facfe',
      general: '#2bd2ff',
    };
    return colors[category?.toLowerCase()] || colors.general;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.refreshContainer}>
          <Text style={styles.refreshLabel}>Auto Refresh</Text>
          <Switch
            value={autoRefresh}
            onValueChange={setAutoRefresh}
            trackColor={{ false: '#ddd', true: '#007bff' }}
          />
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchFeeds}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {lastRefresh && (
        <Text style={styles.lastRefreshText}>
          Last updated: {lastRefresh.toLocaleTimeString()}
        </Text>
      )}

      <ScrollView
        horizontal
        style={styles.categoriesContainer}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && {
                backgroundColor: getCategoryColor(category),
              },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && !feedsData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading feeds...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFeeds}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.feedsContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchFeeds} />
          }
        >
          {feedsInCategory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No feeds available</Text>
            </View>
          ) : (
            feedsInCategory.map((feed, index) => (
              <View
                key={index}
                style={[
                  styles.feedCard,
                  { borderLeftColor: getCategoryColor(feed.category) },
                ]}
              >
                <View style={styles.feedHeader}>
                  <Text style={styles.feedContainer}>{feed.containerName}</Text>
                  <Text style={styles.feedTime}>
                    {formatTime(feed.lastModified)}
                  </Text>
                </View>
                <Text style={styles.feedSymbol}>
                  {extractSymbol(feed.blobName)}
                </Text>
                <View style={styles.feedFooter}>
                  <Text style={styles.feedSize}>{formatSize(feed.size)}</Text>
                  <Text style={styles.feedBlob} numberOfLines={1}>
                    {feed.blobName}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lastRefreshText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    paddingVertical: 5,
    backgroundColor: '#f8f9fa',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedsContainer: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  feedCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedContainer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  feedTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  feedSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  feedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedSize: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  feedBlob: {
    fontSize: 11,
    color: '#adb5bd',
    flex: 1,
    marginLeft: 10,
  },
});
