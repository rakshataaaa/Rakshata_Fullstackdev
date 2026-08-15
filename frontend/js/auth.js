// --- Registration Code ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Registration failed');
                return;
            }

            alert(data.message);
            window.location.href = '/login'; // Redirect to login on success
        } catch (err) {
            console.error('Error:', err);
        }
    });
}

// --- Login Code ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Login failed');
                return;
            }

            alert(data.message);
            localStorage.setItem('userId', data.userId);
            window.location.href = '/home'; // Redirect to the new community feed home page
        } catch (err) {
            console.error('Error:', err);
        }
    });
}

// --- Toggle Password Visibility ---
function togglePassword() {
    const pwd = document.getElementById('password');
    if (pwd) {
        pwd.type = pwd.type === 'password' ? 'text' : 'password';
    }
}