// Cross-Platform Mobile App Template

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [appInfo, setAppInfo] = useState({
    platform: Platform.OS,
    version: '1.0.0',
  });

  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => {
      setUserCount(Math.floor(Math.random() * 100) + 1);
    }, 1000);
  }, []);

  const handleConnect = () => {
    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true);
      Alert.alert('Success', 'Connected to backend API');
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    Alert.alert('Info', 'Disconnected from backend API');
  };

  const handleAction = () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please connect to the backend first');
      return;
    }

    Alert.alert('Success', 'Action performed successfully!');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>Cross-Platform Mobile</Text>
      <Text style={styles.subtitle}>React Native + Expo Template</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Platform: {appInfo.platform}</Text>
        <Text style={styles.infoText}>Version: {appInfo.version}</Text>
        <Text style={styles.infoText}>Users Online: {userCount}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>API Status:</Text>
        <Text style={[
          styles.statusText,
          isConnected ? styles.connected : styles.disconnected
        ]}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      {!isConnected ? (
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleConnect}
        >
          <Text style={styles.buttonText}>Connect to Backend</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleDisconnect}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          styles.buttonSuccess,
          !isConnected && styles.buttonDisabled
        ]}
        onPress={handleAction}
        disabled={!isConnected}
      >
        <Text style={styles.buttonText}>Perform Action</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212529',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#6c757d',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connected: {
    color: '#28a745',
  },
  disconnected: {
    color: '#dc3545',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonDisabled: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
