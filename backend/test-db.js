const db = require('./config/database');

async function testConnection() {
    try {
        // This command just asks MySQL to return the number 1
        const [rows] = await db.query('SELECT 1');
        console.log('SUCCESS: Database connection is working!');
    } catch (err) {
        console.error('ERROR: Database connection failed.');
        console.error('Message:', err.message);
    }
    process.exit(); // This closes the connection test automatically
}

testConnection();