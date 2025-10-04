from app.__init__ import db 
from sqlalchemy.dialects.postgresql import JSONB 
from sqlalchemy import func

class Roadmap(db.Model):
    __tablename__ = 'roadmaps'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key to the User table
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    
    skill_name = db.Column(db.String(128), nullable=False)
    
    # Progress Tracking (Feature 6)
    current_milestone = db.Column(db.Integer, default=1)
    is_complete = db.Column(db.Boolean, default=False)
    
    # Store the complex AI-generated structure (Roadmap, Quiz, Flashcards, Projects) as JSONB
    # JSONB is native to PostgreSQL and is highly efficient for semi-structured data
    full_path_data = db.Column(JSONB, nullable=False) 
    
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f'<Roadmap {self.id} for {self.skill_name}>'

# Ensure you also create empty __init__.py files in the models folder
# touch backend/app/models/__init__.py