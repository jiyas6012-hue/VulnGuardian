# VulnGuardian Database Setup

This document explains how to set up the VulnGuardian PostgreSQL database locally, run Prisma migrations, generate Prisma Client, and verify the database using Prisma Studio.

---

## 1. Database Stack

VulnGuardian uses:

* PostgreSQL 16
* Docker
* Docker Compose
* Prisma ORM
* Prisma Migrate
* Prisma Studio

The PostgreSQL database is used by the NestJS API.

---

## 2. Prerequisites

Before setting up the database, make sure the following are installed:

* Docker
* Node.js
* pnpm

Verify the installations:

```powershell
node --version
pnpm --version
docker --version
docker compose version
```

---

## 3. Start PostgreSQL

VulnGuardian uses PostgreSQL 16 through Docker Compose.

The PostgreSQL service is defined in the repository root:

```text
docker-compose.yml
```

From the repository root, run:

```powershell
docker compose up -d
```

The PostgreSQL configuration is:

| Setting   | Value                                     |
| --------- | ----------------------------------------- |
| Container | `vulnguardian-postgres`                   |
| Image     | `postgres:16`                             |
| Database  | `vulnguardian`                            |
| Username  | `vulnguardian`                            |
| Password  | `vulnguardian_dev`                        |
| Port      | `5432`                                    |
| Volume    | `vulnguardian_vulnguardian_postgres_data` |

The database data is persisted using a Docker volume.

This means stopping or recreating the PostgreSQL container does not remove the database data unless the volume is explicitly deleted.

---

## 4. Verify PostgreSQL

Check that the PostgreSQL container is running:

```powershell
docker ps
```

You should see:

```text
vulnguardian-postgres
```

with port `5432` exposed.

Example:

```text
CONTAINER ID   IMAGE         STATUS         PORTS
xxxxxxxxxxxx   postgres:16   Up ...         0.0.0.0:5432->5432/tcp
```

You can also check the PostgreSQL logs:

```powershell
docker logs vulnguardian-postgres
```

A successful startup should contain:

```text
database system is ready to accept connections
```

---

## 5. Configure the Database Environment Variable

The NestJS API uses the `DATABASE_URL` environment variable to connect to PostgreSQL.

Create the following file:

```text
apps/api/.env
```

Add:

```env
DATABASE_URL="postgresql://vulnguardian:vulnguardian_dev@localhost:5432/vulnguardian?schema=public"
```

### Important

Do not commit `.env` files containing local credentials to Git.

Make sure `.env` is included in the repository's `.gitignore`.

---

## 6. Prisma Configuration

The Prisma schema is located at:

```text
apps/api/prisma/schema.prisma
```

The Prisma configuration file is:

```text
apps/api/prisma7.config.ts
```

Prisma uses the `DATABASE_URL` environment variable from the API `.env` file to connect to PostgreSQL.

The Prisma schema uses PostgreSQL as its database provider.

---

## 7. Install Dependencies

From the repository root:

```powershell
pnpm install
```

This installs the dependencies for the monorepo.

---

## 8. Navigate to the API

Prisma commands for the API database are executed from:

```text
apps/api
```

Run:

```powershell
cd apps/api
```

---

## 9. Validate the Prisma Schema

Before running migrations, validate the Prisma schema:

```powershell
pnpm exec prisma validate
```

A successful validation should report:

```text
The schema at prisma\schema.prisma is valid
```

---

## 10. Run Database Migrations

Run:

```powershell
pnpm exec prisma migrate dev
```

For a fresh database, Prisma applies all migrations that have been committed to the repository.

The migration files are stored in:

```text
apps/api/prisma/migrations/
```

The initial migration is currently:

```text
apps/api/prisma/migrations/
└── 20260921185845_init/
    └── migration.sql
```

After a successful migration, Prisma should report that the database is in sync with the Prisma schema.

### Important

Prisma migration files are part of the source code and **must be committed to Git**.

Team members should use the existing migration history instead of manually creating the database tables.

---

## 11. Generate Prisma Client

After applying migrations, generate the Prisma Client:

```powershell
pnpm exec prisma generate
```

The Prisma Client output location is configured in:

```text
apps/api/prisma/schema.prisma
```

---

## 12. Verify the Database with Prisma Studio

Run:

```powershell
pnpm exec prisma studio
```

Prisma Studio provides a browser-based interface for viewing and managing the local development database.

The following models should be available:

```text
User
Project
ProjectMember
SourceSnapshot
SourceFile
Scan
DetectionResult
Finding
Vulnerability
CWE
VulnerabilityCWE
OWASPCategory
VulnerabilityOWASP
AIFeedback
Report
```

At this stage, most tables will be empty because the application modules that create users, projects, scans, findings, and reports have not been implemented yet.

Empty tables are expected.

---

## 13. Database Schema Overview

The current database follows this structure:

```text
User
 │
 ├── ProjectMember
 │
 └── Project
      │
      ├── SourceSnapshot
      │     └── SourceFile
      │
      └── Scan
            ├── DetectionResult
            ├── Finding
            │     ├── Vulnerability
            │     │      ├── CWE
            │     │      └── OWASP
            │     │
            │     └── AIFeedback
            │
            └── Report
```

### Source Code Storage

Source code itself is not intended to be stored directly as large text fields in PostgreSQL.

The architecture uses object storage such as MinIO/S3 for source files and generated reports.

PostgreSQL stores the metadata and object-storage references required by the application.

---

## 14. Database Setup Workflow for Team Members

After cloning the repository, follow these steps.

### Step 1 — Install dependencies

From the repository root:

```powershell
pnpm install
```

### Step 2 — Create the API environment file

Create:

```text
apps/api/.env
```

Add:

```env
DATABASE_URL="postgresql://vulnguardian:vulnguardian_dev@localhost:5432/vulnguardian?schema=public"
```

### Step 3 — Start PostgreSQL

From the repository root:

```powershell
docker compose up -d
```

### Step 4 — Verify PostgreSQL

```powershell
docker ps
```

Make sure:

```text
vulnguardian-postgres
```

is running.

### Step 5 — Navigate to the API

```powershell
cd apps/api
```

### Step 6 — Validate the Prisma schema

```powershell
pnpm exec prisma validate
```

### Step 7 — Apply database migrations

```powershell
pnpm exec prisma migrate dev
```

### Step 8 — Generate Prisma Client

```powershell
pnpm exec prisma generate
```

### Step 9 — Verify the database

```powershell
pnpm exec prisma studio
```

The Prisma Studio interface should display all database models listed above.

---

## 15. Pulling New Database Changes

When another team member adds a new Prisma migration, pull the latest changes:

```powershell
git pull
```

Then navigate to the API:

```powershell
cd apps/api
```

Apply the new migrations:

```powershell
pnpm exec prisma migrate dev
```

Then regenerate Prisma Client:

```powershell
pnpm exec prisma generate
```

Prisma will apply any migrations that have not yet been applied to the local database.

---

## 16. Important Migration Rules

### Do

* Commit Prisma migration files.
* Use Prisma migrations for database schema changes.
* Keep `schema.prisma` and the migration history consistent.
* Run migrations after pulling database changes.
* Run `prisma generate` after schema changes.
* Review database changes before committing them.

### Do not

* Delete existing committed migrations.
* Manually create database tables outside Prisma.
* Modify an existing migration that has already been committed and used by the team.
* Commit `.env` files containing credentials.
* Store large source-code files directly inside PostgreSQL without an architectural reason.

---

## 17. Useful Docker Commands

### Start PostgreSQL

From the repository root:

```powershell
docker compose up -d
```

### Stop PostgreSQL

```powershell
docker compose stop
```

### Start PostgreSQL again

```powershell
docker compose start
```

### View running containers

```powershell
docker ps
```

### View PostgreSQL logs

```powershell
docker logs vulnguardian-postgres
```

### Follow PostgreSQL logs

```powershell
docker logs -f vulnguardian-postgres
```

Press `Ctrl + C` to stop following the logs.

### Stop and remove the PostgreSQL container

```powershell
docker compose down
```

This removes the PostgreSQL container and Compose network but keeps the database volume.

### Stop the container and delete the database volume

**Warning: This permanently deletes the local PostgreSQL database data.**

```powershell
docker compose down -v
```

Use this only when a completely fresh local database is intentionally required.

After deleting the volume, recreate the database with:

```powershell
docker compose up -d
```

and then run:

```powershell
cd apps/api
pnpm exec prisma migrate dev
```

---

## 18. Current Database Status

The initial database schema has been successfully:

1. Defined in Prisma.
2. Validated with Prisma.
3. Migrated to PostgreSQL.
4. Tested with PostgreSQL 16 running in Docker.
5. Reproduced using Docker Compose.
6. Verified through Prisma Studio.

The current initial migration is:

```text
apps/api/prisma/migrations/
└── 20260921185845_init/
    └── migration.sql
```

The local PostgreSQL service is managed through:

```text
docker-compose.yml
```

The database connection is configured through:

```text
apps/api/.env
```

The Prisma schema is:

```text
apps/api/prisma/schema.prisma
```

The Prisma configuration is:

```text
apps/api/prisma7.config.ts
```

---

## 19. Quick Setup Reference

For experienced team members, the complete setup is:

```powershell
# From repository root
pnpm install

# Start PostgreSQL
docker compose up -d

# Navigate to API
cd apps/api

# Validate Prisma schema
pnpm exec prisma validate

# Apply migrations
pnpm exec prisma migrate dev

# Generate Prisma Client
pnpm exec prisma generate

# Open database UI
pnpm exec prisma studio
```

If Prisma Studio displays the expected models and PostgreSQL is running successfully, the local database setup is complete.
