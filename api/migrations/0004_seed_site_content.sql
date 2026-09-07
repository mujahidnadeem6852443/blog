-- Seeded from the user's existing portfolio (mujahidnadeem6852443.github.io) and
-- gym-log README, at their explicit request. Editable afterward from /admin.

INSERT INTO site_content (page, data, updated_at) VALUES ('home', '{"name":"Mohammad Mujahid Nadeem","title":"Data & Cloud Engineer","tagline":"Data Architecture • Cloud Pipelines • Analytics Engineering • Modern Data Platforms","bio":"I am a Cloud & Data Engineer with 1.5 years of hands-on experience across AWS, Azure, and Google Cloud. I build large-scale ETL/ELT pipelines, cloud data platforms, and analytics workflows using Python and SQL."}', 1788761808)
  ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;

INSERT INTO site_content (page, data, updated_at) VALUES ('about', '{"bio":"I am a Cloud & Data Engineer with 1.5 years of hands-on experience across AWS, Azure, and Google Cloud. I build large-scale ETL/ELT pipelines, cloud data platforms, and analytics workflows using Python and SQL.","pillars":[{"title":"Engineering Mindset","description":"I design reliable, scalable cloud-native systems."},{"title":"Systems Thinking","description":"I work across the full lifecycle: ingestion, modeling, orchestration, and analytics."},{"title":"Execution Focus","description":"I build clean, modern production pipelines with precision."}],"skills":["Python","SQL","AWS","Azure","GCP","Databricks","Spark","Kafka","Airflow","Fabric","Power BI","Git","GitHub","Docker","Kubernetes"],"education":[{"institution":"FAST-NUCES","degree":"Bachelor''s in Computer Science","start":"2019","end":"2024"},{"institution":"Forman Christian College (FCC)","degree":"FSc Pre-Engineering","start":"2017","end":"2019"}]}', 1788761808)
  ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;

INSERT INTO site_content (page, data, updated_at) VALUES ('experience', '{"items":[{"role":"Data Engineer","company":"Alphabridge","start":"Apr 2025","end":"Present","description":"Building multi-cloud data platforms, ETL pipelines, and analytics architecture across AWS, Azure & GCP."},{"role":"Data Analyst","company":"WIBS Enterprises Pvt Ltd","start":"Jan 2024","end":"Apr 2024","description":"Built dashboards in Power BI, automated SQL reporting, and implemented visualization best practices."}]}', 1788761808)
  ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;

INSERT INTO site_content (page, data, updated_at) VALUES ('projects', '{"items":[{"title":"Python ETL Pipeline","description":"End-to-end ETL pipeline with validation and transformation logic.","link":"https://github.com/mujahidnadeem6852443/python-local-etl-pipeline"},{"title":"Retail SQL Analytics","description":"Insight-rich SQL queries with aggregations and window functions.","link":"https://github.com/mujahidnadeem6852443/retail-sql-analytics"},{"title":"Docker + Kubernetes Pipeline","description":"Distributed log pipeline with Dockerized microservices.","link":"https://github.com/mujahidnadeem6852443/realtime-log-pipeline"}]}', 1788761808)
  ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;

INSERT INTO site_content (page, data, updated_at) VALUES ('contact', '{"email":"mujahidnadeem6@gmail.com","linkedin":"https://pk.linkedin.com/in/mujahid-nadeem-malik-b6bb431b2","github":"https://github.com/mujahidnadeem6852443"}', 1788761808)
  ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;

