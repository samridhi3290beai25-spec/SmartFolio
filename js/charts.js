// Shared chart instances
let pieChartInstance = null;
let barChartInstance = null;

const initDashboardCharts = () => {
    const pieCtx = document.getElementById('quickPieChart');
    const barCtx = document.getElementById('quickBarChart');

    if (pieCtx && barCtx) {
        // Pie Chart Data (Crypto vs Stocks)
        const investments = JSON.parse(localStorage.getItem('investments')) || [];
        let cryptoValue = 0;
        let stockValue = 0;

        investments.forEach(inv => {
            const value = inv.quantity * inv.currentPrice;
            if (inv.type === 'crypto') cryptoValue += value;
            else stockValue += value;
        });

        pieChartInstance = new Chart(pieCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Crypto', 'Stocks'],
                datasets: [{
                    data: [cryptoValue, stockValue],
                    backgroundColor: ['#f59e0b', '#3b82f6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#64748b' }
                    }
                }
            }
        });

        // Bar Chart Data (Income vs Expense)
        const entries = JSON.parse(localStorage.getItem('businessEntries')) || [];
        let totalIncome = 0;
        let totalExpense = 0;

        entries.forEach(e => {
            if (e.type === 'income') totalIncome += Number(e.amount);
            else totalExpense += Number(e.amount);
        });

        barChartInstance = new Chart(barCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    label: 'Amount ($)',
                    data: [totalIncome, totalExpense],
                    backgroundColor: ['#059669', '#dc2626'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#e2e8f0' },
                        ticks: { color: '#64748b' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64748b' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
};
