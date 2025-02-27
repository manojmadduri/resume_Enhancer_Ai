const { Pool } = require('pg');
require('dotenv').config();

// Auth database connection
const authPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'auth_db',
    password: process.env.DB_PASSWORD,  // Use exact password from .env
    port: process.env.DB_PORT || 5432,
});

// Resume database connection
const resumePool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'resume_enhancer',
    password: process.env.DB_PASSWORD,  // Use exact password from .env
    port: process.env.DB_PORT || 5432,
});

module.exports = {
    authPool,
    resumePool
};
