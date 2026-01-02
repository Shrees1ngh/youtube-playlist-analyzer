# YouTube Playlist Analyzer

A modern web application that analyzes YouTube playlists, extracting detailed metrics about videos, channels, and viewing patterns.

## Features

- 📊 Analyze any public YouTube playlist
- 🎯 Extract video statistics (views, likes, duration)
- 📈 Calculate total watch time and average metrics
- 🌙 Dark/Light theme with smooth animations
- 📱 Fully responsive design
- ⚡ Real-time analysis with skeleton loading states

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
