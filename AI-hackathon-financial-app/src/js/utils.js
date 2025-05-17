// Utility Functions

// Parse CSV content into an array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
    });
    return data;
}

// Format amount as currency
function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Convert array of transactions to table rows
function generateTransactionRows(transactions) {
    return transactions.map(t => `
        <tr>
            <td>${t.Date || '-'}</td>
            <td>${t.Description || '-'}</td>
            <td>${formatCurrency(t.Amount)}</td>
            <td>${t.Category || 'Uncategorized'}</td>
            <td>
                <select class="category-select" data-id="${t.id || ''}">
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                </select>
            </td>
        </tr>`);
}

// Display chart using Chart.js
function renderSpendingChart(data) {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    const categories = {};
    data.forEach(t => {
        const cat = t.Category || 'Uncategorized';
        const amt = parseFloat(t.Amount);
        if (!categories[cat]) categories[cat] = 0;
        categories[cat] += amt;
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Spending Breakdown',
                data: Object.values(categories),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                ]
            }]
        }
    });
}