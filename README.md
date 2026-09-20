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

### Monorepo

* pnpm
* Turborepo

---

## Repository Structure

```text
VulnGuardian/
│
├── apps/
│   ├── web/              # React frontend
│   ├── api/              # NestJS backend
│   └── ml-service/       # Python + FastAPI ML service
│
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/# Shared TypeScript configuration
│
├── infrastructure/       # Infrastructure and deployment configuration
│
├── docs/                 # Project documentation
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
* PostgreSQL

Verify your installations:

```bash
node --version
pnpm --version
python --version
uv --version
```

---

## Clone the Repository

```bash
git clone https://github.com/naveenjangid178/VulnGuardian
cd VulnGuardian
```

Install JavaScript/TypeScript dependencies:

```bash
pnpm install
```

---

## Environment Variables

Create the required environment files for the services you are working on.

Do **not** commit secrets, passwords, API keys, tokens, or production credentials.

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

Turborepo starts the development applications together.

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

The ML service exposes a health endpoint:

```text
GET /health
```

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

# Development Rules

### 1. Keep the architecture modular

New functionality should be implemented inside the appropriate application/module rather than creating unnecessary services.

### 2. Treat source code as untrusted input

Submitted code must never be executed directly inside the main API or frontend environment.

### 3. Do not use the LLM as the source of truth for vulnerability detection

AI explanations should be based on actual findings produced by the analysis pipeline.

### 4. Never fabricate security findings or ML predictions

Every reported vulnerability must originate from an actual analysis result.

### 5. Preserve existing architecture

Before adding a feature, understand the current implementation and integrate with the existing structure.

### 6. Keep changes focused

Avoid unrelated refactoring when implementing a feature.

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
4. Implement the assigned task.
5. Test your changes.
6. Commit with a clear message.
7. Push your branch.
8. Open a pull request.

Keep PRs focused on one logical feature or change.

---

# License

License information will be added as the project progresses.
