# VulnGuardian

VulnGuardian is an AI-powered developer security platform for source-code vulnerability assessment, remediation guidance, and secure coding education.

The platform combines **static/AST analysis and machine-learning analysis for vulnerability detection**, while using AI primarily to explain findings, suggest remediation, and provide developer learning feedback.

---

## Project Flow

```text
Source Code
     ↓
Static / AST Analysis
     ↓
ML Analysis
     ↓
Finding Correlation
     ↓
CWE / OWASP Mapping
     ↓
AI Explanation & Remediation
     ↓
Pedagogical Feedback
     ↓
Security Report
```

### Important Principle

The LLM is **not the primary vulnerability detector**.

Detection is handled by the static/AST analysis and ML layers. The AI layer is responsible for explanation, remediation guidance, impact explanation, and learning recommendations.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Monaco Editor

### Backend

* NestJS
* TypeScript
* PostgreSQL
* Prisma

### ML Service

* Python
* FastAPI
* uv
* Machine-learning inference pipeline

### Security Engine

* Python
* FastAPI
* uv
* Static/AST security analysis
* Custom security analysis
* External SAST integration
* Detection result normalization

> The specific SAST tools, parser technologies, data-flow mechanisms, and custom-rule architecture are not finalized yet. These decisions will follow cybersecurity research and team review.

### Monorepo

* pnpm
* Turborepo

---

## Repository Structure

```text
VulnGuardian/
│
├── apps/
│   ├── web/                  # React frontend
│   ├── api/                  # NestJS backend
│   ├── ml-service/           # Python + FastAPI ML service
│   └── security-engine/      # Python + FastAPI security analysis engine
│
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript configuration
│
├── infrastructure/           # Infrastructure and deployment configuration
│
├── docs/                     # Project documentation
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

---

## Initial Vulnerability Coverage

The initial version of VulnGuardian focuses on:

* SQL Injection
* Cross-Site Scripting (XSS)
* Command Injection
* Path Traversal
* Hardcoded Credentials
* Improper Authentication

### Initial Languages

* JavaScript
* TypeScript
* Python

The architecture is designed so additional languages and vulnerability categories can be added later.

---

# Getting Started

## Prerequisites

Install the following:

* Node.js
* pnpm
* Python 3.12+
* uv
* Docker Desktop

PostgreSQL is provided through the project's Docker infrastructure.

Verify your installations:

```bash
node --version
pnpm --version
python --version
uv --version
docker --version
```

---

## Clone the Repository

```bash
git clone https://github.com/naveenjangid178/VulnGuardian.git

cd VulnGuardian
```

---

## Install Dependencies

Install the monorepo JavaScript/TypeScript dependencies from the repository root:

```bash
pnpm install
```

Python services manage their own environments with `uv`.

### ML Service

```bash
cd apps/ml-service
uv sync
cd ../..
```

### Security Engine

```bash
cd apps/security-engine
uv sync
cd ../..
```

`uv sync` creates the service's local `.venv` and installs the dependencies declared by that service.

Do **not** commit `.venv` directories.

---

## Environment Variables

Create the required environment files for the services you are working on.

Do **not** commit:

* Secrets
* Passwords
* API keys
* JWT secrets
* Access tokens
* Production credentials

Example:

```text
DATABASE_URL=...
JWT_SECRET=...
```

The exact environment variables will be documented as the corresponding modules are implemented.

---

# Running the Project

From the repository root:

```bash
pnpm dev
```

Turborepo starts the development applications that expose a `dev` script.

Current development services include:

### Web

```text
http://localhost:5173
```

### API

```text
http://localhost:3000
```

### ML Service

```text
http://localhost:8000
```

### Security Engine

```text
http://localhost:8001
```

The ML Service and Security Engine expose health endpoints:

```text
GET /health
```

The Security Engine also currently exposes the analysis endpoint:

```text
POST /analyze
```

The `/analyze` endpoint currently provides the analysis integration boundary and returns normalized detection results. Actual vulnerability detection will be implemented after the security-analysis architecture is finalized.

---

# Testing

Run tests for a specific workspace with pnpm:

```bash
pnpm --filter security-engine test
```

The Security Engine can also be tested directly with:

```bash
cd apps/security-engine
uv run pytest
```

Run a Turbo task for the Security Engine:

```bash
pnpm turbo run test --filter=security-engine
```

As additional applications introduce tests, the root Turborepo configuration can run their test tasks consistently.

---

# Development Architecture

VulnGuardian is developed incrementally.

```text
Foundation
   ↓
Authentication
   ↓
Project Management
   ↓
Code Management + Monaco
   ↓
Static Analysis Engine
   ↓
ML Service
   ↓
Finding Correlation
   ↓
CWE / OWASP Mapping
   ↓
AI Security Mentor
   ↓
Dashboard + Reports
   ↓
Testing + Security
   ↓
Production Deployment
```

Each major stage should be integrated and stable before moving to the next stage.

---

# Security Engine Architecture

The Security Engine is a dedicated analysis application within the monorepo.

Its intended architecture is hybrid:

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

The specific SAST tools, parsers, AST technologies, data-flow mechanisms, and custom-rule architecture are intentionally not finalized yet.

These decisions will be documented through the cybersecurity research phase.

### Research Deliverable

The cybersecurity team should document the analysis architecture in:

```text
docs/security-analysis.md
```

The research should cover:

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

---

# Development Rules

### 1. Keep the architecture modular

New functionality should be implemented inside the appropriate application or module rather than creating unnecessary services.

### 2. Treat source code as untrusted input

Submitted code must never be executed directly inside the main API or frontend environment.

### 3. Do not use the LLM as the source of truth for vulnerability detection

AI explanations should be based on actual findings produced by the analysis pipeline.

### 4. Never fabricate security findings or ML predictions

Every reported vulnerability must originate from an actual analysis result.

### 5. Preserve the existing architecture

Before adding a feature, understand the current implementation and integrate with the existing structure.

### 6. Keep changes focused

Avoid unrelated refactoring when implementing a feature.

### 7. Keep service dependencies isolated

Node.js dependencies are managed through pnpm/Turborepo.

Python service dependencies are managed independently through uv within each Python service.

---

# Git Workflow

Create a feature branch before working on a task:

```bash
git checkout -b feature/<feature-name>
```

Example:

```bash
git checkout -b feature/authentication
```

Commit changes with clear messages:

```bash
git add .
git commit -m "feat: add authentication foundation"
```

Push the branch:

```bash
git push -u origin feature/authentication
```

Pull requests should be reviewed before merging into `main`.

---

# Contributing

Before starting work:

1. Pull the latest `main` branch.
2. Create a feature branch.
3. Understand the relevant module and architecture.
4. Install the dependencies required by that module.
5. Implement the assigned task.
6. Test your changes.
7. Commit with a clear message.
8. Push your branch.
9. Open a pull request.

Keep PRs focused on one logical feature or change.

---

# License

License information will be added as the project progresses.
