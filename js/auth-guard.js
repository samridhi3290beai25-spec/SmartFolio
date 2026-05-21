(function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    // Check if we are currently on the login page
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!currentUser && !isLoginPage) {
        // Redirect to login page if no user is found and we are not already on login page
        window.location.href = 'login.html';
    } else if (currentUser && isLoginPage) {
        // Redirect to dashboard if user is already logged in and tries to access login page
        window.location.href = 'index.html';
    }
})();
