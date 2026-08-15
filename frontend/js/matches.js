// frontend/js/matches.js

async function loadMatches() {
    const response = await fetch(`/api/matches/${userId}`);
    const matches = await response.json();

    const list = document.getElementById('matchesList');
    // Update your button inside matches.js to include a click event:
    list.innerHTML = matches.map(m => `
    <div style="padding: 12px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <div>
            <strong>${m.name}</strong> teaches <span style="color: var(--primary-color); font-weight: 600;">${m.skill_name}</span>
        </div>
        <button onclick="sendRequest(${m.id}, '${m.skill_name}')" style="padding: 6px 12px; background-color: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">Connect</button>
    </div>
`).join('');
}
async function sendRequest(receiverId, skillName) {
    try {
        const response = await fetch('/api/requests/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderId: userId, receiverId, skillName })
        });
        const data = await response.json();
        alert(data.message);
    } catch (err) {
        console.error('Error sending request:', err);
    }
}

loadMatches();