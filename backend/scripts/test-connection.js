const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres',  // Connect to default database first
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL');
        
        // Test if we can create database
        await client.query('CREATE DATABASE auth_db;');
        console.log('Created auth_db database');
        
        await client.query('CREATE DATABASE resume_enhancer;');
        console.log('Created resume_enhancer database');
        
        client.release();
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await pool.end();
    }
}

testConnection();
