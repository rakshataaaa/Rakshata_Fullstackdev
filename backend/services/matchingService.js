// backend/services/matchingService.js
const db = require('../config/database');

exports.findMatches = async (userId) => {
    // 1. Find the skills the current user wants to LEARN
    const [learnSkills] = await db.execute(
        'SELECT skill_name FROM skills WHERE user_id = ? AND type = "learn"', 
        [userId]
    );

    if (learnSkills.length === 0) return [];

    // 2. Find other users who TEACH those skills
    const skillNames = learnSkills.map(s => s.skill_name);
    
    // We use a placeholder (?) for each skill name
    const placeholders = skillNames.map(() => '?').join(',');
    const sql = `
        SELECT u.id AS id, u.name, u.email, s.skill_name 
        FROM users u 
        JOIN skills s ON u.id = s.user_id 
        WHERE s.type = "teach" 
        AND s.skill_name IN (${placeholders})
        AND u.id != ?
    `;

    const [matches] = await db.execute(sql, [...skillNames, userId]);
    return matches;
};