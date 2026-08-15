const db = require('../config/database');

exports.addSkill = async (req, res) => {
    try {
        const { userId, skill_name, skill_type } = req.body;
        console.log("Incoming skill data:", { userId, skill_name, skill_type }); // <--- See if this prints

        await db.execute(
            'INSERT INTO skills (user_id, skill_name, skill_type) VALUES (?, ?, ?)',
            [userId, skill_name, skill_type]
        );
        res.status(201).json({ message: 'Skill added successfully' });
    } catch (err) {
        console.error("CRITICAL DATABASE ERROR IN addSkill:", err); // <--- Forces printing the exact SQL crash
        res.status(500).json({ error: err.message });
    }
};

exports.getSkills = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM skills WHERE user_id = ?', [req.params.userId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const { skill_name, skill_type } = req.body;
        await db.execute('UPDATE skills SET skill_name = ?, skill_type = ? WHERE id = ?', [skill_name, skill_type, req.params.id]);
        res.status(200).json({ message: 'Skill updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        await db.execute('DELETE FROM skills WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};