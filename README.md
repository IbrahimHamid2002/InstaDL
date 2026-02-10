# Instagram Downloader PWA

A premium, glassmorphic Progressive Web Application (PWA) built with Next.js 14, Tailwind CSS, and Framer Motion. This app allows users to download Instagram Reels and Posts using RapidAPI.

## Features

- **PWA Support**: Installable on iOS, Android, and Windows.
- **Glassmorphism UI**: Modern, premium aesthetic with ambient backgrounds.
- **Auto-Detection**: Automatically detects if the link is a Reel or Post.
- **Responsive**: Fully responsive design for all devices.
- **Privacy Focus**: Does not store any user data.

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- A RapidAPI account and subscription to an Instagram Downloader API (e.g., [Instagram Downloader & Stories](https://rapidapi.com/hub)).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/insta-dl.git
    cd insta-dl
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Rename `.env.local.example` to `.env.local`.
    - Add your RapidAPI Key and Host.
    ```env
    RAPIDAPI_KEY=your_actual_api_key
    RAPIDAPI_HOST=instagram-downloader-download-instagram-videos-stories.p.rapidapi.com
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app uses `next-pwa` which requires some build configuration.

1.  Build the application:
    ```bash
    npm run build
    ```

2.  Start the production server:
    ```bash
    npm start
    ```

## Technologies Used

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)
