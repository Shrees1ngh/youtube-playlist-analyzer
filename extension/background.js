// Background script to handle API requests from the popup
const API_BASE = "https://yt-playlist-analyzer-alpha.vercel.app";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePlaylist") {
    const { url, start = "1", end = "0" } = request;
    const endpoint = `${API_BASE.replace(/\/$/, "")}/api/analyze`;
    const qs = new URLSearchParams({ url, start, end });

    fetch(`${endpoint}?${qs.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((err) => {
        console.error("Fetch error in background:", err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // Keep the message channel open for async response
  }
});
