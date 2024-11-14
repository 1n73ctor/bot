const axios = require('axios');

// Function to check price changes
const checkPriceChange = async (direction, percentage, interval) => {
    try {
        const response = await axios.get(`http://localhost:3000/price-change`, {
            params: { direction, percentage, interval }
        });
        console.log( response.data, "Going down");
    } catch (error) {
        console.error('Error fetching price change data:', error);
    }
};

// Set parameters for the request
const direction = 'down'; // Change to 'down','up' for downward price changes
const percentage = 1.5; // Percentage change to check
const interval = '30m'; // Time interval for the candlestick data

// Check data every 20 seconds
setInterval(() => {
    checkPriceChange(direction, percentage, interval);
}, 20000); // 20000 milliseconds = 20 seconds
