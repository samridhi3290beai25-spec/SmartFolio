const fs = require('fs');
const path = require('path');

const directory = '.';
const filesToUpdate = ['investments.html', 'business.html', 'analytics.html', 'latest-stock-price.html', 'pro-version.html', 'about.html'];

const authGuardStr = `    <!-- Auth Guard -->
    <script src="js/auth-guard.js"></script>
    <link rel="stylesheet" href="css/style.css">`;

const newHeader = `<header class="top-navbar">
                <div class="search-bar">
                    <i class="fa-solid fa-search text-secondary" style="cursor:pointer;" onclick="document.getElementById('global-search').focus()"></i>
                    <input type="text" id="global-search" oninput="if(typeof handleSearch === 'function') handleSearch(event)" placeholder="Search assets, transactions...">
                </div>
                <div class="nav-icons" style="position: relative;">
                    <div class="dropdown-wrapper" style="position: relative; display: inline-block;">
                        <button class="icon-btn" onclick="toggleDropdown('notif-dropdown')"><i class="fa-regular fa-bell"></i><span class="badge">3</span></button>
                        <div id="notif-dropdown" class="nav-dropdown" style="display: none; position: absolute; top: 100%; right: -50px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; width: 250px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); z-index: 100; text-align: left;">
                            <h4 style="margin-bottom: 10px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">Notifications</h4>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">🚀 Bitcoin is up 5% today!</p>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">💰 Dividends received: $120.00</p>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);">⚠️ Tesla stock dropped 2%.</p>
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

                    <div class="user-profile" style="margin-left: 10px;">
                        <img id="user-avatar" src="https://ui-avatars.com/api/?name=User&background=2563EB&color=fff" alt="User">
                    </div>
                </div>
            </header>`;

const scriptAddons = `    <script src="js/auth.js"></script>
    <script src="js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.name) {
                const avatarEl = document.getElementById('user-avatar');
                if (avatarEl) {
                    avatarEl.src = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(currentUser.name)}&background=2563EB&color=fff\`;
                }
            }
        });

        function toggleDropdown(id) {
            document.querySelectorAll('.nav-dropdown').forEach(d => {
                if (d.id !== id) d.style.display = 'none';
            });
            const el = document.getElementById(id);
            if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
        }

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-icons')) {
                document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
            }
        });
    </script>`;

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add Auth Guard to Head
    content = content.replace(/<link rel="stylesheet" href="css\/style.css">/, authGuardStr);

    // 2. Add Logout button to sidebar
    if (!content.includes('fa-right-from-bracket')) {
        content = content.replace(/<li><a href="about.html"><i class="fa-solid fa-users"><\/i> Team & About<\/a><\/li>\s*<\/ul>/, 
        `<li><a href="about.html"><i class="fa-solid fa-users"></i> Team & About</a></li>
                <li><a href="#" onclick="handleLogout()" style="color: var(--loss-red);"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
            </ul>`);
    }

    // 3. Replace navbar
    const headerRegex = /<header class="top-navbar">[\s\S]*?<\/header>/;
    content = content.replace(headerRegex, newHeader);

    // 4. Inject scripts
    // Notice that we replace <script src="js/app.js"></script> with our block.
    // Ensure we don't duplicate logic.
    if (!content.includes('auth.js')) {
        content = content.replace(/<script src="js\/app.js"><\/script>/, scriptAddons);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated", file);
});

// Also update index.html to ensure search icon is clickable, without overwriting existing stuff
let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(
    /<i class="fa-solid fa-search text-secondary"><\/i>/,
    `<i class="fa-solid fa-search text-secondary" style="cursor:pointer;" onclick="document.getElementById('global-search').focus()"></i>`
);
fs.writeFileSync('index.html', indexContent, 'utf8');

console.log("Done");
