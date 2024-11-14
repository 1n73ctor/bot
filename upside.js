const axios = require('axios');

// Function to check price changes
const checkPriceChange = async (direction, percentage, interval) => {
    try {
        const response = await axios.get(`http://localhost:3000/price-change`, {
            params: { direction, percentage, interval }
        });
        const coins = response.data
        console.log( coins , "Going up" , coins.length);
    } catch (error) {
        console.error('Error fetching price change data:', error);
    }
};

// Set parameters for the request
const direction = 'up'; // Change to 'down','up' for downward price changes
const percentage = 1.5; // Percentage change to check
const interval = '30m'; // Time interval for the candlestick data 15m,30m,1h,4h,1D

// Check data every 20 seconds
setInterval(() => {
    checkPriceChange(direction, percentage, interval);
}, 10000); // 20000 milliseconds = 20 seconds
