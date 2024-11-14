const WebSocket = require('ws');

// Create WebSocket connection to Binance Futures stream
const ws = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

ws.on('open', () => {
  console.log("Connected to Binance Futures WebSocket!");
});

ws.on('message', (data) => {
  const allPairs = JSON.parse(data);

  // Filter pairs that end with 'USDT' and are futures
  const usdtFuturesPairs = allPairs
    .filter(pair => pair.s.endsWith('USDT'))
    .map(pair => pair.s);

  // Format the pairs as an array of strings
  const usdtFuturesArray = JSON.stringify(usdtFuturesPairs).toLowerCase();
  
  console.log("USDT Futures Pairs:", usdtFuturesArray);
});

ws.on('error', (err) => {
  console.error("WebSocket error:", err);
});

ws.on('close', () => {
  console.log("WebSocket closed.");
});
