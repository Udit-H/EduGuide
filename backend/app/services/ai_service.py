import json
from google import genai
from google.genai import types
from config import Config
from app.schemas.ai_output import LearningPathOutput, MilestoneReportOutput, PaperSummaryOutput

# Initialize the client using the API Key from config
client = genai.Client(api_key=Config.GEMINI_API_KEY)
MODEL_NAME = Config.GEMINI_MODEL

def _make_gemini_call(prompt: str, schema: BaseModel) -> dict:
    """A generic function to handle all structured Gemini API calls."""
    if not Config.GEMINI_API_KEY:
        raise Exception("Gemini API Key not configured in environment.")
    
    try:
        response = client.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema, 
                # This system instruction is crucial for high-quality JSON adherence
                system_instruction="You are an expert AI Curriculum Designer named 'Pathfinder'. Your only job is to generate output that strictly adheres to the requested JSON schema."
            )
        )
        
        # We rely on the model to return valid JSON, which is then parsed by json.loads
        return json.loads(response.text)

    except Exception as e:
        raise Exception(f"Gemini API generation failed. Error: {e}")


def generate_initial_roadmap_assets(skill: str, level: str) -> dict:
    """Handles Features 1, 2, 3, 5: Generates initial path and Milestone 1 assets."""
    prompt = f"Generate the full learning path, including all milestones, the 5-question quiz for Milestone 1, 5 flashcards, and the mini-project for Milestone 1. Skill: '{skill}', Level: '{level}'."
    return _make_gemini_call(prompt, LearningPathOutput)


def generate_milestone_report(completed_concept: str) -> dict:
    """Handles Feature 6: Generates the summary, next quiz, and next project."""
    prompt = f"""
    The user has successfully mastered the concept: '{completed_concept}'. 
    Generate a summary of this concept, provide a suggestion for the next logical milestone, and generate a new 5-question quiz and a new mini-project for that *next* milestone.
    """
    return _make_gemini_call(prompt, MilestoneReportOutput)


def generate_summary_and_flashcards(text_content: str) -> dict:
    """Handles Features 4, 5: Generates summary and flashcards from paper content."""
    prompt = f"Summarize the following research paper content into a concise, easy-to-understand explanation. Also, extract between 5 and 10 key terms and their definitions for flashcards.\n\nCONTENT:\n---\n{text_content[:8000]}..." # Truncate long content for safety
    return _make_gemini_call(prompt, PaperSummaryOutput)