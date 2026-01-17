import React, { useState, useEffect } from 'react';
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
import { backtestService } from '../services/backtestService';

export default function IntegrationScreen() {
  const [kiteToken, setKiteToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState<any>(null);
  const [newAccessToken, setNewAccessToken] = useState('');
  const [updateTokenLoading, setUpdateTokenLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const fetchKiteToken = async () => {
    setTokenLoading(true);
    try {
      const data = await backtestService.getKiteAccessToken();

      if (data && data.value) {
        setKiteToken(data.value);
        setTokenMetadata({
          functionApp: data.functionApp,
          configKey: data.configKey,
          retrievedAt: data.retrievedAt,
        });
      } else {
        throw new Error('Token value not found in response');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch token');
      setKiteToken('');
      setTokenMetadata(null);
    } finally {
      setTokenLoading(false);
    }
  };

  const handleSetAccessToken = async () => {
    if (!newAccessToken.trim()) {
      Alert.alert('Error', 'Please enter an access token');
      return;
    }

    setUpdateTokenLoading(true);

    try {
      await backtestService.setAccessToken(newAccessToken);
      Alert.alert('Success', 'Access token updated successfully');
      setNewAccessToken('');
      // Refresh the token display
      await fetchKiteToken();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update token');
    } finally {
      setUpdateTokenLoading(false);
    }
  };

  const handleStartMarket = async () => {
    setIsStarting(true);
    try {
      await backtestService.startMarket();
      setIsRunning(true);
      Alert.alert('Success', 'Market started successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start market');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopMarket = async () => {
    setIsStopping(true);
    try {
      await backtestService.stopMarket();
      setIsRunning(false);
      Alert.alert('Success', 'Market stopped successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to stop market');
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kite Access Token</Text>
        
        <TouchableOpacity
          style={[styles.button, tokenLoading && styles.buttonDisabled]}
          onPress={fetchKiteToken}
          disabled={tokenLoading}
        >
          {tokenLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Fetch Current Token</Text>
          )}
        </TouchableOpacity>

        {kiteToken && (
          <View style={styles.tokenDisplay}>
            <Text style={styles.tokenLabel}>Current Token:</Text>
            <Text style={styles.tokenValue} numberOfLines={2}>
              {kiteToken}
            </Text>
            {tokenMetadata && (
              <View style={styles.metadata}>
                <Text style={styles.metadataText}>
                  Retrieved: {new Date(tokenMetadata.retrievedAt).toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Access Token</Text>
        
        <TextInput
          style={styles.input}
          value={newAccessToken}
          onChangeText={setNewAccessToken}
          placeholder="Enter new access token"
          multiline
        />

        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonSuccess,
            updateTokenLoading && styles.buttonDisabled,
          ]}
          onPress={handleSetAccessToken}
          disabled={updateTokenLoading}
        >
          {updateTokenLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Set Access Token</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Control</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View
            style={[
              styles.statusIndicator,
              isRunning ? styles.statusRunning : styles.statusStopped,
            ]}
          >
            <Text style={styles.statusText}>
              {isRunning ? '● RUNNING' : '○ STOPPED'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonSuccess,
              styles.halfButton,
              (isStarting || isRunning) && styles.buttonDisabled,
            ]}
            onPress={handleStartMarket}
            disabled={isStarting || isRunning}
          >
            {isStarting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Start Market</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonDanger,
              styles.halfButton,
              (isStopping || !isRunning) && styles.buttonDisabled,
            ]}
            onPress={handleStopMarket}
            disabled={isStopping || !isRunning}
          >
            {isStopping ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Stop Market</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Integration Info</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            • Configure Kite Connect API integration
          </Text>
          <Text style={styles.infoText}>
            • Manage access tokens for live trading
          </Text>
          <Text style={styles.infoText}>
            • Control market data streaming
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    marginBottom: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tokenDisplay: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  tokenValue: {
    fontSize: 13,
    color: '#6c757d',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metadata: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  metadataText: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusRunning: {
    backgroundColor: '#d4edda',
  },
  statusStopped: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    width: '48%',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 20,
  },
});
