const express = require("express");
const WebSocket = require("ws");
const NodeCache = require("node-cache");

const app = express();
const port = 3000;

// Cache setup with TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

// Binance WebSocket URL
const binanceWSUrl = "wss://stream.binance.com:9443/ws";

// Your pairs array remains the same
const pairs = [
  "1000000mogusdt",
  "1000bonkusdt",
  "1000catusdt",
  "1000flokiusdt",
  "1000luncusdt",
  "1000pepeusdt",
  "1000ratsusdt",
  "1000satsusdt",
  "1000shibusdt",
  "1000xecusdt",
  "1000xusdt",
  "1inchusdt",
  "1mbabydogeusdt",
  "aaveusdt",
  "aceusdt",
  "achusdt",
  "actusdt",
  "adausdt",
  "aergousdt",
  "aevousdt",
  "agixusdt",
  "agldusdt",
  "aiusdt",
  "algousdt",
  "aliceusdt",
  "alpacausdt",
  "alphausdt",
  "altusdt",
  "ambusdt",
  "ankrusdt",
  "apeusdt",
  "api3usdt",
  "aptusdt",
  "arbusdt",
  "arkmusdt",
  "arkusdt",
  "arpausdt",
  "arusdt",
  "astrusdt",
  "atausdt",
  "atomusdt",
  "auctionusdt",
  "avaxusdt",
  "axlusdt",
  "axsusdt",
  "badgerusdt",
  "bakeusdt",
  "balusdt",
  "bananausdt",
  "bandusdt",
  "batusdt",
  "bbusdt",
  "bchusdt",
  "beamxusdt",
  "belusdt",
  "bicousdt",
  "bigtimeusdt",
  "blurusdt",
  "blzusdt",
  "bnbusdt",
  "bntusdt",
  "bnxusdt",
  "bomeusdt",
  "bondusdt",
  "brettusdt",
  "bsvusdt",
  "bswusdt",
  "btcdomusdt",
  "btcstusdt",
  "btcusdt",
  "c98usdt",
  "cakeusdt",
  "catiusdt",
  "celousdt",
  "celrusdt",
  "cetususdt",
  "cfxusdt",
  "chessusdt",
  "chrusdt",
  "chzusdt",
  "ckbusdt",
  "combousdt",
  "compusdt",
  "cosusdt",
  "cotiusdt",
  "cowusdt",
  "crvusdt",
  "ctkusdt",
  "ctsiusdt",
  "cvcusdt",
  "cvxusdt",
  "cyberusdt",
  "darusdt",
  "dashusdt",
  "defiusdt",
  "dentusdt",
  "dgbusdt",
  "diausdt",
  "dodoxusdt",
  "dogeusdt",
  "dogsusdt",
  "dotusdt",
  "driftusdt",
  "duskusdt",
  "dydxusdt",
  "dymusdt",
  "eduusdt",
  "egldusdt",
  "eigenusdt",
  "enausdt",
  "enjusdt",
  "ensusdt",
  "eosusdt",
  "etcusdt",
  "ethfiusdt",
  "ethusdt",
  "ethwusdt",
  "fetusdt",
  "fidausdt",
  "filusdt",
  "fiousdt",
  "flmusdt",
  "flowusdt",
  "fluxusdt",
  "ftmusdt",
  "fttusdt",
  "fxsusdt",
  "galausdt",
  "gasusdt",
  "ghstusdt",
  "glmrusdt",
  "glmusdt",
  "gmtusdt",
  "gmxusdt",
  "goatusdt",
  "grassusdt",
  "grtusdt",
  "gtcusdt",
  "gusdt",
  "hbarusdt",
  "hftusdt",
  "hifiusdt",
  "highusdt",
  "hippousdt",
  "hmstrusdt",
  "hookusdt",
  "hotusdt",
  "icpusdt",
  "icxusdt",
  "idexusdt",
  "idusdt",
  "ilvusdt",
  "imxusdt",
  "injusdt",
  "iostusdt",
  "iotausdt",
  "iotxusdt",
  "iousdt",
  "jasmyusdt",
  "joeusdt",
  "jtousdt",
  "jupusdt",
  "kasusdt",
  "kavausdt",
  "kdausdt",
  "keyusdt",
  "klayusdt",
  "kncusdt",
  "ksmusdt",
  "ldousdt",
  "leverusdt",
  "linausdt",
  "linkusdt",
  "listausdt",
  "litusdt",
  "lokausdt",
  "loomusdt",
  "lptusdt",
  "lqtyusdt",
  "lrcusdt",
  "lskusdt",
  "ltcusdt",
  "luna2usdt",
  "magicusdt",
  "manausdt",
  "mantausdt",
  "maskusdt",
  "maviausdt",
  "mavusdt",
  "mboxusdt",
  "mdtusdt",
  "memeusdt",
  "metisusdt",
  "mewusdt",
  "minausdt",
  "mkrusdt",
  "moodengusdt",
  "movrusdt",
  "mtlusdt",
  "myrousdt",
  "nearusdt",
  "neiroethusdt",
  "neirousdt",
  "neousdt",
  "nfpusdt",
  "nknusdt",
  "nmrusdt",
  "notusdt",
  "ntrnusdt",
  "nulsusdt",
  "oceanusdt",
  "ognusdt",
  "omgusdt",
  "omniusdt",
  "omusdt",
  "ondousdt",
  "oneusdt",
  "ongusdt",
  "ontusdt",
  "opusdt",
  "orbsusdt",
  "ordiusdt",
  "oxtusdt",
  "pendleusdt",
  "peopleusdt",
  "perpusdt",
  "phbusdt",
  "pixelusdt",
  "pnutusdt",
  "polusdt",
  "polyxusdt",
  "ponkeusdt",
  "popcatusdt",
  "portalusdt",
  "powrusdt",
  "pythusdt",
  "qntusdt",
  "qtumusdt",
  "quickusdt",
  "radusdt",
  "rareusdt",
  "rayusdt",
  "rdntusdt",
  "reefusdt",
  "reiusdt",
  "renderusdt",
  "renusdt",
  "rezusdt",
  "rifusdt",
  "rlcusdt",
  "roninusdt",
  "roseusdt",
  "rplusdt",
  "rsrusdt",
  "runeusdt",
  "rvnusdt",
  "safeusdt",
  "sagausdt",
  "sandusdt",
  "santosusdt",
  "scrusdt",
  "scusdt",
  "seiusdt",
  "sfpusdt",
  "sklusdt",
  "slpusdt",
  "sntusdt",
  "snxusdt",
  "solusdt",
  "spellusdt",
  "ssvusdt",
  "steemusdt",
  "stgusdt",
  "stmxusdt",
  "storjusdt",
  "stptusdt",
  "straxusdt",
  "strkusdt",
  "stxusdt",
  "suiusdt",
  "sunusdt",
  "superusdt",
  "sushiusdt",
  "swellusdt",
  "sxpusdt",
  "synusdt",
  "sysusdt",
  "taousdt",
  "thetausdt",
  "tiausdt",
  "tlmusdt",
  "tnsrusdt",
  "tokenusdt",
  "tonusdt",
  "trbusdt",
  "troyusdt",
  "truusdt",
  "trxusdt",
  "turbousdt",
  "tusdt",
  "twtusdt",
  "umausdt",
  "unfiusdt",
  "uniusdt",
  "usdcusdt",
  "ustcusdt",
  "uxlinkusdt",
  "vanryusdt",
  "vetusdt",
  "vidtusdt",
  "voxelusdt",
  "wavesusdt",
  "waxpusdt",
  "wifusdt",
  "wldusdt",
  "woousdt",
  "wusdt",
  "xaiusdt",
  "xemusdt",
  "xlmusdt",
  "xmrusdt",
  "xrpusdt",
  "xtzusdt",
  "xvgusdt",
  "xvsusdt",
  "yfiusdt",
  "yggusdt",
  "zecusdt",
  "zenusdt",
  "zetausdt",
  "zilusdt",
  "zkusdt",
  "zrousdt",
  "zrxusdt",
];

let ws;
let isWebSocketConnected = false;
let heartbeatInterval;
let resubscriptionInterval;

// Function to subscribe to pairs with a dynamic interval
const subscribeToPairs = (interval) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  const subscriptionMessage = {
    method: "SUBSCRIBE",
    params: pairs.map((pair) => `${pair}@kline_${interval}`),
    id: Date.now(),
  };

  ws.send(JSON.stringify(subscriptionMessage));
  console.log(`Subscribed to ${pairs.length} pairs with ${interval} interval`);
};

// Function to unsubscribe from all pairs
const unsubscribeFromPairs = (interval) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  const unsubscriptionMessage = {
    method: "UNSUBSCRIBE",
    params: pairs.map((pair) => `${pair}@kline_${interval}`),
    id: Date.now(),
  };

  ws.send(JSON.stringify(unsubscriptionMessage));
  console.log("Unsubscribed from all pairs");
};

// Calculate percentage change
const calculateChange = (open, close) => ((close - open) / open) * 100;

// Function to validate and process kline data
const processKlineData = (symbol, kline) => {
  const currentTime = Date.now();
  const candleEndTime = kline.T; // Kline close time
  const candleStartTime = kline.t; // Kline start time

  // Only process if it's the current candle
  if (currentTime >= candleStartTime && currentTime <= candleEndTime) {
    cache.set(symbol, {
      startTime: candleStartTime,
      endTime: candleEndTime,
      open: parseFloat(kline.o),
      close: parseFloat(kline.c),
      high: parseFloat(kline.h),
      low: parseFloat(kline.l),
      lastUpdate: currentTime,
    });
  }
};

// Setup WebSocket connection with heartbeat
const setupHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  heartbeatInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000); // Send ping every 30 seconds
};

// Setup periodic resubscription
const setupResubscription = (interval) => {
  if (resubscriptionInterval) {
    clearInterval(resubscriptionInterval);
  }

  resubscriptionInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      unsubscribeFromPairs(interval);
      setTimeout(() => subscribeToPairs(interval), 1000);
    }
  }, 3600000); // Resubscribe every hour
};

// WebSocket connection to Binance
const connectWebSocket = (interval) => {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(binanceWSUrl);

  ws.on("open", () => {
    console.log("WebSocket connected");
    isWebSocketConnected = true;
    subscribeToPairs(interval);
    setupHeartbeat();
    setupResubscription(interval);
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message?.k) {
        processKlineData(message.s, message.k);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("pong", () => {
    // Reset connection health check on pong received
    isWebSocketConnected = true;
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    isWebSocketConnected = false;
  });

  ws.on("close", () => {
    console.log("WebSocket closed, reconnecting...");
    isWebSocketConnected = false;
    clearInterval(heartbeatInterval);
    clearInterval(resubscriptionInterval);
    setTimeout(() => connectWebSocket(interval), 1000);
  });
};

// Cleanup old cache entries periodically
setInterval(() => {
  const currentTime = Date.now();
  const keys = cache.keys();

  keys.forEach((key) => {
    const data = cache.get(key);
    if (data && currentTime - data.lastUpdate > 300000) {
      // 5 minutes
      cache.del(key);
    }
  });
}, 60000); // Run cleanup every minute

// Express API route
app.get("/price-change", (req, res) => {
  const { direction, percentage, interval } = req.query;
  const targetChange = parseFloat(percentage);

  if (!direction || isNaN(targetChange) || !interval) {
    return res.status(400).json({
      error: "Missing required parameters",
      requiredParams: {
        direction: "up/down",
        percentage: "number",
        interval: "1m/3m/5m/15m/30m/1h/etc",
      },
    });
  }

  if (!isWebSocketConnected) {
    connectWebSocket(interval);
    // Wait for initial connection and data
    return setTimeout(() => {
      processRequest();
    }, 3000);
  } else {
    processRequest();
  }

  function processRequest() {
    const currentTime = Date.now();
    const result = Object.keys(cache.data)
      .filter((symbol) => {
        const data = cache.get(symbol);
        if (!data) return false;

        // Only include recent data (within last 5 minutes)
        if (currentTime - data.lastUpdate > 300000) return false;

        const change = calculateChange(data.open, data.close);
        return (
          (direction === "up" && change >= targetChange) ||
          (direction === "down" && change <= -targetChange)
        );
      })
      .map((symbol) => symbol);

    res.json(result);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
