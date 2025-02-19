from pydantic import BaseModel
from typing import List, Optional, Dict

class QuestionRecommendation(BaseModel):
    question_id: int
    subject_name: str
    difficulty: float
    tags: List[str]
    
    class Config:
        orm_mode = True

class ContentRecommendationResponse(BaseModel):
    id: int
    content_type: str
    content_url: str
    title: str
    description: str
    tags: List[str]
    
    class Config:
        orm_mode = True

class GptAssistanceRequest(BaseModel):
    question: str
    context: Optional[Dict[str, str]] = None

class GptAssistanceResponse(BaseModel):
    answer: str 