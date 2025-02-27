const { authPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    const client = await authPool.connect();
    try {
        // Read and execute the schema.sql file
        const schema = fs.readFileSync(path.join(__dirname, 'auth-schema.sql'), 'utf8');
        await client.query(schema);
        console.log('Auth database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Run the initialization
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('Auth database initialization complete');
            process.exit(0);
        })
        .catch(error => {
            console.error('Auth database initialization failed:', error);
            process.exit(1);
        });
}
