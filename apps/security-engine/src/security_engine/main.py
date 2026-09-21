from fastapi import FastAPI

from .models.analysis import AnalysisRequest, AnalysisResponse

app = FastAPI(
    title="VulnGuardian Security Engine",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "security-engine",
    }


@app.post("/analyze", response_model=AnalysisResponse)
def analyze(request: AnalysisRequest):
    return AnalysisResponse(
        scan_id=request.scan_id,
        detections=[],
    )
