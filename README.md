# YouTube Playlist Analyzer

A modern web application that analyzes YouTube playlists, extracting detailed metrics about videos, channels, and viewing patterns.

## Features

- 📊 Analyze any public YouTube playlist
- 🎯 Extract video statistics (views, likes, duration)
- 📈 Calculate total watch time and average metrics
- 🌙 Dark/Light theme with smooth animations
- 📱 Fully responsive design
- ⚡ Real-time analysis with skeleton loading states
- 🔌 Chrome Extension for quick analysis from YouTube directly
  - One-click playlist detection on YouTube.com
  - Secure analysis via deployed Vercel API (no API keys stored locally)

## Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19, Tailwind CSS v4
- **Icons:** Lucide React
- **API:** YouTube Data API v3

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- YouTube Data API key ([Get one here](https://console.cloud.google.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shrees1ngh/youtube-playlist-analyzer.git
   cd youtube-playlist-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your YouTube API key to `.env.local`:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Chrome Extension

> **Note:** The extension is currently available for local development only. It has not been uploaded to the Chrome Web Store yet.

### Installation (Local Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `extension/` folder in this repository

### Add to Homescreen (Mobile)

You can also add the extension to your mobile homescreen:
- Open the popup in Chrome
- Tap the menu icon and select **Add to Home screen**
- The extension will appear as a shortcut on your device

### Usage

1. Navigate to any YouTube playlist
2. Click the **YouTube Playlist Analyzer** extension icon
3. The playlist URL will be **automatically detected** and filled in
4. Click **Analyze** to get instant metrics:
   - Total number of videos
   - Watch time at multiple speeds (1x, 1.25x, 1.5x, 2x)
   - Video range analyzed

### How It Works

- The extension automatically detects playlist URLs from the current tab
- Uses a background service worker to communicate with the deployed Vercel API
- **No API keys are stored** in the extension (secure by design)
- Results are displayed instantly in a clean, modern interface
- Results are displayed in the extension popup

## Building for Production

## Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable: `YOUTUBE_API_KEY` in Vercel dashboard
4. Deploy

[Deploy with Vercel](https://vercel.com/new)

## Environment Variables

Create a `.env.local` file with:

```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

To get your API key:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create an API key in Credentials
5. Copy the key and paste it in `.env.local`

## License

This project is open source and available under the MIT License.
