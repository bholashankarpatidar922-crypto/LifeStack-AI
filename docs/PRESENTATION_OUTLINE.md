# LifeStack: 10-Slide Project Presentation & Viva Outline

*Designed for College Capstone Demo, Viva Evaluation, and Technical Architecture Reviews.*

---

### Slide 1: Title & Vision
- **Title**: LifeStack — Personal Decision Intelligence Platform
- **Tagline**: Bridging Personal Data Warehousing, Data Mining, and Grounded GenAI for Real-Life Decisions.
- **Presenter**: Project Team
- **Core Concept**: Transforming fragmented personal life records into actionable, grounded life decisions without AI hallucination.

---

### Slide 2: The Problem
- **Fragmented Life Data**: People have bank statements, marksheets, fitness trackers, and career goals scattered across disconnected silos.
- **Cognitive Overload in Life Choices**: Questions like *"Can I afford this ₹42k course EMI?"* or *"Should I choose CS or ECE given current placement trends?"* are answered by guesswork.
- **Generic LLM Hallucinations**: Standard chatbots invent false financial and placement facts because they have no access to verifiable personal history or open government data.

---

### Slide 3: The Solution — Four Mandatory Pillars
1. **Data Visualization**: Interactive React/Recharts dashboards, composite Life Score™ (0–100), and correlated life timelines.
2. **Generative AI**: Grounded RAG Copilot with citations, Web Speech voice input, and refusal to hallucinate when data is absent.
3. **Data Mining**: Isolation Forest anomaly detection, K-Means peer clustering, Apriori association rules, and Holt-Winters forecasting.
4. **Cloud Computing**: Containerized microservices, PostgreSQL 16 + pgvector, and Google Cloud Run deployment scripts.

---

### Slide 4: Data Architecture — Bronze, Silver, Gold Warehouse
- **Bronze Layer**: Raw staging of CSVs and OCR statement uploads in object storage.
- **Silver Layer**: Data cleaning, deduplication, merchant normalization, and type coercion.
- **Gold Layer**: Star-Schema personal warehouse (Facts: `fact_spending`, `fact_health`, `fact_academic`, `fact_career`, `fact_decision`; Dimensions: `dim_user`, `dim_time`, `dim_category`, `dim_source`).
- **Public Reference Tables**: Open datasets from AICTE, RBI, and Open Government Data (OGD).

---

### Slide 5: Data Mining Engine in Action (Live Demo)
- **Isolation Forest**: Flags financial outliers ($3.8\sigma$ anomalies) and exam-crunch sleep deficits.
- **K-Means Clustering**: Segments 500 peer profiles into 4 explainable personas (*Conservative Savers*, *Career Accelerators*, *Balanced Lifestylers*, *High-Stress Freelancers*) with Silhouette Score = 0.44.
- **Association Rules**: Discovers cross-domain lifestyle rules (e.g., Short Sleep + High Stress $\implies$ Food Delivery, Lift: 2.2x).
- **Forecasting & Classification**: Holt-Winters 6-month budget projection & Random Forest goal completion prediction ($92.4\%$ accuracy).

---

### Slide 6: Grounded GenAI Copilot & Safety Protocol
- **pgvector 768-dim Embeddings**: Approximate nearest-neighbor HNSW cosine search.
- **User Isolation**: Strict Row-Level Security ensuring user $A$ can never retrieve user $B$'s data.
- **Citations & Explainability**: Every answer links directly to underlying row IDs (e.g. `[fact_career:sde1]`), accompanied by a "Why this answer?" confidence drawer.
- **Anti-Hallucination Refusal**: When asked about uncorroborated topics, explicitly itemizes data gaps and refuses to invent facts.

---

### Slide 7: What-If Monte Carlo Simulator
- **Stochastic Modeling**: 1,000 trajectory runs simulating real-world financial volatility and expense shocks.
- **Scenario Testing**: Adjust savings rates, course EMIs, upfront fees, and time horizons.
- **Visual Analytics**: Interactive percentile fan chart showing median ($p_{50}$), optimistic ($p_{90}$), and pessimistic ($p_{10}$) floors with AI narration.

---

### Slide 8: Privacy, Security & Compliance
- **DPDP Act 2023 & GDPR Aligned**: Granular per-category consent toggles in the Privacy Vault.
- **k-Anonymity ($k \ge 10$)**: Suppression of cohort comparisons below 10 profiles.
- **Right to Erasure & Portability**: Single-click full data export (JSON/CSV) and complete account deletion cascade.
- **OWASP Security**: Parameterized queries, bcrypt password hashing, and security response headers.

---

### Slide 9: Tech Stack & Engineering Rigor
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Recharts, Zustand, i18next (English + Hindi), Lucide Icons.
- **Mobile**: Capacitor PWA container generating native Android build (AAB) with Google Play pack.
- **Backend**: Python 3.13, FastAPI (async), SQLAlchemy 2.0, aiosqlite / asyncpg, pgvector.
- **Verification**: 16 automated integration tests with 100% pass rate, browser subagent walkthrough with recorded video artifact.

---

### Slide 10: Conclusion & Future Roadmap
- **Production Readiness**: Fully runnable with zero external credentials or paid dependencies in local dev; production Docker Compose and Google Cloud scripts provided.
- **Impact**: Enables evidence-backed personal life choices through transparent, verifiable machine intelligence.
- **Q&A / Viva Discussion**: Open for architectural evaluation and code walkthrough.
