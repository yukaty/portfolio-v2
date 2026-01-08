#!/bin/bash
# GCP Deployment Setup Script
#
# This script sets up:
# 1. Artifact Registry for Docker images
# 2. Workload Identity Federation for GitHub Actions authentication
# 3. Service Account with necessary permissions
# 4. Secret Manager for API keys
#
# Prerequisites:
# - gcloud CLI installed and authenticated
# - Project created in GCP
# - Gemini API key ready

set -e  # Exit on error

# ============================================================================
# Configuration
# ============================================================================

export PROJECT_ID="my-portfolio-v2-483618"
gcloud config set project "$PROJECT_ID"
export REGION="us-central1"
export REPO_NAME="portfolio-repo"
export GITHUB_REPO="yukaty/portfolio-v2"
export SERVICE_ACCOUNT_NAME="github-deployer"
export SECRET_NAME="google-api-key"
export POOL_NAME="github-actions-pool"
export PROVIDER_NAME="github-actions-provider"

echo "🚀 Starting GCP setup for Portfolio Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "GitHub Repo: $GITHUB_REPO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📦 Step 1: Enabling required APIs..."
gcloud services enable \
    artifactregistry.googleapis.com \
    run.googleapis.com \
    iam.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iamcredentials.googleapis.com \
    secretmanager.googleapis.com \
    --project="$PROJECT_ID"
echo "✅ APIs enabled"
echo ""

echo "🏗 Step 2: Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPO_NAME \
    --project="$PROJECT_ID" \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for portfolio" \
    2>/dev/null && echo "✅ Repository created" || echo "ℹ️  Repository already exists"
echo ""

echo "🔐 Step 3: Creating Workload Identity Pool..."
gcloud iam workload-identity-pools create "$POOL_NAME" \
    --project="$PROJECT_ID" \
    --location="global" \
    --display-name="GitHub Actions Pool" \
    2>/dev/null && echo "✅ Pool created" || echo "ℹ️  Pool already exists"
echo ""

echo "🔑 Step 4: Creating OIDC Provider for GitHub Actions..."
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
    --project="$PROJECT_ID" \
    --location="global" \
    --workload-identity-pool="$POOL_NAME" \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="assertion.repository=='${GITHUB_REPO}'" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    2>/dev/null && echo "✅ Provider created" || echo "ℹ️  Provider already exists"
echo ""

echo "👤 Step 5: Creating Service Account..."
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --project="$PROJECT_ID" \
    --display-name="GitHub Actions Deployer" \
    2>/dev/null && echo "✅ Service Account created" || echo "ℹ️  Service Account already exists"
echo ""

echo "🔑 Step 6: Granting IAM Roles to Service Account..."

ROLES=(
    "roles/artifactregistry.writer"
    "roles/run.developer"
    "roles/iam.serviceAccountUser"
    "roles/secretmanager.secretAccessor"
)

for ROLE in "${ROLES[@]}"; do
    echo "  Granting $ROLE..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
        --role="$ROLE" \
        --condition=None \
        --quiet >/dev/null 2>&1 || true
done

echo "✅ IAM permissions granted"
echo ""

echo "🔗 Step 7: Binding Workload Identity Pool to Service Account..."
export POOL_ID=$(gcloud iam workload-identity-pools describe "$POOL_NAME" \
    --project="$PROJECT_ID" \
    --location="global" \
    --format='get(name)')

gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --project="$PROJECT_ID" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_REPO}" \
    --quiet >/dev/null 2>&1 || true

echo "✅ Binding created"
echo ""

echo "🔒 Step 8: Setting up Secret Manager..."

# Check if the secret already exists
if ! gcloud secrets describe $SECRET_NAME --project="$PROJECT_ID" &>/dev/null; then
    echo "  Creating secret '$SECRET_NAME'..."
    # Create the secret with a placeholder value
    echo -n "placeholder" | gcloud secrets create $SECRET_NAME \
        --project="$PROJECT_ID" \
        --replication-policy="automatic" \
        --data-file=-
    echo "✅ Secret created with placeholder value"
else
    echo "✅ Secret '$SECRET_NAME' already exists"
fi

# Grant access to service account
echo "  Granting Secret Manager access to Service Account..."
gcloud secrets add-iam-policy-binding $SECRET_NAME \
    --project="$PROJECT_ID" \
    --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet >/dev/null 2>&1 || true
echo "✅ Secret access granted"

# ============================================================================
# Final Output: GitHub Secrets
# ============================================================================

echo ""
echo "✅ GCP Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 GitHub Secrets (copy these values):"
echo ""
echo "GCP_PROJECT_ID:"
echo "  $PROJECT_ID"
echo ""
echo "GCP_SERVICE_ACCOUNT:"
echo "  $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
echo ""
echo "GCP_WIF_PROVIDER:"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
echo "  projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/providers/$PROVIDER_NAME"
echo ""
echo "VITE_API_URL:"
echo "  (Set after backend deployment)"
echo ""
echo "FRONTEND_URL:"
echo "  (Set after frontend deployment - use 'https://placeholder.run.app' initially)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
