async function loadNavbarUser() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        const res = await fetch(`/api/users/${userId}`);
        const user = await res.json();
        document.getElementById('userNameDisplay').textContent = `Hi, ${user.name}`;
    }
}
loadNavbarUser();

if (localStorage.getItem('userId') && window.location.pathname === '/') {
    window.location.href = '/dashboard';
}