from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from config import Config

db = SQLAlchemy() 

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app) 
    db.init_app(app) 

    # Register Blueprints (Routes)
    from app.routes.learning_routes import learning_bp
    from app.routes.file_routes import file_bp
    
    app.register_blueprint(learning_bp, url_prefix='/api/learn')
    app.register_blueprint(file_bp, url_prefix='/api/files') 

    # Setup database within the application context
    with app.app_context():
        from app.models import user, roadmap 
        db.create_all() # Create tables if they don't exist
        
    return app