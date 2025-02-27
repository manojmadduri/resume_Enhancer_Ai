const { resumePool } = require('../config/db');

async function checkTables() {
    const client = await resumePool.connect();
    try {
        const query = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `;
        const result = await client.query(query);
        console.log('Tables in resume_enhancer database:');
        result.rows.forEach(row => {
            console.log('-', row.table_name);
        });
    } catch (error) {
        console.error('Error checking tables:', error);
    } finally {
        client.release();
    }
}

checkTables()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
