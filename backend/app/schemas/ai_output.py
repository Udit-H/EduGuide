from pydantic import BaseModel, Field
from typing import List

# Define the smallest component first
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

class MiniProject(BaseModel):
    title: str
    difficulty: str
    instructions: str = Field(description="A step-by-step list of tasks.")

# Define the Master Schema
class LearningPathOutput(BaseModel):
    """The root schema for the initial /roadmap API response."""
    skill_name: str
    level: str
    roadmap: List[Milestone] = Field(min_length=3, max_length=3)
    quiz_milestone_1: List[QuizQuestion] = Field(min_length=5, max_length=5)
    flashcards_milestone_1: List[Flashcard] = Field(min_length=5, max_length=5)
    mini_project_milestone_1: MiniProject