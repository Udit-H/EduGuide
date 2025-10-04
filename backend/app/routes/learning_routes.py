# backend/app/routes/learning_routes.py

from flask import Blueprint, request, jsonify, current_app
from app.services import ai_service
from bson.objectid import ObjectId # Needed to handle MongoDB's unique IDs

# CRITICAL: Define the Blueprint object
learning_bp = Blueprint('learning_bp', __name__)

@learning_bp.route('/roadmap', methods=['POST'])
def generate_roadmap():
    data = request.get_json()
    skill_input = data.get('skill')
    level = data.get('level')
    user_id = "mock_user_1" # Use a stable string ID for the mock user

    if not skill_input or not level:
        return jsonify({"error": "Skill and level are required."}), 400

    try:
        # Access MongoDB collections
        users_collection = current_app.db.users 
        roadmaps_collection = current_app.db.roadmaps
        
        # 1. CHECK/CREATE MOCK USER
        if users_collection.find_one({"_id": user_id}) is None:
            mock_user = {"_id": user_id, "username": "test_mongo_user", "email": "test@mongo.com"}
            users_collection.insert_one(mock_user)
        
        # 2. Call Gemini API
        initial_assets = ai_service.generate_initial_roadmap_assets(skill_input, level)
        
        # 3. SAVE the generated JSON document to the roadmaps collection
        roadmap_data = {
            "user_id": user_id,
            "skill_name": skill_input,
            "level": level,
            "full_path_data": initial_assets 
        }
        result = roadmaps_collection.insert_one(roadmap_data)

        # 4. Return success
        return jsonify({
            "status": "success",
            "roadmap_id": str(result.inserted_id),
            "data": initial_assets
        }), 200

    except Exception as e:
        error_message = str(e)
        if "Gemini API generation failed" in error_message:
            return jsonify({"error": error_message}), 503
        
        return jsonify({"error": f"Failed during MongoDB operation. Details: {error_message}"}), 500