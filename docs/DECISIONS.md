# Architecture & Technical Decisions Log

This document records architectural decisions made autonomously during the lifecycle of LifeStack, including context, reasons, and evaluated alternatives.

---

### DEC-001: Monorepo Structure and Dual-Engine Storage Architecture
- **Date**: 2026-10-25
- **Decision**: Structure repository with `apps/api` (FastAPI), `apps/web` (React/Vite/TypeScript), `pipelines` (ETL), `ml` (data mining), and `docs`. Support a dual-engine database layer: native SQLite (via `aiosqlite`) for local zero-dependency development/testing and PostgreSQL 16 + `pgvector` for production/containerized deployment.
- **Reason**: The local development machine does not have Docker installed or running in the environment PATH. Adopting an engine abstraction ensures the platform runs cleanly out-of-the-box on any machine without blocking, while strictly maintaining full compatibility with the production pgvector SQL script (`04_pgvector_rag.sql`).
- **Alternative**: Forcing PostgreSQL/Docker requirement would halt local execution on hosts without Docker.

---

### DEC-002: Centralized Brand Configuration for Trademark Protection
- **Date**: 2026-10-25
- **Decision**: Place the brand name "LifeStack" in centralized constants (`BRAND_NAME` in backend config and frontend environment/brand config).
- **Reason**: Protects against trademark conflicts. If a trademark search or domain availability check necessitates rebranding, the application identity can be renamed across the entire stack in one place.
- **Alternative**: Hardcoding the brand name string across dozens of views and API messages.

---

### DEC-003: Pluggable Multi-Provider GenAI & Offline Mock Adapter
- **Date**: 2026-10-25
- **Decision**: Implement a unified `LLMAdapter` interface supporting Google Gemini, Anthropic Claude, OpenAI, and a deterministic offline `MockLLMAdapter`.
- **Reason**: Allows instant end-to-end execution, testing, and UI evaluation without requiring paid API keys or exposing developers to network failures during offline development.
- **Alternative**: Tight coupling to a single cloud provider.

---

### DEC-004: Dual-Vector Backend (In-Memory/NumPy Cosine vs pgvector HNSW)
- **Date**: 2026-10-25
- **Decision**: Provide an abstract `VectorStore` interface with a pgvector implementation matching `04_pgvector_rag.sql` and a local NumPy cosine-similarity fallback for zero-dependency local runs.
- **Reason**: Guarantees RAG and vector queries function seamlessly both in standalone Python test environments and on pgvector-enabled clouds (Supabase, Neon, Cloud SQL, AlloyDB).
- **Alternative**: Failing RAG tests whenever pgvector extension is absent.

---

### DEC-005: Granular DPDP Act 2023 / GDPR Compliance Architecture
- **Date**: 2026-10-25
- **Decision**: Build user privacy directly into the data model with per-category consent flags (`spending`, `health`, `academics`, `career`), audit logging for data access, single-click JSON/CSV data export, and full account erasure cascades. Peer benchmarking enforces $k \ge 10$ minimum cohort anonymity.
- **Reason**: Regulatory compliance and user trust in personal decision intelligence.
- **Alternative**: Coarse-grained monolithic terms acceptance.
