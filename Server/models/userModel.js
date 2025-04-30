const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
    static async create({ username, email, password, tipo = 'user', address = null, profileImg = null }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, tipo, address, profileImg) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, tipo, address, profileImg]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                if (key === 'password') {
                    const hashedPassword = await bcrypt.hash(value, 10);
                    fields.push(`${key} = ?`);
                    values.push(hashedPassword);
                } else {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }
        }
        
        if (fields.length === 0) return;
        
        values.push(id);
        await pool.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
    }

    static async delete(id) {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    }

    static async getAll(limit = 5, page = 0, filters = {}) {
        const offset = page * limit;
        let query = 'SELECT id, username, email, tipo, isBanned FROM users';
        const values = [];

        // Adicionar filtros
        const whereConditions = [];
        if (filters.role) {
            whereConditions.push('tipo = ?');
            values.push(filters.role);
        }
        if (filters.isBanned !== undefined) {
            whereConditions.push('isBanned = ?');
            values.push(filters.isBanned);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        query += ' LIMIT ? OFFSET ?';
        values.push(limit, offset);

        const [rows] = await pool.execute(query, values);
        return rows;
    }

    static async count(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM users';
        const values = [];

        // Adicionar filtros
        const whereConditions = [];
        if (filters.role) {
            whereConditions.push('tipo = ?');
            values.push(filters.role);
        }
        if (filters.isBanned !== undefined) {
            whereConditions.push('isBanned = ?');
            values.push(filters.isBanned);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        const [rows] = await pool.execute(query, values);
        return rows[0].count;
    }

    static generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, tipo: user.tipo },
            'your_jwt_secret_key',
            { expiresIn: '24h' }
        );
    }

    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User; 