const WebSocket = require('ws');
const axios = require('axios');
const { RSI } = require('technicalindicators');

// Configuration
const coinPairs = ['bnbusdt', 'btcusdt', 'ethusdt', 'fetusdt', 'xrpusdt', 'dogeusdt', 'apeusdt'];
const interval = '30m'; // Default time frame for volume and RSI checks
const volumeThresholdMultiplier = 1.5;
const rsiPeriod = 14;
const orderBookImbalanceRatio = 1.5;
const rsiOverbought = 70;
const rsiOversold = 30;

// Store price data for RSI calculation
const priceData = {};

// Store order book snapshots for each pair
const orderBookSnapshots = {};

// Fetch initial order book snapshot using REST API
async function fetchOrderBookSnapshot(pair) {
    try {
        const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${pair.toUpperCase()}&limit=5`);
        orderBookSnapshots[pair] = {
            bids: response.data.bids,
            asks: response.data.asks,
        };
        console.log(`${pair.toUpperCase()} - Order book snapshot fetched.`);
    } catch (error) {
        console.error(`Error fetching initial order book snapshot for ${pair.toUpperCase()}:`, error);
    }
}

// Start WebSocket for candlestick data
coinPairs.forEach(pair => {
    // Fetch initial snapshot for the order book
    fetchOrderBookSnapshot(pair);

    priceData[pair] = {
        closingPrices: [],
        averageVolume: 0,
        currentVolume: 0
    };

    // Fetch historical volume for the coin pair
    fetchHistoricalVolume(pair);

    const klineWs = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@kline_${interval}`);

    klineWs.on('message', (data) => {
        const parsedData = JSON.parse(data);
        const kline = parsedData.k;
        const closingPrice = parseFloat(kline.c);
        const volume = parseFloat(kline.v);

        if (kline.x) { // Candle closed
            priceData[pair].closingPrices.push(closingPrice);
            if (priceData[pair].closingPrices.length > rsiPeriod) {
                const rsi = RSI.calculate({ values: priceData[pair].closingPrices, period: rsiPeriod });
                const currentRSI = rsi[rsi.length - 1];

                console.log(`${pair.toUpperCase()} - RSI: ${currentRSI}`);

                if (currentRSI > rsiOverbought) {
                    console.log(`${pair.toUpperCase()} is overbought! RSI: ${currentRSI}`);
                } else if (currentRSI < rsiOversold) {
                    console.log(`${pair.toUpperCase()} is oversold! RSI: ${currentRSI}`);
                }
            }

            // Check volume spike
            const avgVolume = priceData[pair].averageVolume;
            if (volume > avgVolume * volumeThresholdMultiplier) {
                console.log(`${pair.toUpperCase()} volume spike detected! Current: ${volume}, Average: ${avgVolume}`);
            }

            // Update current volume for the next comparison
            priceData[pair].currentVolume = volume;
        }
    });

    klineWs.on('error', (err) => {
        console.error(`${pair.toUpperCase()} - Kline WebSocket error:`, err);
    });

    klineWs.on('close', () => {
        console.log(`${pair.toUpperCase()} - Kline WebSocket connection closed`);
    });
});

// Fetch historical volume data for a pair to calculate average volume
async function fetchHistoricalVolume(pair) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair.toUpperCase()}&interval=${interval}&limit=50`;
    try {
        const response = await axios.get(url);
        const klines = response.data;
        const volumes = klines.map(kline => parseFloat(kline[5])); // Volume at index 5
        const avgVolume = volumes.slice(0, -1).reduce((acc, vol) => acc + vol, 0) / (volumes.length - 1);
        priceData[pair].averageVolume = avgVolume;
    } catch (error) {
        console.error(`Error fetching historical data for ${pair.toUpperCase()}:`, error);
    }
}

// Start WebSocket for order book data
coinPairs.forEach(pair => {
    const depthWs = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@depth`);

    depthWs.on('message', (data) => {
        const orderBook = JSON.parse(data);

        // Ensure the order book structure is valid
        if (Array.isArray(orderBook.bids) && Array.isArray(orderBook.asks) && orderBook.bids.length > 0 && orderBook.asks.length > 0) {
            // Apply WebSocket update to the order book snapshot
            updateOrderBook(pair, orderBook);

            const buyOrders = orderBook.bids.reduce((acc, bid) => acc + parseFloat(bid[1]), 0);
            const sellOrders = orderBook.asks.reduce((acc, ask) => acc + parseFloat(ask[1]), 0);

            if (buyOrders > sellOrders * orderBookImbalanceRatio) {
                console.log(`${pair.toUpperCase()} - Order book imbalance detected! Buy: ${buyOrders}, Sell: ${sellOrders}`);
            }
        } else {
            console.warn(`${pair.toUpperCase()} - Received an order book update with empty or missing bids/asks`);
        }
    });

    depthWs.on('error', (err) => {
        console.error(`${pair.toUpperCase()} - Depth WebSocket error:`, err);
    });

    depthWs.on('close', () => {
        console.log(`${pair.toUpperCase()} - Depth WebSocket connection closed`);
    });
});

// Function to update the order book snapshot with WebSocket data
function updateOrderBook(pair, orderBook) {
    if (orderBookSnapshots[pair]) {
        // Update bids
        orderBook.bids.forEach(bid => {
            const price = bid[0];
            const quantity = bid[1];
            const existingBidIndex = orderBookSnapshots[pair].bids.findIndex(b => b[0] === price);

            if (existingBidIndex !== -1) {
                orderBookSnapshots[pair].bids[existingBidIndex][1] = quantity; // Update quantity
            } else {
                orderBookSnapshots[pair].bids.push(bid); // Add new bid
            }
        });

        // Update asks
        orderBook.asks.forEach(ask => {
            const price = ask[0];
            const quantity = ask[1];
            const existingAskIndex = orderBookSnapshots[pair].asks.findIndex(a => a[0] === price);

            if (existingAskIndex !== -1) {
                orderBookSnapshots[pair].asks[existingAskIndex][1] = quantity; // Update quantity
            } else {
                orderBookSnapshots[pair].asks.push(ask); // Add new ask
            }
        });

        console.log(`${pair.toUpperCase()} - Order book updated.`);
    }
}

console.log('Monitoring started for pairs:', coinPairs.map(pair => pair.toUpperCase()).join(', '));
