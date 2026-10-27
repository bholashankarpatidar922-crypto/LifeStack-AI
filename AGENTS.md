# LifeStack Agent Rules (Standing Rules)

- Work autonomously; add any missing dependency, file, config, test, asset or doc yourself.
- Log every non-trivial decision in docs/DECISIONS.md.
- Never commit secrets; use .env.example.
- Only permissive licenses; update THIRD_PARTY_NOTICES.md whenever a dependency or asset is added.
- No web scraping; only open-licensed or synthetic data, sources recorded in docs/DATA_SOURCES.md.
- No copying of any existing product's design, text or code.
- Every AI answer must be grounded in retrieved data, cite sources, and show a not-professional-advice disclaimer for money/health topics.
- Never leak data across users; cross-user stats must be anonymized with k >= 10.
- After each phase: run tests, run the app, verify in the browser, fix failures, then continue.
- Brand Name: "LifeStack" is maintained in a central configuration constant (`BRAND_NAME`) to allow easy rebranding if trademark check requires it.
- Zero-friction execution: Provide full local development and standalone execution without requiring paid credentials or Docker daemon (with Docker Compose provided for production and container deployment).
