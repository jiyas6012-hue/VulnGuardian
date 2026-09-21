from typing import Any, Literal

from pydantic import BaseModel, Field


DetectorType = Literal[
    "STATIC",
    "ML",
    "SAST_RULE",
    "AST",
]


class SourceLocation(BaseModel):
    start_line: int = Field(ge=1)
    start_column: int | None = Field(default=None, ge=1)
    end_line: int = Field(ge=1)
    end_column: int | None = Field(default=None, ge=1)


class DetectionEvidence(BaseModel):
    type: str
    message: str | None = None
    source: str | None = None
    sink: str | None = None
    flow: list[dict[str, Any]] | None = None


class DetectionMetadata(BaseModel):
    analyzer: str | None = None
    analyzer_version: str | None = None
    rule_id: str | None = None


class DetectionResult(BaseModel):
    detector_type: DetectorType
    vulnerability_slug: str
    file_path: str
    location: SourceLocation
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: DetectionEvidence | None = None
    metadata: DetectionMetadata | None = None
