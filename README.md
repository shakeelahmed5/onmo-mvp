# Onmo Campaign Suggestion Platform

AI-powered digital campaign suggestion tool built with:

-   **Frontend**: Next.js (Static Export)
-   **Backend**: Node.js Serverless Function (OpenAI integration)
-   **Deployment**: AWS S3 (Frontend) + AWS Lambda (Backend)

---

## 📁 Monorepo Structure

```
/
├── frontend/            # Next.js static site
├── backend/             # AI Suggest API using OpenAI
├── README.md
```

---

## 🧑‍💻 How to Run Locally

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

> Navigate to `http://localhost:3000`

#### Static Export

```bash
npm run build
# Output goes to /frontend/out
```

### 2. Backend (Local Lambda Mock)

```bash
cd backend
npm install
npm run dev
```

> This runs your Lambda handler locally (e.g. with serverless-offline or a Node server mock)

---

## ☁️ AWS Deployment Guide

### 🔸 Frontend → S3 (Static Website)

1. **Create an S3 Bucket**

    - Name: `onmo-assets`
    - Enable _Static Website Hosting_
    - Set index and error document: `index.html`
    - Disable "Block All Public Access"
    - Add bucket policy:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::onmo-assets/*"
            }
        ]
    }
    ```

2. **Sync files to S3**

    ```bash
    cd frontend
    aws s3 sync out/ s3://onmo-assets --delete
    ```

3. **Access the Site**
    ```
    http://onmo-assets.s3-website-<region>.amazonaws.com
    ```

---

### 🔹 Backend → AWS Lambda (Serverless)

> Deployed using Serverless Framework

#### 1. Setup `.env` in `/backend`

```env
OPENAI_API_KEY=your-openai-key
```

#### 2. Deploy

```bash
cd backend
npm install -g serverless
serverless deploy
```

#### 3. Output

You'll receive a Lambda URL like:

```
https://xyz123.execute-api.us-east-1.amazonaws.com/dev/ai-suggest
```

---

## 🧠 Prompt Used

```text
Suggest the best target audience and budget for a digital ad campaign with objective: {objective}, name: {name}, and initial budget: {budget}.
Return only JSON with "audienceSuggestion" and "budgetSuggestion" (budget should be a number only).
```

---

## ✅ Stretch Goals Implemented

-   [x] AI Suggestion with OpenAI (GPT 3.5 Turbo)
-   [x] Prompt tuning to return structured JSON only
-   [x] Serverless Lambda-compatible backend
-   [x] Static export and S3 hosting
-   [x] Secure CORS setup
-   [x] Error handling and validation
-   [x] Support for numerical-only budget suggestion

---

## 🛠️ Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | Next.js (Static Export) |
| Backend  | Node.js + OpenAI SDK    |
| Hosting  | AWS S3 + Lambda         |
| Infra    | Serverless Framework    |

---

## 🔐 CORS Setup

Inside `backend/utils/cors.ts`:

```ts
export const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
};
```

---

## 📦 API Example

**POST** `/ai-suggest`

**Body:**

```json
{
    "name": "Summer Sale",
    "objective": "Traffic",
    "budget": 300
}
```

**Response:**

```json
{
    "audienceSuggestion": "Young adults 20–35 interested in online shopping.",
    "budgetSuggestion": 250
}
```

---

## 📂 Example Folder Structure

```
/
├── frontend/
│   ├── pages/
│   ├── out/
│   └── next.config.js
│
├── backend/
│   ├── handlers
│   ├── utils/cors.ts
│   └── serverless.yml
```

---

## 🛡 License

MIT © 2025 [Shakeel Ahmed]
