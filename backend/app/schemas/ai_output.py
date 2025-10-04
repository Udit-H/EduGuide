from pydantic import BaseModel, Field
from typing import List

# --- Core Component Schemas ---
class Flashcard(BaseModel):
    front: str = Field(description="The key term or question.")
    back: str = Field(description="The detailed definition or answer.")

class QuizQuestion(BaseModel):
    id: int
    type: str = "multiple-choice"
    question: str
    options: List[str]
    answer: str = Field(description="The correct option letter, e.g., 'B'")
    explanation: str

class Milestone(BaseModel):
    milestone_number: int
    title: str
    description: str
    concepts: List[str] = Field(default_factory=list, description="Core concepts covered in this milestone.")

class MiniProject(BaseModel): # FIXED: Changed BaseIdModel to BaseModel
    title: str
    difficulty: str
    instructions: str = Field(description="A step-by-step list of tasks.")

# --- Root Schemas for API Endpoints ---

# 1. Schema for /api/learn/roadmap (Feature 1, 2, 3, 5)
class LearningPathOutput(BaseModel):
    """The root schema for the initial /roadmap API response."""
    skill_name: str
    level: str
    roadmap: List[Milestone] = Field(min_length=3, max_length=3)
    quiz_milestone_1: List[QuizQuestion] = Field(min_length=5, max_length=5)
    flashcards_milestone_1: List[Flashcard] = Field(min_length=5, max_length=5)
    mini_project_milestone_1: MiniProject

# 2. Schema for /api/learn/milestone-complete (Feature 6: Milestone Reports)
class MilestoneReportOutput(BaseModel):
    """The schema for the /milestone-complete API response."""
    learned_summary: str = Field(description="A summary of the learned concepts from the completed milestone.")
    suggested_next_milestone_title: str
    new_quiz: List[QuizQuestion] = Field(min_length=5, max_length=5, description="Quiz for the NEXT milestone.")
    new_project: MiniProject = Field(description="Project for the NEXT milestone.")

# 3. Schema for /api/files/upload-summary (Features 4 & 5: Paper Summarization)
class PaperSummaryOutput(BaseModel):
    """The schema for the /upload-summary API response."""
    paper_summary: str = Field(description="A concise, easy-to-understand summary of the research paper text.")
    flashcards: List[Flashcard] = Field(min_length=5, max_length=10)
