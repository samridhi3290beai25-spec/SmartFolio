// Mock Data & Local Storage Initialization
const initData = () => {
    if (!localStorage.getItem('investments')) {
        localStorage.setItem('investments', JSON.stringify([
            { id: 1, name: 'Bitcoin', type: 'crypto', quantity: 0.5, buyPrice: 40000, currentPrice: 65000 },
            { id: 2, name: 'Tesla', type: 'stock', quantity: 10, buyPrice: 150, currentPrice: 180 }
        ]));
    }
    if (!localStorage.getItem('businessEntries')) {
        localStorage.setItem('businessEntries', JSON.stringify([
            { id: 1, type: 'income', amount: 5000, category: 'Services', description: 'Web Dev Project', date: '2023-10-01' },
            { id: 2, type: 'expense', amount: 1500, category: 'Software', description: 'AWS Hosting', date: '2023-10-05' }
        ]));
    }
};

initData();

// Utility Functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getInvestments = () => JSON.parse(localStorage.getItem('investments')) || [];
const getBusinessEntries = () => JSON.parse(localStorage.getItem('businessEntries')) || [];

const calculatePortfolioValue = () => {
    const investments = getInvestments();
    return investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);
};

const calculateInvestmentPL = () => {
    const investments = getInvestments();
    return investments.reduce((acc, inv) => {
        const totalCost = inv.quantity * inv.buyPrice;
        const currentValue = inv.quantity * inv.currentPrice;
        return acc + (currentValue - totalCost);
    }, 0);
};

const calculateNetBusinessProfit = () => {
    const entries = getBusinessEntries();
    return entries.reduce((acc, entry) => {
        return entry.type === 'income' ? acc + entry.amount : acc - entry.amount;
    }, 0);
};

// Update Dashboard Cards
const updateDashboardCards = () => {
    const totalPortfolioEl = document.getElementById('total-portfolio-value');
    const totalPLEl = document.getElementById('total-pl');
    const netBusinessEl = document.getElementById('net-business-profit');
    const totalAssetsEl = document.getElementById('total-assets');

    if (totalPortfolioEl) totalPortfolioEl.innerText = formatCurrency(calculatePortfolioValue());
    
    if (totalPLEl) {
        const pl = calculateInvestmentPL();
        totalPLEl.innerText = formatCurrency(pl);
        totalPLEl.className = pl >= 0 ? 'text-green' : 'text-red';
    }
    
    if (netBusinessEl) {
        const netProfit = calculateNetBusinessProfit();
        netBusinessEl.innerText = formatCurrency(netProfit);
        netBusinessEl.className = netProfit >= 0 ? 'text-green' : 'text-red';
    }

    if (totalAssetsEl) {
        totalAssetsEl.innerText = getInvestments().length;
    }
};

// Update Recent Activity Table (Dashboard)
const updateRecentActivity = () => {
    const tableBody = document.querySelector('#recent-activity-table tbody');
    if (!tableBody) return;

    let allActivity = [];
    
    // Get Business Entries
    const business = getBusinessEntries();
    business.forEach(b => {
        allActivity.push({
            date: b.date,
            desc: b.description,
            type: b.type,
            amount: b.amount,
            isIncome: b.type === 'income',
            source: 'business'
        });
    });

    // Get Investments (just taking the creation date if we had one, but we'll mock today's date)
    const investments = getInvestments();
    investments.forEach(inv => {
        allActivity.push({
            date: new Date().toISOString().split('T')[0], // Mock date since we didn't store date
            desc: `Bought ${inv.name}`,
            type: inv.type,
            amount: inv.quantity * inv.buyPrice,
            isIncome: false,
            source: 'investment'
        });
    });

    // Sort by date descending
    allActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take top 5
    const recent = allActivity.slice(0, 5);
    
    tableBody.innerHTML = '';
    
    if (recent.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No recent activity</td></tr>';
        return;
    }

    recent.forEach(act => {
        const tr = document.createElement('tr');
        
        let amountStr = formatCurrency(act.amount);
        let amountClass = '';
        
        if (act.source === 'business') {
            amountClass = act.isIncome ? 'text-green' : 'text-red';
            amountStr = (act.isIncome ? '+' : '-') + amountStr;
        } else {
            amountClass = 'text-red'; // Buying an asset costs money initially
            amountStr = '-' + amountStr;
        }

        tr.innerHTML = `
            <td>${act.date}</td>
            <td><strong>${act.desc}</strong></td>
            <td style="text-transform: capitalize;">${act.type}</td>
            <td class="${amountClass}"><b>${amountStr}</b></td>
        `;
        tableBody.appendChild(tr);
    });
};

// Expose globally to init on dashboard load
window.updateRecentActivity = updateRecentActivity;

// Global Search Function (works across all pages)
window.handleSearch = function(e) {
    const query = e.target.value.toLowerCase();
    
    // Search within all table rows on the page
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        if (row.innerText.toLowerCase().includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    // Optional: Also filter informational cards if they exist
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.innerText.toLowerCase().includes(query)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
};

// Theme Toggle Functionality
window.toggleTheme = function() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
};

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
}

// Initialize Theme on Load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark theme if not set (or adapt based on body class initially)
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    updateThemeIcon();

    // Notifications clear logic
    const notifDropdown = document.getElementById('notif-dropdown');
    const badge = document.querySelector('button[onclick="toggleDropdown(\\\'notif-dropdown\\\')"] .badge');
    
    if (notifDropdown) {
        let hasRead = false;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    if (notifDropdown.style.display === 'block') {
                        // Just opened, hide badge
                        if (badge) badge.style.display = 'none';
                        hasRead = true;
                    } else if (notifDropdown.style.display === 'none' && hasRead) {
                        // Just closed, clear notifications
                        const header = notifDropdown.querySelector('h4');
                        notifDropdown.innerHTML = '';
                        if (header) {
                            notifDropdown.appendChild(header);
                        } else {
                            const newHeader = document.createElement('h4');
                            newHeader.style.cssText = 'margin-bottom: 10px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;';
                            newHeader.innerText = 'Notifications';
                            notifDropdown.appendChild(newHeader);
                        }
                        const emptyMsg = document.createElement('p');
                        emptyMsg.style.cssText = 'font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 15px; margin-bottom: 15px;';
                        emptyMsg.innerText = 'No new notifications';
                        notifDropdown.appendChild(emptyMsg);
                        hasRead = false;
                    }
                }
            });
        });
        observer.observe(notifDropdown, { attributes: true });
    }

    // Stock Refresh functionality (for latest-stock-price.html)
    const refreshBtn = document.getElementById('refresh-stock-btn');
    const tableBody = document.getElementById('stock-table-body');
    
    if (refreshBtn && tableBody) {
        refreshBtn.addEventListener('click', () => {
            // Flash a refresh animation
            refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh Data';
                
                const moreStocks = [
                    { symbol: 'NVDA', name: 'Nvidia Corp.', price: '$850.20', change: '+12.50', pct: '+1.49%', vol: '55.3M', isUp: true },
                    { symbol: 'META', name: 'Meta Platforms', price: '$485.10', change: '-2.10', pct: '-0.43%', vol: '21.0M', isUp: false },
                    { symbol: 'NFLX', name: 'Netflix Inc.', price: '$610.05', change: '+5.40', pct: '+0.89%', vol: '8.1M', isUp: true },
                    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: '$512.30', change: '+2.15', pct: '+0.42%', vol: '45.1M', isUp: true },
                    { symbol: 'JNJ', name: 'Johnson & Johnson', price: '$155.60', change: '-0.85', pct: '-0.54%', vol: '6.2M', isUp: false },
                    { symbol: 'V', name: 'Visa Inc.', price: '$275.40', change: '+1.10', pct: '+0.40%', vol: '4.8M', isUp: true },
                    { symbol: 'BTC-USD', name: 'Bitcoin', price: '$64200.00', change: '+1500.00', pct: '+2.39%', vol: '24.5B', isUp: true }
                ];
                
                moreStocks.forEach(stock => {
                    const row = document.createElement('tr');
                    // Parse numeric price for the trade function
                    const rawPrice = stock.price.replace('$', '').replace(',', '');
                    row.innerHTML = `
                        <td style="font-weight: bold; color: var(--accent-blue);">${stock.symbol}</td>
                        <td>${stock.name}</td>
                        <td style="font-weight: bold;">${stock.price}</td>
                        <td class="${stock.isUp ? 'text-green' : 'text-red'}">${stock.change}</td>
                        <td class="${stock.isUp ? 'text-green' : 'text-red'}">${stock.pct}</td>
                        <td>${stock.vol}</td>
                        <td><button class="btn btn-primary" onclick="openTradeDetails('${stock.symbol}', '${stock.name}', ${rawPrice})" style="padding: 5px 10px; font-size: 0.8rem;">Trade</button></td>
                    `;
                    tableBody.appendChild(row);
                });
            }, 1000);
        });
    }
});

// Redirect to detailed trade page
window.openTradeDetails = function(symbol, name, price) {
    const url = `trade-details.html?symbol=${encodeURIComponent(symbol)}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}`;
    window.location.href = url;
};


