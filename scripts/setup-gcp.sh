#!/bin/bash
set -e  # Exit on error

# Configuration
export PROJECT_ID=$(gcloud config get-value project)
export REGION="us-central1"
export REPO_NAME="portfolio-repo"
export GITHUB_REPO="yukaty/portfolio-v2"
export SERVICE_ACCOUNT_NAME="github-deployer"
export SECRET_NAME="google-api-key"
export POOL_NAME="github-actions-pool"
export PROVIDER_NAME="github-actions-provider"

echo "🚀 Starting setup for Project: $PROJECT_ID in $REGION..."
echo ""

# Validate PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP project configured. Run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
fi

# Check for --clean flag to delete existing WIF resources
FORCE_CREATE=false
if [ "$1" == "--clean" ]; then
    echo "🧹 Cleaning up existing Workload Identity Federation resources..."

    # Delete OIDC Provider if exists (ignore errors)
    echo "  Attempting to delete OIDC Provider '${PROVIDER_NAME}'..."
    gcloud iam workload-identity-pools providers delete "${PROVIDER_NAME}" \
        --project="$PROJECT_ID" \
        --location="global" \
        --workload-identity-pool="${POOL_NAME}" \
        --quiet 2>/dev/null || echo "  ℹ️  Provider not found or already deleted"

    # Delete Workload Identity Pool if exists (ignore errors)
    echo "  Attempting to delete Workload Identity Pool '${POOL_NAME}'..."
    gcloud iam workload-identity-pools delete "${POOL_NAME}" \
        --project="$PROJECT_ID" \
        --location="global" \
        --quiet 2>/dev/null || echo "  ℹ️  Pool not found or already deleted"

    echo "  ⏳ Waiting for deletion to propagate (10 seconds)..."
    sleep 10

    echo "  🎉 Cleanup complete! Re-running setup..."
    FORCE_CREATE=true
    echo ""
fi

echo "📦 Enabling required APIs..."
gcloud services enable \
    artifactregistry.googleapis.com \
    run.googleapis.com \
    iam.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iamcredentials.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

echo "🏗 Creating Artifact Registry..."
if gcloud artifacts repositories describe $REPO_NAME \
    --project="$PROJECT_ID" \
    --location=$REGION &>/dev/null; then
    echo "  ℹ️  Repository '$REPO_NAME' already exists, skipping..."
else
    gcloud artifacts repositories create $REPO_NAME \
        --project="$PROJECT_ID" \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for portfolio" \
        --quiet
    echo "  ✅ Repository created"
fi

echo "🔐 Setting up Workload Identity Federation..."
if [ "$FORCE_CREATE" = true ]; then
    # Force create after cleanup
    echo "  Creating Workload Identity Pool '${POOL_NAME}'..."
    gcloud iam workload-identity-pools create "${POOL_NAME}" \
        --project="$PROJECT_ID" \
        --location="global" \
        --display-name="GitHub Pool" \
        --quiet
    echo "  ✅ Workload Identity Pool created"

    echo "  Creating OIDC Provider '${PROVIDER_NAME}'..."
    gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_NAME}" \
        --project="$PROJECT_ID" \
        --location="global" \
        --workload-identity-pool="${POOL_NAME}" \
        --display-name="GitHub Provider" \
        --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
        --attribute-condition="assertion.repository=='${GITHUB_REPO}'" \
        --issuer-uri="https://token.actions.githubusercontent.com" \
        --quiet
    echo "  ✅ OIDC Provider created"
else
    # Normal flow: check if exists first
    if gcloud iam workload-identity-pools describe "${POOL_NAME}" \
        --project="$PROJECT_ID" \
        --location="global" &>/dev/null; then
        echo "  ℹ️  Workload Identity Pool '${POOL_NAME}' already exists, skipping..."
    else
        gcloud iam workload-identity-pools create "${POOL_NAME}" \
            --project="$PROJECT_ID" \
            --location="global" \
            --display-name="GitHub Pool" \
            --quiet
        echo "  ✅ Workload Identity Pool created"
    fi

    if gcloud iam workload-identity-pools providers describe "${PROVIDER_NAME}" \
        --project="$PROJECT_ID" \
        --location="global" \
        --workload-identity-pool="${POOL_NAME}" &>/dev/null; then
        echo "  ℹ️  OIDC Provider '${PROVIDER_NAME}' already exists, skipping..."
    else
        gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_NAME}" \
            --project="$PROJECT_ID" \
            --location="global" \
            --workload-identity-pool="${POOL_NAME}" \
            --display-name="GitHub Provider" \
            --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
            --attribute-condition="assertion.repository=='${GITHUB_REPO}'" \
            --issuer-uri="https://token.actions.githubusercontent.com" \
            --quiet
        echo "  ✅ OIDC Provider created"
    fi
fi

echo "👤 Creating Service Account..."
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --project="$PROJECT_ID" &>/dev/null; then
    echo "  ℹ️  Service Account '$SERVICE_ACCOUNT_NAME' already exists, skipping..."
else
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --project="$PROJECT_ID" \
        --display-name="GitHub Actions Deployer" \
        --quiet
    echo "  ✅ Service Account created"
fi

echo "🔑 Granting IAM permissions..."
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
        --quiet &>/dev/null || echo "  ℹ️  Role $ROLE already granted or failed (may already exist)"
done

echo "🔗 Binding Workload Identity Pool to Service Account..."
export POOL_ID=$(gcloud iam workload-identity-pools describe "${POOL_NAME}" \
    --project="$PROJECT_ID" \
    --location="global" \
    --format='get(name)')
gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --project="$PROJECT_ID" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_REPO}" \
    --quiet &>/dev/null || echo "  ℹ️  Binding already exists"

echo ""
echo "🔒 Setting up Secret Manager..."
echo "  You need to create a secret named '$SECRET_NAME' with your Gemini API key."
echo ""
echo "  Run this command:"
echo "  echo -n 'YOUR_GEMINI_API_KEY' | gcloud secrets create $SECRET_NAME --project=$PROJECT_ID --data-file=- --replication-policy=automatic"
echo ""
if gcloud secrets describe $SECRET_NAME --project="$PROJECT_ID" &>/dev/null; then
    echo "  ✅ Secret '$SECRET_NAME' already exists"
else
    echo "  ⚠️  Secret '$SECRET_NAME' not found - you need to create it manually"
fi

echo ""
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Add these secrets to your GitHub repository:"
echo ""
echo "GCP_PROJECT_ID:"
echo "$PROJECT_ID"
echo ""
echo "GCP_SERVICE_ACCOUNT:"
echo "$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
echo ""
echo "GCP_WIF_PROVIDER:"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
echo "projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"
echo ""
echo "VITE_API_URL (after backend is deployed):"
echo "https://portfolio-backend-XXXXXX-uc.a.run.app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 Don't forget to create the Secret Manager secret:"
echo "echo -n 'YOUR_GEMINI_API_KEY' | gcloud secrets create $SECRET_NAME --project=$PROJECT_ID --data-file=- --replication-policy=automatic"
echo ""