// frontend/js/requests.js
async function loadRequests() {
    try {
        const response = await fetch(`/api/requests/${userId}`);
        const requests = await response.json();
        
        const list = document.getElementById('requestsList');
        
        if (requests.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted);">No incoming requests yet.</p>';
            return;
        }

        list.innerHTML = requests.map(r => `
    <div style="padding: 12px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <div>
            <strong>${r.sender_name}</strong> wants to swap for 
            <span style="color: var(--primary-color); font-weight: 600;">${r.skill_name}</span>
        </div>
        <div>
            ${r.status === 'pending' ? `
                <button onclick="updateRequest(${r.id}, 'accepted')" style="background: #22c55e; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Accept</button>
                <button onclick="updateRequest(${r.id}, 'rejected')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Reject</button>
            ` : `
                <span style="font-weight: 600; color: ${r.status === 'accepted' ? '#22c55e' : '#ef4444'}; text-transform: uppercase;">${r.status}</span>
            `}
        </div>
    </div>
`).join('');
    } catch (err) {
        console.error('Error loading requests:', err);
    }
}
async function updateRequest(requestId, status) {
    try {
        const response = await fetch('/api/requests/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, status })
        });
        const data = await response.json();
        alert(data.message);
        loadRequests(); // Refresh the list
    } catch (err) {
        console.error('Error updating status:', err);
    }
}

loadRequests();