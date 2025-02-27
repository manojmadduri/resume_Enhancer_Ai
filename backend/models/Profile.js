const { resumePool } = require('../config/db');

class Profile {
    static async create(userId, profileData) {
        const {
            firstName,
            lastName,
            title,
            bio,
            phone,
            location,
            linkedinUrl,
            githubUrl,
            portfolioUrl,
            skills,
            experienceYears,
            preferredJobTypes,
            preferredLocations
        } = profileData;

        const query = `
            INSERT INTO user_profiles (
                user_id,
                first_name,
                last_name,
                title,
                bio,
                phone,
                location,
                linkedin_url,
                github_url,
                portfolio_url,
                skills,
                experience_years,
                preferred_job_types,
                preferred_locations
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;

        try {
            const result = await resumePool.query(query, [
                userId,
                firstName,
                lastName,
                title,
                bio,
                phone,
                location,
                linkedinUrl,
                githubUrl,
                portfolioUrl,
                skills,
                experienceYears,
                preferredJobTypes,
                preferredLocations
            ]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        const query = `
            SELECT *
            FROM user_profiles
            WHERE user_id = $1;
        `;

        try {
            const result = await resumePool.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding profile:', error);
            throw error;
        }
    }

    static async update(userId, profileData) {
        const updates = [];
        const values = [userId];
        let paramCount = 2;

        // Build the SET clause dynamically based on provided fields
        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined) {
                const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                updates.push(`${snakeKey} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        // Add updated_at to the SET clause
        updates.push('updated_at = CURRENT_TIMESTAMP');

        const query = `
            UPDATE user_profiles
            SET ${updates.join(', ')}
            WHERE user_id = $1
            RETURNING *;
        `;

        try {
            const result = await resumePool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    static async delete(userId) {
        const query = `
            DELETE FROM user_profiles
            WHERE user_id = $1
            RETURNING *;
        `;

        try {
            const result = await resumePool.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }
}

module.exports = Profile;
