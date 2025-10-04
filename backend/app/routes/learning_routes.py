import json
from flask import Blueprint, request, jsonify, current_app
from app.services import ai_service
from bson.objectid import ObjectId
from typing import Optional

# CRITICAL: Define the Blueprint object
learning_bp = Blueprint('learning_bp', __name__)

@learning_bp.route('/roadmap', methods=['POST'])
def generate_roadmap():
    """Handles Feature 1: Initial Roadmap Generation and MongoDB persistence."""
    data = request.get_json()
    skill_input = data.get('skill')
    level = data.get('level')
    user_id = "mock_user_1" # Consistent mock user ID for testing

    if not skill_input or not level:
        return jsonify({"error": "Skill and level are required."}), 400

    try:
        # Access MongoDB collections
        users_collection = current_app.db.users 
        roadmaps_collection = current_app.db.roadmaps
        
        # 1. CHECK/CREATE MOCK USER (MongoDB does not have table errors, only collection access errors)
        if users_collection.find_one({"_id": user_id}) is None:
            mock_user = {"_id": user_id, "username": "test_mongo_user", "email": "test@mongo.com"}
            users_collection.insert_one(mock_user)
        
        # 2. Call Gemini API to generate the path
        initial_assets = ai_service.generate_initial_roadmap_assets(skill_input, level)
        
        # 3. SAVE the generated document
        roadmap_data = {
            "user_id": user_id,
            "skill_name": skill_input,
            "level": level,
            "current_milestone": 1, # Start at milestone 1
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
        return jsonify({"error": f"Failed during API execution or MongoDB save. Details: {error_message}"}), 500


@learning_bp.route('/milestone-complete', methods=['POST'])
def milestone_complete():
    """Handles Feature 6: Generates Reports/Quizzes/Projects after milestone completion."""
    data = request.get_json()
    roadmap_id_str: Optional[str] = data.get('roadmap_id')
    completed_milestone_number: Optional[int] = data.get('completed_milestone')

    if not roadmap_id_str or not completed_milestone_number:
        return jsonify({"error": "Missing roadmap_id or completed_milestone in request."}), 400
    
    roadmaps_collection = current_app.db.roadmaps

    try:
        # 1. Retrieve the existing roadmap document
        roadmap_oid = ObjectId(roadmap_id_str)
        roadmap_doc = roadmaps_collection.find_one({"_id": roadmap_oid})

        if not roadmap_doc:
            return jsonify({"error": "Roadmap not found."}), 404

        # 2. Get the concepts from the completed milestone
        milestones = roadmap_doc['full_path_data']['roadmap']
        
        # Safely find the completed milestone's concepts
        completed_milestone_data = next((m for m in milestones if m.get('milestone_number') == completed_milestone_number), None)
        
        if not completed_milestone_data or 'concepts' not in completed_milestone_data:
            return jsonify({"error": "Concepts for completed milestone not found in document."}), 400
        
        completed_concepts = completed_milestone_data['concepts']
        
        # 3. Call Gemini API to generate the next report/assets (Feature 6)
        report_assets = ai_service.generate_milestone_report(", ".join(completed_concepts))

        # 4. Update MongoDB Document with new assets and milestone number (CRITICAL)
        # In a real app, you would add these assets to the existing document structure.
        roadmaps_collection.update_one(
            {"_id": roadmap_oid},
            {"$set": {
                "current_milestone": completed_milestone_number + 1,
                f"full_path_data.milestone_{completed_milestone_number}_report": report_assets 
            }}
        )

        return jsonify({
            "status": "success",
            "milestone_report": report_assets
        }), 200

    except Exception as e:
        error_message = str(e)
        return jsonify({"error": f"Failed during milestone report generation. Details: {error_message}"}), 500

