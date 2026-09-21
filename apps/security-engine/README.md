# VulnGuardian Security Engine

The Security Engine is responsible for source-code security analysis in VulnGuardian.

## Current Status

Initial project scaffold.

The SAST tools, AST/parser strategy, data-flow analysis, custom rules, and hybrid analysis architecture are intentionally **not finalized yet**.

These decisions will be made after cybersecurity team research and team review.

## Responsibilities

The Security Engine will eventually handle:

* Static security analysis
* AST-based analysis
* Data-flow and taint analysis
* Custom security rules
* Integration with external SAST analyzers
* Detection result normalization

## Supported Languages

Initial target languages:

* JavaScript
* TypeScript
* Python

## Target Vulnerability Categories

Initial target categories:

* SQL Injection
* XSS
* Command Injection
* Path Traversal
* Hardcoded Credentials
* Improper Authentication

The final detection strategy for each category will be determined during the security-analysis research phase.

## Development Setup

### Prerequisites

* Python 3.12
* [uv](https://docs.astral.sh/uv/)

### Install Dependencies

From this directory:

```powershell
uv sync
```

`uv` creates and manages the project's virtual environment and installs the dependencies declared in `pyproject.toml`.

Do not commit the `.venv` directory.

### Run the Development Server

```powershell
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8001
```

The service will be available at:

```text
http://127.0.0.1:8001
```

### API Documentation

FastAPI provides interactive API documentation at:

```text
http://127.0.0.1:8001/docs
```

OpenAPI JSON:

```text
http://127.0.0.1:8001/openapi.json
```

Health check:

```text
http://127.0.0.1:8001/health
```

### Run Tests

```powershell
uv run pytest
```

## Project Structure

```text
security-engine/
├── src/
│   ├── analyzers/
│   ├── detectors/
│   ├── models/
│   ├── normalizers/
│   └── main.py
├── tests/
├── .python-version
├── package.json
├── pyproject.toml
├── README.md
└── uv.lock
```

The current directories are scaffolding. Their final responsibilities and implementation may change after the security-analysis research.

## Architecture

The intended high-level architecture is hybrid:

```text
Source Code
     │
     ▼
Security Engine
     │
     ├── External SAST Analyzers
     │
     └── VulnGuardian Custom Analysis
              │
              ▼
       Result Normalization
              │
              ▼
       Detection Results
```

The specific SAST tools, parsers, AST technologies, data-flow mechanisms, and custom-rule architecture have not yet been selected.

## Research Phase

Before implementing vulnerability detection, the cybersecurity team will evaluate:

* SAST tooling
* Parser and AST technologies
* Data-flow and taint analysis
* Custom rule architecture
* Hybrid analyzer architecture
* Detection result contract
* Security Engine ↔ API integration
* Testing strategy
* Performance considerations
* Security considerations

### Research Deliverable

The cybersecurity team should document its findings in:

```text
docs/security-analysis.md
```

The document should contain:

1. Objective
2. Requirements
3. Existing SAST Tool Evaluation
4. Parser / AST Evaluation
5. Data-flow / Taint Analysis
6. Custom Rule Strategy
7. Hybrid Architecture Proposal
8. Detection Result Contract
9. Execution / Integration Strategy
10. Testing Strategy
11. Security Considerations
12. Recommendation
13. Open Questions

## Important

Do not assume a particular SAST tool or analysis technology is required.

The Security Engine architecture will be finalized after the cybersecurity research is reviewed by the team.
