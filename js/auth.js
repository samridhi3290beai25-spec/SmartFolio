// UI Toggle Logic for Login / Register
function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');
    const toggleBtns = document.querySelector('.toggle-btns');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const slider = document.getElementById('toggle-slider');
    const errorBox = document.getElementById('error-box');
    
    errorBox.style.display = 'none';
    errorBox.style.background = ''; // reset styles just in case
    errorBox.style.color = '';

    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    if(forgotForm) forgotForm.classList.remove('active');

    if (formType === 'login') {
        loginForm.classList.add('active');
        btnLogin.classList.add('active');
        btnRegister.classList.remove('active');
        slider.style.transform = 'translateX(0)';
        if(toggleBtns) toggleBtns.style.display = 'flex';
    } else if (formType === 'register') {
        registerForm.classList.add('active');
        btnLogin.classList.remove('active');
        btnRegister.classList.add('active');
        // Calculate translateX for exact half distance
        // The slider's width logic handles sizes, this just moves it.
        slider.style.transform = 'translateX(100%)';
        if(toggleBtns) toggleBtns.style.display = 'flex';
    } else if (formType === 'forgot') {
        if(forgotForm) forgotForm.classList.add('active');
        if(toggleBtns) toggleBtns.style.display = 'none';
    }
}

// Show error messages
function showError(msg) {
    const errorBox = document.getElementById('error-box');
    errorBox.innerText = msg;
    errorBox.style.display = 'block';
}

// Mock User DB (LocalStorage)
// Structure: [ { name: '...', username: '...', password: '...' }, ... ]
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;

    const users = getUsers();
    
    // Check if user exists
    if (users.find(u => u.username === username)) {
        showError("Username/Email already exists. Please login.");
        return;
    }

    const newUser = { name, username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'index.html';
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        showError("Invalid username or password.");
    }
}

function handleForgot(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    
    const users = getUsers();
    const user = users.find(u => u.username === email);

    const errorBox = document.getElementById('error-box');
    if (user) {
        showError("Password reset link sent to " + email);
        errorBox.style.background = 'rgba(16, 185, 129, 0.1)';
        errorBox.style.color = '#10b981';
        
        setTimeout(() => {
            errorBox.style.background = '';
            errorBox.style.color = '';
            switchForm('login');
        }, 3000);
    } else {
        showError("Email not found.");
    }
}

// Logout function (to be called from Dashboard pages)
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Expose logout globally for inline onclick
window.handleLogout = handleLogout;
