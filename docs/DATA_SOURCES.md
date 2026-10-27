# Data Sources & Public Datasets Registry

LifeStack strictly prohibits unauthorized web scraping. All public data is drawn from open-licensed government/institutional portals or deterministically synthesized and labeled.

| Dataset Name | Domain | License / Terms | Source / Origin | Usage in LifeStack |
| :--- | :--- | :--- | :--- | :--- |
| **National Higher Education & Placement Trends** | Academics / Career | Open Government Data (OGD) / CC-BY 4.0 | Synthesized from open statistical distributions (AICTE / Ministry of Education reports) | Joined with user GPA & branch to predict placement outcomes in Copilot & Simulator |
| **Consumer Spending & Inflation Benchmark** | Finance / Macro | Public Domain / CC-BY 4.0 | RBI / World Bank Open Data baseline parameters | Peer benchmark comparisons for savings rate, inflation-adjusted cost of living |
| **Occupational Salary & Tech Hiring Indices** | Career | Open Data License | NASSCOM / Bureau of Labor Statistics open aggregates | Job market demand forecasting by role & city tier |
| **LifeStack Synthetic Benchmark Cohort** | Multi-domain | Proprietary / MIT (Project-generated) | Seed generator with seed `42` producing 500 peer profiles | Used for $k$-anonymity peer comparison ($k \ge 10$) and persona clustering |
| **LifeStack Primary Demo User Dataset** | Multi-domain | MIT (Project-generated) | Seed generator with 3 years of daily events | Demo user (`demo@lifestack.ai`) with realistic anomalies and seasonality |

All data points in synthetic tables are explicitly flagged with `is_synthetic = true`.
