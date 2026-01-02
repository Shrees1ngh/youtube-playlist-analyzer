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

export const metadata = {
  title: "YouTube Playlist Analyzer",
  description: "Analyze YouTube playlists and get detailed statistics, video insights, and engagement metrics. View total duration, views, likes, and more.",
  keywords: ["youtube", "playlist", "analyzer", "statistics", "video analytics"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "YouTube Playlist Analyzer",
    description: "Analyze YouTube playlists and get detailed statistics, video insights, and engagement metrics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Playlist Analyzer",
    description: "Analyze YouTube playlists and get detailed statistics, video insights, and engagement metrics.",
  },
  icons: {
    icon: "/favicon.svg",
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
