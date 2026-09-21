from pydantic import BaseModel, Field

from .detection import DetectionResult


class SourceFileInput(BaseModel):
    path: str = Field(min_length=1)
    language: str = Field(min_length=1)
    content: str


class AnalysisRequest(BaseModel):
    scan_id: str = Field(min_length=1)
    files: list[SourceFileInput]


class AnalysisResponse(BaseModel):
    scan_id: str
    detections: list[DetectionResult]
