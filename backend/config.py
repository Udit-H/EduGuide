import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-for-development'
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False 

    # AI Platform Configuration
    GRADIENT_API_TOKEN = os.environ.get('GRADIENT_API_TOKEN')
    GRADIENT_BASE_URL = os.environ.get('GRADIENT_BASE_URL')
    
    # File Uploads Configuration
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
    ALLOWED_EXTENSIONS = {'txt', 'pdf'}