import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from config import Config
from app.schemas.ai_output import LearningPathOutput, MilestoneReportOutput, PaperSummaryOutput


# --- 1. Client Factory ---

def get_gemini_client():
    """Initializes and returns the Gemini client."""
    
    api_key = Config.GEMINI_API_KEY
    
    if not api_key:
        # Check config key directly for robust error message
        raise Exception("Gemini API Key is missing. Check your .env file.")
    
    return genai.Client(api_key=api_key)

# --- 2. Generic AI Call Function ---

def _make_gemini_call(prompt: str, schema: BaseModel) -> dict:
    """A generic function to handle all structured Gemini API calls."""
    
    client = get_gemini_client() 
    MODEL_NAME = Config.GEMINI_MODEL
    
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema, 
                system_instruction="You are an expert AI Curriculum Designer named 'Pathfinder'. Your sole job is to generate JSON data that strictly conforms to the provided schema."
            )
        )
        
        # The response.text property contains the guaranteed valid JSON string
        return json.loads(response.text)

    except Exception as e:
        error_message = str(e)
        # Note: Added detailed error handling here for better tracing
        if "400" in error_message or "Invalid content" in error_message:
            error_message = f"API Error: Bad Request (400). Content may be too long or prompt failed validation. Details: {e}"
            
        raise Exception(f"Gemini API generation failed. Error: {error_message}")


# --- 3. Feature Implementations ---

def generate_initial_roadmap_assets(skill: str, level: str) -> dict:
    """The function called by the /api/learn/roadmap route."""
    prompt = f"Generate the full learning path, including all milestones, the 5-question quiz for Milestone 1, 5 flashcards, and the mini-project for Milestone 1. Skill: '{skill}', Level: '{level}'."
    return _make_gemini_call(prompt, LearningPathOutput)


def generate_milestone_report(completed_concept: str) -> dict:
    """The function called by the /api/learn/milestone-complete route."""
    prompt = f"""
    The user has successfully mastered the concept: '{completed_concept}'. 
    Generate a summary of this concept, provide a suggestion for the next logical milestone, and generate a new 5-question quiz and a new mini-project for that *next* milestone.
    """
    return _make_gemini_call(prompt, MilestoneReportOutput)


def generate_summary_and_flashcards(text_content: str) -> dict:
    """The function called by the /api/files/upload-summary route."""
    prompt = f"Summarize the following research paper content into a concise, easy-to-understand explanation for an intermediate learner. Also, extract between 5 and 10 key terms and their definitions for flashcards.\n\nCONTENT:\n---\n{text_content[:8000]}..." # Truncate long content for safety
    return _make_gemini_call(prompt, PaperSummaryOutput)