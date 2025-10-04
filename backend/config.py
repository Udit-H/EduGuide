import os
# --- REMOVED: from dotenv import load_dotenv --- 
# The environment is loaded by run.py, we only need 'os' here.

# Define BASEDIR relative to the config.py file itself.
BASEDIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Flask Secret Key
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-for-development'
    
    # Database Configuration (Reads directly from the environment)
    MONGO_URI = os.environ.get('MONGO_URI') 
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'EduGuide')

    # AI Platform Configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')
    
    # File Uploads Configuration
    # UPLOAD_FOLDER is set relative to the Project Root ('..')
    UPLOAD_FOLDER = os.path.join(BASEDIR, '..', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
    ALLOWED_EXTENSIONS = {'txt', 'pdf'}