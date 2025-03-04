from pydantic import BaseModel
from typing import List, Optional, Dict

class QuestionRecommendation(BaseModel):
    questionId: int
    content: str
    answer: str
    explanation: str
    
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
    questionId: int
    content: str
    answer: str
    context: Optional[Dict[str, str]] = None

class GptAssistanceResponse(BaseModel):
    questionId: int
    content: str
    answer: str
    explanation: str
    
    class Config:
        orm_mode = True 