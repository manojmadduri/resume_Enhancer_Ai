const { resumePool } = require('../config/db');

class Resume {
    static async create(userId, originalFileName, fileUrl, format) {
        const query = `
            INSERT INTO resumes (user_id, original_file_name, file_url, format)
            VALUES ($1, $2, $3, $4)
            RETURNING id, original_file_name, file_url, format, created_at, updated_at;
        `;

        try {
            const result = await resumePool.query(query, [userId, originalFileName, fileUrl, format]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating resume:', error);
            throw error;
        }
    }

    static async findById(id) {
        const query = `
            SELECT r.*, 
                   array_agg(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL) as keywords,
                   array_agg(DISTINCT s.suggestion) FILTER (WHERE s.suggestion IS NOT NULL) as suggestions
            FROM resumes r
            LEFT JOIN resume_keywords k ON r.id = k.resume_id
            LEFT JOIN resume_suggestions s ON r.id = s.resume_id
            WHERE r.id = $1
            GROUP BY r.id;
        `;

        try {
            const result = await resumePool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding resume:', error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        const query = `
            SELECT r.*, 
                   array_agg(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL) as keywords,
                   array_agg(DISTINCT s.suggestion) FILTER (WHERE s.suggestion IS NOT NULL) as suggestions
            FROM resumes r
            LEFT JOIN resume_keywords k ON r.id = k.resume_id
            LEFT JOIN resume_suggestions s ON r.id = s.resume_id
            WHERE r.user_id = $1
            GROUP BY r.id
            ORDER BY r.created_at DESC;
        `;

        try {
            const result = await resumePool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding resumes:', error);
            throw error;
        }
    }

    static async addKeywords(resumeId, keywords) {
        const query = `
            INSERT INTO resume_keywords (resume_id, keyword)
            VALUES ($1, unnest($2::text[]))
            ON CONFLICT (resume_id, keyword) DO NOTHING
            RETURNING keyword;
        `;

        try {
            const result = await resumePool.query(query, [resumeId, keywords]);
            return result.rows;
        } catch (error) {
            console.error('Error adding keywords:', error);
            throw error;
        }
    }

    static async addSuggestions(resumeId, suggestions) {
        const query = `
            INSERT INTO resume_suggestions (resume_id, suggestion)
            VALUES ($1, unnest($2::text[]))
            ON CONFLICT (resume_id, suggestion) DO NOTHING
            RETURNING suggestion;
        `;

        try {
            const result = await resumePool.query(query, [resumeId, suggestions]);
            return result.rows;
        } catch (error) {
            console.error('Error adding suggestions:', error);
            throw error;
        }
    }

    static async update(id, updates) {
        const setClause = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
        const values = Object.values(updates);

        const query = `
            UPDATE resumes
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `;

        try {
            const result = await resumePool.query(query, [id, ...values]);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating resume:', error);
            throw error;
        }
    }

    static async delete(id) {
        const query = `
            DELETE FROM resumes
            WHERE id = $1
            RETURNING *;
        `;

        try {
            const result = await resumePool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting resume:', error);
            throw error;
        }
    }
}

module.exports = Resume;
