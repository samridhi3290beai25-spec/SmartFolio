const fs = require('fs');
const path = require('path');

const directory = '.';
const htmlFiles = ['index.html', 'investments.html', 'business.html', 'analytics.html', 'latest-stock-price.html', 'pro-version.html', 'about.html'];

const newHeader = `<header class="top-navbar">
                <div class="search-bar" style="position:relative;">
                    <i class="fa-solid fa-search text-secondary" style="cursor:pointer;" onclick="document.getElementById('global-search').focus()"></i>
                    <input type="text" id="global-search" oninput="if(typeof handleSearch === 'function') handleSearch(event)" placeholder="Search assets, transactions...">
                    <div id="search-results-dropdown" class="search-results-dropdown"></div>
                </div>
                <div class="nav-icons" style="position: relative;">
                    <button class="icon-btn" onclick="toggleTheme()" id="theme-toggle-btn"><i class="fa-solid fa-moon"></i></button>
                    
                    <div class="dropdown-wrapper" style="position: relative; display: inline-block;">
                        <button class="icon-btn" onclick="toggleDropdown('notif-dropdown')"><i class="fa-regular fa-bell"></i><span class="badge" id="notif-badge">3</span></button>
                        <div id="notif-dropdown" class="nav-dropdown" style="display: none; position: absolute; top: 100%; right: -50px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; width: 250px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); z-index: 100; text-align: left; max-height: 300px; overflow-y: auto;">
                            <h4 style="margin-bottom: 10px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">Notifications</h4>
                            <div id="notif-list">
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">🚀 Bitcoin is up 5% today!</p>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">💰 Dividends received: $120.00</p>
                                <p style="font-size: 0.8rem; color: var(--text-secondary);">⚠️ Tesla stock dropped 2%.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dropdown-wrapper" style="position: relative; display: inline-block;">
                        <button class="icon-btn" onclick="toggleDropdown('msg-dropdown')"><i class="fa-regular fa-envelope"></i></button>
                        <div id="msg-dropdown" class="nav-dropdown" style="display: none; position: absolute; top: 100%; right: -20px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; width: 240px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); z-index: 100; text-align: left;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <img src="https://ui-avatars.com/api/?name=Creator&background=10B981&color=fff" style="width: 35px; border-radius: 50%;" alt="Creator">
                                <div>
                                    <h4 style="font-size: 0.9rem; margin: 0;">Developer</h4>
                                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">Creator & Maintainer</p>
                                </div>
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;"><i class="fa-solid fa-envelope"></i> developer@example.com</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fa-solid fa-phone"></i> +1 (555) 123-4567</div>
                        </div>
                    </div>

                    <div class="dropdown-wrapper user-profile" style="position: relative; display: inline-block; margin-left: 10px;">
                        <img id="user-avatar" src="https://ui-avatars.com/api/?name=User&background=2563EB&color=fff" alt="User" onclick="toggleDropdown('profile-dropdown')" style="cursor: pointer;">
                        <div id="profile-dropdown" class="nav-dropdown" style="display: none; position: absolute; top: 100%; right: 0; background: var(--bg-card); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; width: 200px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); z-index: 100; text-align: left;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                                <div>
                                    <h4 id="profile-name" style="font-size: 0.9rem; margin: 0;">User Name</h4>
                                    <p id="profile-email" style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">user@example.com</p>
                                </div>
                            </div>
                            <a href="#" onclick="handleLogout()" style="color: var(--loss-red); text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 0.9rem;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        </div>
                    </div>
                </div>
            </header>`;

// 1. Update HTML files
htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const headerRegex = /<header class="top-navbar">[\s\S]*?<\/header>/;
    
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, newHeader);
    }
    
    // Add id to refresh button in latest-stock-price.html
    if (file === 'latest-stock-price.html') {
        content = content.replace(
            /<button class="btn btn-primary" style="padding: 8px 15px; font-size: 0.9em;"><i class="fa-solid fa-rotate-right"><\/i> Refresh Data<\/button>/,
            `<button id="refresh-stock-btn" class="btn btn-primary" style="padding: 8px 15px; font-size: 0.9em;"><i class="fa-solid fa-rotate-right"></i> Refresh Data</button>`
        );
        content = content.replace(
            /<tbody>/,
            `<tbody id="stock-table-body">`
        );
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated HTML: ", file);
});

// 2. Update CSS (style-addons.css)
const cssPath = path.join('css', 'style-addons.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const themeStyles = `
/* Theme Styles & Additional Features */
body.dark-theme {
    --bg-dark: #0f172a;
    --bg-card: #1e293b;
    --bg-sidebar: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --border-color: #334155;
}

body:not(.dark-theme) {
    --bg-dark: #f8fafc;
    --bg-card: #ffffff;
    --bg-sidebar: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
}

body.dark-theme tbody tr:hover {
    background-color: #334155;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 350px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    z-index: 200;
    max-height: 300px;
    overflow-y: auto;
    display: none;
    margin-top: 10px;
}

.search-result-item {
    padding: 10px 15px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    color: var(--text-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-result-item:hover {
    background-color: var(--bg-dark);
}

.search-result-item:last-child {
    border-bottom: none;
}
`;

if (!cssContent.includes('/* Theme Styles & Additional Features */')) {
    fs.writeFileSync(cssPath, cssContent + themeStyles, 'utf8');
    console.log('Updated CSS: ', cssPath);
}

// 3. Update app.js
const appJsPath = path.join('js', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

const newAppJsLogic = `
// ==================== NEW FEATURES ==================== //

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
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    updateThemeIcon();
    
    // Setup Profile Dropdown
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.name) {
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        if (nameEl) nameEl.innerText = currentUser.name;
        if (emailEl) emailEl.innerText = currentUser.email || 'user@example.com';
    }
});

// Active Notifications System
let notifCount = 3;
setInterval(() => {
    const notifList = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    if (!notifList || !badge) return;
    
    const mockEvents = [
        '🚀 Ethereum just surged by 4%!',
        '💰 New dividend paid: $50.00',
        '⚠️ Market volatility warning on Tech stocks.',
        '📈 Portfolio reached a new all-time high!'
    ];
    
    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    const p = document.createElement('p');
    p.style.cssText = 'font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px; animation: fadeIn 0.5s;';
    p.innerText = randomEvent;
    
    notifList.prepend(p);
    notifCount++;
    badge.innerText = notifCount;
}, 30000); // Add a new notification every 30 seconds

// Enhanced Global Search
window.handleSearch = function(e) {
    const query = e.target.value.toLowerCase();
    const dropdown = document.getElementById('search-results-dropdown');
    
    if (!query) {
        dropdown.style.display = 'none';
        return;
    }
    
    dropdown.style.display = 'block';
    dropdown.innerHTML = '';
    
    let results = [];
    
    // Search Investments
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    investments.forEach(inv => {
        if (inv.name.toLowerCase().includes(query) || inv.type.toLowerCase().includes(query)) {
            results.push({ name: inv.name, type: 'Investment', desc: \`\${inv.quantity} shares at $\${inv.currentPrice}\` });
        }
    });
    
    // Search Business Entries
    const business = JSON.parse(localStorage.getItem('businessEntries')) || [];
    business.forEach(b => {
        if (b.description.toLowerCase().includes(query) || b.category.toLowerCase().includes(query)) {
            results.push({ name: b.description, type: b.type === 'income' ? 'Business Income' : 'Business Expense', desc: \`$\${b.amount} - \${b.category}\` });
        }
    });
    
    if (results.length === 0) {
        dropdown.innerHTML = '<div style="padding: 10px; color: var(--text-secondary);">No results found</div>';
        return;
    }
    
    results.forEach(res => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = \`
            <div>
                <strong>\${res.name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">\${res.type}</div>
            </div>
            <div style="font-size: 0.85rem;">\${res.desc}</div>
        \`;
        dropdown.appendChild(item);
    });
};

// Stock Refresh functionality (for latest-stock-price.html)
document.addEventListener('DOMContentLoaded', () => {
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
                    { symbol: 'NFLX', name: 'Netflix Inc.', price: '$610.05', change: '+5.40', pct: '+0.89%', vol: '8.1M', isUp: true }
                ];
                
                moreStocks.forEach(stock => {
                    const row = document.createElement('tr');
                    row.innerHTML = \`
                        <td style="font-weight: bold; color: var(--accent-blue);">\${stock.symbol}</td>
                        <td>\${stock.name}</td>
                        <td style="font-weight: bold;">\${stock.price}</td>
                        <td class="\${stock.isUp ? 'text-green' : 'text-red'}">\${stock.change}</td>
                        <td class="\${stock.isUp ? 'text-green' : 'text-red'}">\${stock.pct}</td>
                        <td>\${stock.vol}</td>
                        <td><button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">Trade</button></td>
                    \`;
                    tableBody.appendChild(row);
                });
            }, 1000);
        });
    }
});
`;

// Only add if not already added
if (!appJsContent.includes('window.toggleTheme = function()')) {
    // Replace the old global search handler in app.js
    const oldSearchRegex = /window\.handleSearch = function\(e\) \{[\s\S]*?\};/;
    if (oldSearchRegex.test(appJsContent)) {
        appJsContent = appJsContent.replace(oldSearchRegex, '');
    }
    
    fs.writeFileSync(appJsPath, appJsContent + '\n' + newAppJsLogic, 'utf8');
    console.log('Updated JS: ', appJsPath);
}

console.log("All features applied successfully!");
