# backend/run.py

import os
from dotenv import load_dotenv
from app import create_app

# --- CRITICAL FIX: Load .env FIRST ---
# 1. Define BASEDIR relative to run.py (which is in the backend folder)
BASEDIR = os.path.abspath(os.path.dirname(__file__))

# 2. Load the .env file from the parent directory ('..')
load_dotenv(os.path.join(BASEDIR, '..', '.env')) 
# ------------------------------------

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)