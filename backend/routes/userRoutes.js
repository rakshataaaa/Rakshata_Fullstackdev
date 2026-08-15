// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const db = require('../config/database');

router.post('/register', userController.register);
router.post('/login', userController.login); 
router.get('/profile/:id', userController.getUserProfile);

// Community Feed Routes (Moved here so 'db' is defined)
router.get('/posts', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM posts ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (err) {
        console.error("Database Error in GET /posts:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/posts', async (req, res) => {
    try {
        const { userId, userName, content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }
        
        await db.execute(
            'INSERT INTO posts (user_id, user_name, content) VALUES (?, ?, ?)',
            [userId, userName, content]
        );
        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
        console.error("Database Error in POST /posts:", err);
        res.status(500).json({ error: err.message });
    }
});


// Edit a post
router.put('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { content, userId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }

        const [posts] = await db.execute('SELECT * FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (posts[0].user_id != userId) {
            return res.status(403).json({ error: 'Unauthorized to edit this post' });
        }

        await db.execute('UPDATE posts SET content = ? WHERE id = ?', [content, postId]);
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        console.error("Database Error in PUT /posts/:id:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a post
router.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body;

        const [posts] = await db.execute('SELECT * FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (posts[0].user_id != userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        await db.execute('DELETE FROM posts WHERE id = ?', [postId]);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error("Database Error in DELETE /posts/:id:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get skill matches for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find peers teaching what this user wants to learn (excluding themselves)
        const query = `
            T1.id AS peer_id, 
            T1.name AS peer_name, 
            S2.skill_name AS matched_skill
        FROM users T1
        JOIN skills S2 ON T1.id = S2.user_id
        JOIN skills S1 ON S1.skill_name = S2.skill_name
        WHERE S1.user_id = ? 
          AND S1.skill_type = 'learn' 
          AND S2.skill_type = 'teach' 
          AND T1.id != ?
        GROUP BY T1.id, S2.skill_name;
        `;
        
        // Simplified query alternative if your schema handles it differently:
        const [matches] = await db.execute(`
            SELECT u.id as peer_id, u.name as peer_name, s.skill_name 
            FROM skills s
            JOIN users u ON s.user_id = u.id
            WHERE s.skill_type = 'teach' 
              AND s.user_id != ? 
              AND s.skill_name IN (
                  SELECT skill_name FROM skills WHERE user_id = ? AND skill_type = 'learn'
              )
        `, [userId, userId]);

        res.status(200).json(matches);
    } catch (err) {
        console.error("Error fetching matches:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
