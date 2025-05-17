// Rule-Based Transaction Categorizer

// Category rules based on description keywords
const categoryRules = {
    "Food": ["Starbucks", "McDonalds", "Grocery", "Walmart", "Target", "Restaurant", "Dinner", "Lunch", "Breakfast", "Cafe", "Bistro", "Grill", "Eats"],
    "Transport": ["Uber", "Lyft", "Gas", "Toll", "Parking", "Taxi", "Bus", "Train", "Flight", "Car Rental"],
    "Utilities": ["Electricity", "Water", "Gas Bill", "Internet", "Phone Bill", "Electric", "Utility"],
    "Entertainment": ["Netflix", "Spotify", "Movie", "Concert", "Game", "Theater", "Show", "Streaming", "Subscription"]
};

// Default category for unmatched transactions
const DEFAULT_CATEGORY = "Other";

// Categorize a single transaction based on description
function categorizeTransaction(transaction) {
    const description = (transaction.Description || '').toLowerCase();

    for (let [category, keywords] of Object.entries(categoryRules)) {
        if (keywords.some(k => description.includes(k.toLowerCase()))) {
            return category;
        }
    }

    return DEFAULT_CATEGORY;
}

// Apply categorization to an array of transactions
function categorizeTransactions(transactions) {
    return transactions.map(t => ({
        ...t,
        Category: categorizeTransaction(t)
    }));
}