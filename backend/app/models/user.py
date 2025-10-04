from app.__init__ import db 
from sqlalchemy import Index

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    # Relationship: A User can have many Roadmaps
    roadmaps = db.relationship('Roadmap', backref='owner', lazy='dynamic')
    
    def __repr__(self):
        return f'<User {self.username}>'