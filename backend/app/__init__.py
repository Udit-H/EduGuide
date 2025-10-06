from flask import Flask
from flask_cors import CORS
from config import Config
from pymongo import MongoClient 

mongo_client = None

def create_app(config_class=Config):
    global mongo_client
    
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app) 
    

    if not mongo_client:
        mongo_client = MongoClient(app.config['MONGO_URI'])
        
    app.db = mongo_client[app.config['MONGO_DB_NAME']] 
    
    from .routes.learning_routes import learning_bp
    from .routes.file_routes import file_bp
    
    app.register_blueprint(learning_bp, url_prefix='/api/learn')
    app.register_blueprint(file_bp, url_prefix='/api/files') 
        
    return app