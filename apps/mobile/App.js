// Basic React Native app for WebRTC audio capture

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleConnect = () => {
    // Simulate connection to signaling server
    setTimeout(() => {
      setIsConnected(true);
      Alert.alert('Success', 'Connected to signaling server');
    }, 1000);
  };

  const handleStartStreaming = () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please connect to signaling server first');
      return;
    }
    
    setIsStreaming(!isStreaming);
    Alert.alert(
      'Info', 
      isStreaming ? 'Stopped audio streaming' : 'Started audio streaming'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebRTC Audio Mobile</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[
          styles.statusText, 
          isConnected ? styles.connected : styles.disconnected
        ]}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, isConnected && styles.buttonDisabled]} 
        onPress={handleConnect}
        disabled={isConnected}
      >
        <Text style={styles.buttonText}>
          {isConnected ? 'Connected' : 'Connect to Server'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.button, 
          isStreaming ? styles.buttonStop : styles.buttonStart,
          !isConnected && styles.buttonDisabled
        ]} 
        onPress={handleStartStreaming}
        disabled={!isConnected}
      >
        <Text style={styles.buttonText}>
          {isStreaming ? 'Stop Streaming' : 'Start Audio Stream'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#666',
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
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
  },
  buttonStart: {
    backgroundColor: '#28a745',
  },
  buttonStop: {
    backgroundColor: '#dc3545',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
