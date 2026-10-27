#!/bin/bash
# =====================================================================
# LifeStack — Google Cloud Platform Deployment Script
# Provisions Cloud SQL (Postgres 16 + pgvector), Cloud Storage,
# Artifact Registry, Cloud Run services, and Cloud Scheduler.
# =====================================================================

set -e

PROJECT_ID=${GCP_PROJECT_ID:-"lifestack-production"}
REGION=${GCP_REGION:-"asia-south1"} # Mumbai, India
DB_INSTANCE_NAME="lifestack-pg-instance"
AR_REPO="lifestack-containers"

echo "=========================================================="
echo "Deploying LifeStack to Google Cloud Platform ($REGION)"
echo "Project ID: $PROJECT_ID"
echo "=========================================================="

# 1. Enable Required GCP APIs
echo "1. Enabling GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  --project "$PROJECT_ID"

# 2. Create Artifact Registry
echo "2. Setting up Artifact Registry..."
gcloud artifacts repositories create "$AR_REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="LifeStack container repository" \
  --project "$PROJECT_ID" || true

# 3. Create Cloud Storage Bucket for Bronze Layer
echo "3. Creating Cloud Storage bucket for raw data ingestion..."
gsutil mb -p "$PROJECT_ID" -l "$REGION" -b on "gs://lifestack-bronze-$PROJECT_ID" || true

# 4. Create Cloud SQL (PostgreSQL 16) with pgvector
echo "4. Provisioning Cloud SQL PostgreSQL 16..."
gcloud sql instances create "$DB_INSTANCE_NAME" \
  --database-version=POSTGRES_16 \
  --tier=db-custom-2-7680 \
  --region="$REGION" \
  --storage-type=SSD \
  --storage-size=20GB \
  --project "$PROJECT_ID" || true

# Enable pgvector extension flag
gcloud sql instances patch "$DB_INSTANCE_NAME" \
  --database-flags="cloudsql.enable_pgvector=on" \
  --project "$PROJECT_ID"

# 5. Build and Push Containers
echo "5. Building and pushing container images..."
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/api:latest" -f infra/Dockerfile.api .
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/web:latest" -f infra/Dockerfile.web .

# 6. Deploy API to Cloud Run
echo "6. Deploying API to Cloud Run..."
gcloud run deploy lifestack-api \
  --image "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/api:latest" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "ENVIRONMENT=production,VECTOR_BACKEND=pgvector" \
  --project "$PROJECT_ID"

# 7. Deploy Web Frontend to Cloud Run
echo "7. Deploying Web to Cloud Run..."
gcloud run deploy lifestack-web \
  --image "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/web:latest" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --project "$PROJECT_ID"

echo "=========================================================="
echo "LifeStack GCP Deployment Complete!"
echo "=========================================================="
