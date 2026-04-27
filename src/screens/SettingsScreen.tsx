import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [defaultSymbol, setDefaultSymbol] = useState('');
  const [defaultTag, setDefaultTag] = useState('');
  const [maxSymbolsPerDay, setMaxSymbolsPerDay] = useState('4');
  const [riskTolerance, setRiskTolerance] = useState('Medium');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = async () => {
    try {
      const settings = {
        defaultSymbol,
        defaultTag,
        maxSymbolsPerDay,
        riskTolerance,
        emailNotifications,
        smsNotifications,
        pushNotifications,
      };

      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setDefaultSymbol('');
            setDefaultTag('');
            setMaxSymbolsPerDay('4');
            setRiskTolerance('Medium');
            setEmailNotifications(true);
            setSmsNotifications(false);
            setPushNotifications(true);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <Text style={styles.label}>Default Symbol</Text>
        <TextInput
          style={styles.input}
          value={defaultSymbol}
          onChangeText={setDefaultSymbol}
          placeholder="Enter default symbol"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Default Tag</Text>
        <TextInput
          style={styles.input}
          value={defaultTag}
          onChangeText={setDefaultTag}
          placeholder="Enter default tag"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strategy Configuration</Text>

        <Text style={styles.label}>Max Symbols Per Day</Text>
        <TextInput
          style={styles.input}
          value={maxSymbolsPerDay}
          onChangeText={setMaxSymbolsPerDay}
          placeholder="4"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Risk Tolerance</Text>
        <View style={styles.riskButtons}>
          {['Low', 'Medium', 'High'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.riskButton,
                riskTolerance === level && styles.riskButtonActive,
              ]}
              onPress={() => setRiskTolerance(level)}
            >
              <Text
                style={[
                  styles.riskButtonText,
                  riskTolerance === level && styles.riskButtonTextActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Email Notifications</Text>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: '#ddd', true: '#007bff' }}
            thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>SMS Notifications</Text>
          <Switch
            value={smsNotifications}
            onValueChange={setSmsNotifications}
            trackColor={{ false: '#ddd', true: '#007bff' }}
            thumbColor={smsNotifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#ddd', true: '#007bff' }}
            thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>
            BullsPlace - Stock Analysis Platform
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleReset}
        >
          <Text style={styles.buttonSecondaryText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
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
  },
  riskButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  riskButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  riskButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  riskButtonText: {
    fontSize: 16,
    color: '#6c757d',
  },
  riskButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 30,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
});
