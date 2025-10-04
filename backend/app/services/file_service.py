import os
from werkzeug.utils import secure_filename
from config import Config

def allowed_file(filename):
    """Checks file extension against ALLOWED_EXTENSIONS."""
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def save_uploaded_file(file_storage):
    """Saves the uploaded file to the local uploads folder."""
    if file_storage and allowed_file(file_storage.filename):
        # Always use secure_filename for security!
        filename = secure_filename(file_storage.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file_storage.save(filepath)
        return filepath
    return None

def read_file_content(filepath):
    """Reads content for AI processing."""
    # This is a placeholder; real PDF parsing requires libraries like PyPDF2.
    try:
        if filepath.endswith('.txt'):
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        elif filepath.endswith('.pdf'):
            # In production, this would call a PDF parser library.
            return "Placeholder content extracted from PDF..."
        return None
    except Exception:
        return None