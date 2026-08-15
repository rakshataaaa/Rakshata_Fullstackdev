// frontend/js/dashboard.js

// 1. Check if user is logged in by looking for userId in localStorage
const userId = localStorage.getItem('userId');
if (!userId) {
    alert('Please log in first!');
    window.location.href = '/login';
}

// 2. Handle adding "Teach" skills
const teachForm = document.getElementById('teachForm');
teachForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const skillName = document.getElementById('teachSkill').value;

    try {
        const response = await fetch('/api/skills/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, skillName, type: 'teach' })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            document.getElementById('teachSkill').value = ''; // Clear input
            loadSkills(); // Refresh the list
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

// 3. Handle adding "Learn" skills
const learnForm = document.getElementById('learnForm');
learnForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const skillName = document.getElementById('learnSkill').value;

    try {
        const response = await fetch('/api/skills/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, skillName, type: 'learn' })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            document.getElementById('learnSkill').value = ''; // Clear input
            loadSkills(); // Refresh the list
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

// 4. Function to load and display skills (We will build the GET route for this next, or you can add it now)
async function loadSkills() {
    try {
        const response = await fetch(`/api/skills/${userId}`);
        const skills = await response.json();

        const teachList = document.getElementById('teachList');
        const learnList = document.getElementById('learnList');
        
        teachList.innerHTML = '';
        learnList.innerHTML = '';

        skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill.skill_name;
            if (skill.type === 'teach') {
                teachList.appendChild(li);
            } else {
                learnList.appendChild(li);
            }
        });
    } catch (err) {
        console.error('Error loading skills:', err);
    }
}

// Load skills when the page opens
loadSkills();

// 5. Handle Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('userId');
    window.location.href = '/login';
});
async function loadUserSkills() {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`/api/skills/${userId}`);
    const skills = response.json();

    // Render lists with delete options attached
    // Example for rendering skill items dynamically:
    /*
    skillElement.innerHTML = `
        <span>${skill.skill_name} (${skill.skill_type})</span>
        <button onclick="deleteSkill(${skill.id})" style="background: red; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
    `;
    */
}

async function deleteSkill(skillId) {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    const response = await fetch(`/api/skills/${skillId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        location.reload(); // Refresh dashboard to update lists
    } else {
        alert('Failed to delete skill.');
    }
}