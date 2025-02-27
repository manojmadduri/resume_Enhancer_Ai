const { authPool } = require('../config/db');

const User = {
    async create({ email, password, authProvider, firebaseUid, isEmailVerified = false }) {
        const query = `
            INSERT INTO users (email, password, auth_provider, firebase_uid, is_email_verified)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, auth_provider, is_email_verified;
        `;
        try {
            const result = await authPool.query(query, [email, password, authProvider, firebaseUid, isEmailVerified]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    async findById(id) {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result = await authPool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    },

    async findByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await authPool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    },

    async findByFirebaseUid(firebaseUid) {
        try {
            const query = 'SELECT * FROM users WHERE firebase_uid = $1';
            const result = await authPool.query(query, [firebaseUid]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by firebase_uid:', error);
            throw error;
        }
    },

    async updateEmailVerification(email) {
        try {
            const query = `
                UPDATE users 
                SET is_email_verified = true,
                    updated_at = CURRENT_TIMESTAMP
                WHERE email = $1
                RETURNING *
            `;
            const result = await authPool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating email verification:', error);
            throw error;
        }
    },

    async updatePassword(email, hashedPassword) {
        try {
            const query = `
                UPDATE users 
                SET password = $2,
                    updated_at = CURRENT_TIMESTAMP
                WHERE email = $1
                RETURNING *
            `;
            const result = await authPool.query(query, [email, hashedPassword]);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }
};

module.exports = User;
