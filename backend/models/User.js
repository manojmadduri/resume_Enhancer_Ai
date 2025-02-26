const pool = require('../config/db');

const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
            firebase_uid VARCHAR(128) UNIQUE,
            is_email_verified BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    try {
        await pool.query(query);
        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating users table:', error);
        throw error;
    }
};

const User = {
    create: async ({ email, password, authProvider, firebaseUid, isEmailVerified = false }) => {
        const query = `
            INSERT INTO users (email, password, auth_provider, firebase_uid, is_email_verified)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, auth_provider, is_email_verified;
        `;
        
        try {
            const result = await pool.query(query, [email, password, authProvider, firebaseUid, isEmailVerified]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    },

    findByEmail: async (email) => {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    },

    findByFirebaseUid: async (firebaseUid) => {
        try {
            const query = 'SELECT * FROM users WHERE firebase_uid = $1';
            const result = await pool.query(query, [firebaseUid]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    },

    updateEmailVerification: async (email) => {
        try {
            const query = `
                UPDATE users 
                SET is_email_verified = true,
                    updated_at = CURRENT_TIMESTAMP
                WHERE email = $1
                RETURNING *;
            `;
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating email verification:', error);
            throw error;
        }
    },

    updatePassword: async (email, hashedPassword) => {
        try {
            const query = `
                UPDATE users 
                SET password = $2,
                    updated_at = CURRENT_TIMESTAMP
                WHERE email = $1
                RETURNING *;
            `;
            const result = await pool.query(query, [email, hashedPassword]);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }
};

// Initialize the database
createUserTable().catch(error => {
    console.error('Failed to create users table:', error);
    process.exit(1);
});

module.exports = User;
