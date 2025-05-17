// Main Application Logic

$(document).ready(function () {
    let transactions = [];

    // Handle file upload
    $('#uploadBtn').on('click', function () {
        const fileInput = $('#transactionFile')[0];
        if (!fileInput.files.length) {
            alert('Please select a file');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const csvText = e.target.result;
            transactions = parseCSV(csvText);
            transactions = categorizeTransactions(transactions);
            updateTransactionTable(transactions);
            renderSpendingChart(transactions);
        };

        reader.readAsText(file);
    });

    // Update transaction table
    function updateTransactionTable(transactions) {
        const rows = generateTransactionRows(transactions);
        $('#transactionsTable tbody').html(rows.join(''));
    }

    function generateTransactionRows(transactions) {
        return transactions.map(t => {
            return `
                <tr>
                    <td>${t.Date}</td>
                    <td>${t.Description}</td>
                    <td>${formatCurrency(t.Amount)}</td>
                    <td>${t.Category}</td>
                </tr>
            `;
        });
    }

    // Handle category change
    $(document).on('change', '.category-select', function () {
        const selectedCategory = $(this).val();
        const row = $(this).closest('tr');
        row.find('td:eq(3)').text(selectedCategory);
    });

    // Handle budget form submission
    $('#budgetForm').on('submit', function (e) {
        e.preventDefault();
        const category = $('#categorySelect').val();
        const budget = parseFloat($('#budgetAmount').val());
        const totalSpent = transactions
            .filter(t => t.Category === category)
            .reduce((sum, t) => sum + parseFloat(t.Amount), 0);

        const statusEl = $('#budgetStatus');
        if (totalSpent > budget) {
            statusEl.text(`You have overspent ${formatCurrency(totalSpent - budget)} in ${category}!`).css('color', 'red');
        } else {
            statusEl.text(`You are within budget for ${category}. Remaining: ${formatCurrency(budget - totalSpent)}`).css('color', 'green');
        }
    });
});