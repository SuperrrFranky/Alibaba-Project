// server.js (Node.js + Express)
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// API Configuration - for using QWEN Turbo from alibaba cloud
const API_CONFIG = {
  url: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  key: "sk-b278e0a149c041f7ad97729a5150a00b",
  headers: {
    'Authorization': 'Bearer ${API_CONFIG.key}',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Function to make API calls with error handling
async function callApi(endpoint, method = 'GET', body = null) {
  try {
    const response = await fetch(`${API_CONFIG.url}/${endpoint}`, {
      method,
      headers: API_CONFIG.headers,
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

app.use(express.json());

app.post('/categorize', async (req, res) => {
    console.log("Received transactions:", req.body);

    const transactions = req.body.transactions;

    if (!transactions || !Array.isArray(transactions)) {
        console.error("❌ Invalid or missing transactions array");
        return res.status(400).json({ error: "Invalid transaction input." });
    }

    try {
        const categorized = await Promise.all(transactions.map(async (t) => {
            if (!t.Description) {
                return { ...t, Category: "other" };
            }

            const prompt = `Classify the following financial transaction: '${t.Description}'. Categories are: grocery, restaurant, transportation, utility, entertainment, medical, other. Respond with only the category name.`;

            try {
                const response = await axios.post(API_CONFIG.url, {
                    model: "qwen-turbo",
                    input: { prompt }
                }, {
                    headers: {
                        "Authorization": `Bearer ${API_CONFIG.key}`,
                        "Content-Type": "application/json"
                    }
                });

                let category = "other";
                const text = response.data?.output?.text?.trim().toLowerCase();
                if (["grocery", "restaurant", "transportation", "utility", "entertainment", "medical", "other"].includes(text)) {
                    category = text;
                }

                return { ...t, Category: category };
            } catch (apiErr) {
                console.error('API call failed for:', t.Description, apiErr.message);
                return { ...t, Category: "other" };
            }
        }));

        res.json({ transactions: categorized }); // ✅ Send back valid JSON
    } catch (err) {
        console.error('Server error during categorization:', err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
