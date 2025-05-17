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
    return parseFloat(amount).toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    });
}

// Convert array of transactions to table rows
function generateTransactionRows(transactions) {
    return transactions.map(t => `
        <tr>
            <td>${t.Date || '-'}</td>
            <td>${t.Description || '-'}</td>
            <td>${formatCurrency(t.Amount)}</td>
            <td>${t.Category || 'Uncategorized'}</td>
        </tr>`);
}

// Display chart using Chart.js
function renderSpendingChart(data) {
    // Clear existing chart if any
    const container = document.getElementById('spendingChart');
    container.innerHTML = '';

    // Create container for both charts
    const chartContainer = document.createElement('div');
    chartContainer.style.display = 'flex';
    chartContainer.style.justifyContent = 'space-around';
    
    // Create pie chart container
    const pieContainer = document.createElement('div');
    pieContainer.style.flex = '0 0 45%';
    const pieCanvas = document.createElement('canvas');
    pieCanvas.id = 'spendingPieChart';
    pieContainer.appendChild(pieCanvas);
    
    // Create histogram container
    const histContainer = document.createElement('div');
    histContainer.style.flex = '0 0 45%';
    const histCanvas = document.createElement('canvas');
    histCanvas.id = 'spendingHistogram';
    histContainer.appendChild(histCanvas);
    
    // Add both charts to the container
    chartContainer.appendChild(pieContainer);
    chartContainer.appendChild(histContainer);
    
    // Add container to the page
    container.appendChild(chartContainer);
    
    // Calculate categories and amounts
    const categories = {};
    data.forEach(t => {
        const cat = t.Category || 'Uncategorized';
        const amt = parseFloat(t.Amount);
        if (!categories[cat]) categories[cat] = 0;
        categories[cat] += amt;
    });
    
    // Create pie chart
    new Chart(pieCanvas, {
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
    
    // Create histogram
    new Chart(histCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Spending Amount ($)',
                data: Object.values(categories),
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                }
            }
        }
    });
}