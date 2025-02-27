const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function initializeResumeDatabase() {
    // Create a pool for the postgres database to create resume_enhancer
    const pgPool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        // Check if resume_enhancer database exists
        const checkDb = await pgPool.query(
            "SELECT 1 FROM pg_database WHERE datname = 'resume_enhancer'"
        );

        // Create database if it doesn't exist
        if (checkDb.rows.length === 0) {
            await pgPool.query('CREATE DATABASE resume_enhancer');
            console.log('Created resume_enhancer database');
        }
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    } finally {
        await pgPool.end();
    }

    // Create a pool for the resume_enhancer database
    const resumePool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'resume_enhancer',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        // Read and execute the schema.sql file
        const schema = fs.readFileSync(path.join(__dirname, 'resume-schema.sql'), 'utf8');
        await resumePool.query(schema);
        console.log('Resume database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing resume database tables:', error);
        throw error;
    } finally {
        await resumePool.end();
    }
}

// Run the initialization
if (require.main === module) {
    initializeResumeDatabase()
        .then(() => {
            console.log('Resume database initialization complete');
            process.exit(0);
        })
        .catch(error => {
            console.error('Resume database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeResumeDatabase };
