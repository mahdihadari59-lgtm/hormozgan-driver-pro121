const bcrypt = require('bcryptjs');
const db = require('../config/database');
const jwtService = require('./jwt.service');

class AuthService {
  
  async register({ phone, password, name, role }) {
    const existingUser = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      throw new Error('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO users (phone, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run(phone, passwordHash, name, role);

    if (role === 'driver') {
      db.prepare('INSERT INTO drivers (user_id) VALUES (?)').run(result.lastInsertRowid);
    }

    return {
      success: true,
      message: 'Registration successful',
      userId: result.lastInsertRowid
    };
  }

  async login({ phone, password }) {
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    
    if (!user) {
      throw new Error('Invalid phone or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid phone or password');
    }

    const payload = {
      userId: user.id,
      phone: user.phone,
      role: user.role
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    db.prepare(`
      INSERT INTO sessions (user_id, refresh_token, expires_at)
      VALUES (?, ?, datetime('now', '+7 days'))
    `).run(user.id, refreshToken);

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    };
  }

  async getUserById(userId) {
    const user = db.prepare(`
      SELECT id, phone, name, role, verified, status, created_at
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new AuthService();
