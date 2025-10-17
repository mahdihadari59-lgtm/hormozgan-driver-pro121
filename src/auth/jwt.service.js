const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh';
    this.ACCESS_TOKEN_EXPIRES = '24h';
    this.REFRESH_TOKEN_EXPIRES = '7d';
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES,
      issuer: 'hormozgan-driver-pro'
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES,
      issuer: 'hormozgan-driver-pro'
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new JwtService();
