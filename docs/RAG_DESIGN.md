# LifeStack Grounded GenAI RAG Architecture & Safety Design

LifeStack implements an anti-hallucination, strictly grounded Retrieval-Augmented Generation (RAG) architecture. The GenAI Copilot operates as a personal decision copilot that answers real-life decision questions strictly from verifiable records.

---

## 1. Vector Store Schema & Dimensions

The vector store matches the specification in `04_pgvector_rag.sql`:

```sql
CREATE TABLE ml.doc_chunks (
    chunk_id    BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES app.users(user_id) ON DELETE CASCADE,   -- NULL = public knowledge
    source_type TEXT NOT NULL,           -- 'insight','upload','public_job','public_edu','goal','fact'
    source_ref  TEXT,                    -- e.g. 'fact_career:sde1', 'public_education_stats:cse'
    content     TEXT NOT NULL,
    metadata    JSONB DEFAULT '{}',
    embedding   vector(768) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chunks_hnsw ON ml.doc_chunks USING hnsw (embedding vector_cosine_ops);
```

- **Dimension**: 768 float numbers.
- **Index**: HNSW (Hierarchical Navigable Small World) using `vector_cosine_ops`.
- **Hybrid Search**: Cosine distance ($70\%$) combined with exact word-boundary keyword filtering ($30\%$).

---

## 2. Strict User Data Isolation Protocol

A user must **never** be able to retrieve another user's personal warehouse facts.
This is enforced at both the SQL and application layers:

```sql
-- Row Level Security (RLS) Filter
SELECT chunk_id, source_type, source_ref, content,
       1 - (embedding <=> $2::vector) AS similarity
FROM ml.doc_chunks
WHERE (user_id = $1 OR user_id IS NULL)
ORDER BY embedding <=> $2::vector
LIMIT 5;
```

- `user_id = $1`: The authenticated user's own chunk records.
- `user_id IS NULL`: Public certified open datasets (government education placement statistics, industry salary trends).
- Other users' chunks are strictly excluded from the query planner.

---

## 3. Anti-Hallucination & Explicit Refusal Guardrail

Generic LLMs tend to invent plausible-sounding answers when data is missing. LifeStack explicitly prohibits guessing.

### The Grounding Verification Algorithm:
1. **Semantic & Keyword Thresholding**:
   - Chunks must achieve a minimum hybrid similarity score $\ge 0.20$.
   - If meaningful query nouns (e.g. `["penguin", "veterinarian", "tokyo"]`) have zero whole-word overlap with the retrieved chunks, the context is treated as ungrounded.
2. **Explicit Data-Gap Refusal**:
   When grounding fails, the copilot immediately returns:
   > *"I cannot find any relevant records in your personal data warehouse or our open public datasets to answer this question. To prevent hallucination, LifeStack requires grounded personal data or public benchmarks before answering."*
   Itemizing the missing entities and directing the user to the Smart Ingestion screen.

---

## 4. Explainability & Citations Architecture

Every grounded response includes:
- **Clickable Citations**: Embedded badges like `[1]`, `[2]` linking directly to underlying row IDs (e.g., `[fact_career:sde1]`). Clicking opens a modal showing the exact chunk text, date, and source table.
- **"Why this answer?" Panel**:
  - Grounded Confidence Score ($0.0$ to $1.0$).
  - Explicit Model Assumptions (e.g. *"Assumes monthly net compensation remains constant"*).
  - Identified Data Gaps.
- **Mandatory Safety Disclaimer**: Embedded on all financial and biometric answers.
