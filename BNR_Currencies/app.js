
 

// Import the necessary modules
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

// Create an Express server
const app = express();
app.use(express.json());

// Array to store configured currencies
let configuredCurrencies = [];

app.get('/', (req, res) => {
    res.redirect('/exchange-rates');
});

// Exchange rates endpoint - GET request
app.get('/exchange-rates', async (req, res) => {
    const { date } = req.query;

    try {
        // Make a GET request to the BNR API with the specified date
        const response = await axios.get('https://www.bnr.ro/nbrfxrates.xml', {
            params: { date },
        });

        // Parse the XML response into JSON
        const xml = response.data;
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xml);
        const currencyData = result;

        res.json(currencyData);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
});

// Exchange rates endpoint - POST request
app.post('/exchange-rates', async (req, res) => {
    const { date } = req.body;

    try {
        // Make a POST request to the BNR API with the specified date
        const response = await axios.post('https://www.bnr.ro/nbrfxrates.xml', null, {
            params: { date },
        });

        // Parse the XML response into JSON
        const xml = response.data;
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xml);
        const currencyData = result;

        res.json(currencyData);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
});

// Configure currency endpoint - POST request
app.post('/configure-currency', (req, res) => {
    const { currency } = req.body;

    if (!currency) {
        res.status(400).json({ error: 'Currency parameter is required' });
        return;
    }

    // Add the configured currency to the array
    configuredCurrencies.push(currency);

    res.json({ message: 'Currency configured successfully' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
