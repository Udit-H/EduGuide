import os
from dotenv import load_dotenv

# Get the base directory path for local file operations
BASEDIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Flask Secret Key
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-for-development'
    
    # -----------------------------------------------------------
    # DATABASE CONFIGURATION (MongoDB)
    # -----------------------------------------------------------
    MONGO_URI = os.getenv('MONGO_URI') 
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'EduGuideDB_Default') # Added default for safety

    # -----------------------------------------------------------
    # AI PLATFORM CONFIGURATION (Gemini API)
    # -----------------------------------------------------------
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') 
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
    
    # -----------------------------------------------------------
    # FILE UPLOADS CONFIGURATION
    # -----------------------------------------------------------
    UPLOAD_FOLDER = os.path.join(BASEDIR, '..', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
    ALLOWED_EXTENSIONS = {'txt', 'pdf'}