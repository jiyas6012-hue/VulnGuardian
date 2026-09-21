from fastapi.testclient import TestClient

from security_engine.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "security-engine",
    }


def test_analyze_returns_empty_detections():
    response = client.post(
        "/analyze",
        json={
            "scan_id": "test-scan-001",
            "files": [
                {
                    "path": "example.py",
                    "language": "python",
                    "content": "print('hello')",
                }
            ],
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "scan_id": "test-scan-001",
        "detections": [],
    }
