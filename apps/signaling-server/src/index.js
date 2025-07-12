// Basic WebSocket signaling server for WebRTC

const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = generateClientId();
  clients.set(clientId, ws);
  
  console.log(`Client ${clientId} connected`);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Message from ${clientId}:`, data.type);
      
      // Relay message to target client or broadcast
      if (data.to && clients.has(data.to)) {
        const targetWs = clients.get(data.to);
        targetWs.send(JSON.stringify({ ...data, from: clientId }));
      } else {
        // Broadcast to all other clients
        clients.forEach((clientWs, id) => {
          if (id !== clientId) {
            clientWs.send(JSON.stringify({ ...data, from: clientId }));
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
  
  // Send welcome message
  ws.send(JSON.stringify({ 
    type: 'welcome', 
    payload: { clientId } 
  }));
});

function generateClientId() {
  return Math.random().toString(36).substr(2, 9);
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
