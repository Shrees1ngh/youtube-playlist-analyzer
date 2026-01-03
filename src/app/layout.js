import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1224" },
  ],
};

export const metadata = {
  title: {
    default: "YouTube Playlist Analyzer - Calculate Watch Time & Duration",
    template: "%s | YouTube Playlist Analyzer",
  },
  description: "Calculate total watch time, average duration, and plan study sessions with the YouTube Playlist Analyzer. Instantly analyze any YouTube playlist to get detailed statistics and insights.",
  applicationName: "YouTube Playlist Analyzer",
  manifest: "/manifest.json",
  keywords: [
    "YouTube Playlist Analyzer",
    "YT Playlist Analyzer",
    "YouTube Playlist Length",
    "Playlist Watch Time Calculator",
    "YouTube analytics",
    "playlist statistics",
    "video duration calculator",
    "how long is this playlist",
    "calculate playlist duration",
    "YouTube watch time calculator",
    "total video length calculator",
    "playlist duration checker",
    "study session planner",
    "learning time calculator",
    "video length tool",
    "YouTube playlist stats",
    "video statistics tool",
    "playlist analysis tool",
    "free playlist analyzer",
    "estimate watch time",
    "video time estimation",
    "learning playlist calculator",
    "education planning tool",
    "course duration calculator",
    "video content analyzer",
    "YouTube video insights",
    "playlist information finder",
    "total duration counter",
    "video binge calculator",
    "time management for videos"
  ],
  authors: [{ name: "Shree" }],
  openGraph: {
    title: "YouTube Playlist Analyzer - Calculate Watch Time & Duration",
    description: "Calculate total watch time, average duration, and plan study sessions with the YouTube Playlist Analyzer. Instantly analyze any YouTube playlist.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Playlist Analyzer",
    description: "Calculate watch time and duration for any YouTube playlist instantly.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
