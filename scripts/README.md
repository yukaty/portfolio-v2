# GCP Deployment Setup

Quick guide for deploying portfolio to Google Cloud Run using Workload Identity Federation.

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Post-Deployment Manual Steps](#post-deployment-manual-steps)
  - [1. Enable Public Access](#1-enable-public-access)
  - [2. Update CORS Configuration](#2-update-cors-configuration)
  - [3. Update GitHub Secret](#3-update-github-secret)
- [Troubleshooting](#troubleshooting)
  - [403 Forbidden Error](#403-forbidden-error)
  - [CORS Error (Failed to fetch)](#cors-error-failed-to-fetch)
  - [Secret Manager Access Error](#secret-manager-access-error)
- [Architecture](#architecture)
- [Resource Cleanup](#resource-cleanup)

## Prerequisites

- Google Cloud project created
- gcloud CLI installed and authenticated (`gcloud auth login`)
- Gemini API key obtained

## Quick Start

1. **Run setup script** - Automates infrastructure creation
   ```bash
   cd scripts
   chmod +x setup-gcp.sh
   ./setup-gcp.sh
   ```

2. **Set your Gemini API Key**
  Update the placeholder with your actual Gemini API key:
  ```bash
  echo -n 'YOUR_GEMINI_API_KEY' | gcloud secrets versions add google-api-key --data-file=-
  ```

3. **Add GitHub Secrets** (values displayed by script output)

4. **Push code to trigger deployment**
   ```bash
   git push origin main
   ```

5. **Complete post-deployment steps** (see [Post-Deployment Manual Steps](#post-deployment-manual-steps))
   - Enable public access to Cloud Run services
   - Update CORS configuration
   - Update VITE_API_URL GitHub Secret

**Note**: The setup script provides all necessary commands and values.

## Post-Deployment Manual Steps

These steps must be completed **after** the first deployment:

### 1. Enable Public Access

```bash
# Backend
gcloud run services add-iam-policy-binding portfolio-backend \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --member='allUsers' \
  --role='roles/run.invoker'

# Frontend
gcloud run services add-iam-policy-binding portfolio-frontend \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --member='allUsers' \
  --role='roles/run.invoker'
```

### 2. Update CORS Configuration

```bash
# Get frontend URL
FRONTEND_URL=$(gcloud run services describe portfolio-frontend \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --format='value(status.url)')

# Update backend CORS
gcloud run services update portfolio-backend \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --update-env-vars="ALLOWED_ORIGINS=${FRONTEND_URL}"
```

### 3. Update GitHub Secret

Get backend URL and update `VITE_API_URL` in GitHub Secrets:

```bash
gcloud run services describe portfolio-backend \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --format='value(status.url)'
```

Then redeploy frontend: `git commit --allow-empty -m "chore: update frontend with backend URL" && git push`

## Troubleshooting

### 403 Forbidden Error

**Symptom**: Cannot access Cloud Run service URLs

**Cause**: Public access not enabled

**Solution**: See [Post-Deployment Manual Steps](#2-enable-public-access)

### CORS Error (Failed to fetch)

**Symptom**: Frontend cannot communicate with backend

**Cause**: Backend not allowing frontend URL

**Solution**: See [Post-Deployment Manual Steps](#3-update-cors-configuration)

### Secret Manager Access Error

**Symptom**: Backend fails to start with "Permission denied on secret"

**Cause**: Service Account lacks Secret Manager access

**Solution**:
```bash
gcloud secrets add-iam-policy-binding google-api-key \
  --project="$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Restart service to apply changes
gcloud run services update portfolio-backend \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --update-labels=restart-time=$(date +%s)
```

## Architecture

**Authentication Flow:**
```
GitHub Actions (OIDC token)
  ↓ Workload Identity Federation (keyless auth)
Service Account (github-deployer)
  ↓
  ├─→ Artifact Registry (push Docker images)
  ├─→ Cloud Run (deploy services)
  └─→ Secret Manager (access API keys)
```

**Resources Created by Setup Script:**

| Resource | Purpose |
|----------|---------|
| Artifact Registry | Docker image storage |
| Workload Identity Pool | GitHub Actions authentication |
| OIDC Provider | GitHub token verification |
| Service Account | Deployment permissions |
| Secret Manager | API key storage (manual) |

**IAM Roles Granted:**
- `artifactregistry.writer` - Push images
- `run.developer` - Deploy Cloud Run
- `iam.serviceAccountUser` - Act as service account
- `secretmanager.secretAccessor` - Read secrets

## Resource Cleanup

**⚠️ Warning**: This deletes all infrastructure.

```bash
# Delete Cloud Run services
gcloud run services delete portfolio-backend --region="$REGION" --project="$PROJECT_ID" --quiet
gcloud run services delete portfolio-frontend --region="$REGION" --project="$PROJECT_ID" --quiet

# Delete Workload Identity Pool (30-day soft delete)
gcloud iam workload-identity-pools delete $POOL_NAME \
  --location=global --project="$PROJECT_ID" --quiet

# Delete Service Account
gcloud iam service-accounts delete $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --project="$PROJECT_ID" --quiet

# Delete Artifact Registry
gcloud artifacts repositories delete $REPO_NAME \
  --location="$REGION" --project="$PROJECT_ID" --quiet

# Delete Secret
gcloud secrets delete $SECRET_NAME --project="$PROJECT_ID" --quiet
```
