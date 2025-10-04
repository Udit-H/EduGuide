import os
from flask import Blueprint, request, jsonify
from app.services import file_service
from app.services import ai_service 

file_bp = Blueprint('file_bp', __name__)

@file_bp.route('/upload-summary', methods=['POST'])
def upload_for_summary():
    """Handles research paper upload, calls AI, and cleans up."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    filepath = file_service.save_uploaded_file(file)
    
    if not filepath:
        return jsonify({"error": "Invalid file or file type."}), 400

    try:
        content = file_service.read_file_content(filepath)
        if not content or content.strip() == "":
            raise Exception("Could not extract readable content from file.")
            
        # Call AI Service for summarization
        summary_assets = ai_service.generate_summary_and_flashcards(content)
        
        return jsonify(summary_assets), 200

    except Exception as e:
        return jsonify({"error": f"Processing failed: {e}"}), 500
    finally:
        # PROFESSIONAL BEST PRACTICE: DELETE THE TEMPORARY FILE
        if os.path.exists(filepath):
            os.remove(filepath)