# database.py - SQLAlchemy Models
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Hotel(db.Model):
    __tablename__ = 'hotels'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    stars = db.Column(db.Float, default=3)
    city = db.Column(db.String(100))
    district = db.Column(db.String(100))
    price = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    amenities = db.Column(db.Text)
    image = db.Column(db.String(50))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'stars': self.stars,
            'city': self.city,
            'district': self.district,
            'price': self.price,
            'phone': self.phone,
            'amenities': self.amenities.split(',') if self.amenities else [],
            'image': self.image
        }

class Tour(db.Model):
    __tablename__ = 'tours'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    duration = db.Column(db.String(50))
    transport = db.Column(db.String(50))
    price = db.Column(db.Integer)
    includes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'duration': self.duration,
            'transport': self.transport,
            'price': self.price,
            'includes': self.includes.split(',') if self.includes else []
        }

class Attraction(db.Model):
    __tablename__ = 'attractions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100))
    type = db.Column(db.String(50))
    rating = db.Column(db.Float)
    description = db.Column(db.Text)
    price = db.Column(db.Integer)
    hours = db.Column(db.String(100))
    image = db.Column(db.String(50))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'type': self.type,
            'rating': self.rating,
            'description': self.description[:200],
            'price': self.price,
            'hours': self.hours,
            'image': self.image
        }

class TrafficPoint(db.Model):
    __tablename__ = 'traffic_points'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    level = db.Column(db.String(50))
    peak_hours = db.Column(db.String(100))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    suggestion = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'peak_hours': self.peak_hours,
            'suggestion': self.suggestion
        }

class UserQuery(db.Model):
    __tablename__ = 'user_queries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100))
    query = db.Column(db.Text)
    intent = db.Column(db.String(50))
    confidence = db.Column(db.Float)
    response = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'query': self.query,
            'intent': self.intent,
            'confidence': self.confidence,
            'timestamp': self.timestamp.isoformat()
        }

class IntentLog(db.Model):
    __tablename__ = 'intent_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    intent = db.Column(db.String(50))
    count = db.Column(db.Integer, default=1)
    last_used = db.Column(db.DateTime, default=datetime.utcnow)

print("✅ Database models loaded")
