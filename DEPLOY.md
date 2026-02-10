# Deployment Guide (Vercel)

This project is built with Next.js and is ready to be deployed on [Vercel](https://vercel.com).

## Prerequisites

1.  A [Vercel Account](https://vercel.com/signup).
2.  A [GitHub Account](https://github.com) (recommended for automatic deployments).
3.  Your **RapidAPI Key** and **Host**.

## Steps to Deploy

1.  **Push to GitHub**:
    - Ensure your project is pushed to a GitHub repository.
    
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

2.  **Import to Vercel**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your GitHub repository (`instant-download` or whatever you named it).

3.  **Configure Environment Variables**:
    - **IMPORTANT**: Before clicking "Deploy", verify the **"Environment Variables"** section.
    - Add the following variables (copy them from your local `.env.local` file):
        - `RAPIDAPI_KEY`: Your actual API key.
        - `RAPIDAPI_HOST`: `instagram-downloader-download-instagram-videos-stories5.p.rapidapi.com` (or whichever host you are using).

4.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your project. This might take a minute.

## Troubleshooting

-   **404 on API Calls**: Ensure your Environment Variables are set correctly in Vercel > Settings > Environment Variables. You must redeploy (or trigger a new build) after changing environment variables.
-   **Proxy Errors**: If downloads fail, check the Vercel Function logs. The proxy handles large files, but Vercel Serverless Functions have execution time limits (usually 10-60 seconds on free tier). Extremely large videos might time out.
