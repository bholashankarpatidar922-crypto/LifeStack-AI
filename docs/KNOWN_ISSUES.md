# Known Issues & Environmental Mitigations

This document tracks known runtime limitations and verified workarounds.

| Issue ID | Component | Description | Mitigation / Fallback Implemented |
| :--- | :--- | :--- | :--- |
| **ISSUE-001** | Docker | Docker engine is not installed or available in PATH on the host development environment. | Implemented standalone local Python virtual environment + Node dev servers; provided full `docker-compose.yml` and Dockerfiles for CI/CD and cloud deployment. |
| **ISSUE-002** | pgvector Local Extension | Standard local SQLite or non-pgvector Postgres setups lack the `vector` C extension. | Provided dual-mode vector backend: high-performance in-memory / SQLite NumPy cosine search for dev/test, and native PostgreSQL HNSW indexing (`04_pgvector_rag.sql`) for pgvector-enabled clouds. |
| **ISSUE-003** | Cloud OCR Dependency | System Tesseract OCR binary may not be pre-installed on every developer machine. | Provided pluggable OCR engine with structured fallback parser that extracts tabular statement data reliably even without system tesseract binaries. |
