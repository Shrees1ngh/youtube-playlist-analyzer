// Popup logic for the Chrome extension. No API keys are stored here.
(() => {
  const API_BASE = "https://yt-playlist-analyzer-alpha.vercel.app"; // Deployed Vercel domain

  const urlInput = document.getElementById("playlistUrl");
  const statusBox = document.getElementById("status");
  const resultBox = document.getElementById("result");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const detectBtn = document.getElementById("detectBtn");

  function setStatus(message, tone = "muted") {
    statusBox.textContent = message || "";
    statusBox.style.color = tone === "error" ? "#fecdd3" : tone === "ok" ? "#bbf7d0" : "#94a3b8";
  }

  function renderResult(data) {
    if (!data) {
      resultBox.classList.remove("show");
      resultBox.textContent = "";
      return;
    }

    const totalAtNormal = data.total?.["1x"] || data.total?.["Normal"];
    const range = data.range || "full playlist";

    resultBox.innerHTML = `
      <div class="pill">Total videos <span>${data.totalVideos ?? "-"}</span></div>
      <div style="margin-top: 8px;">Range: <strong>${range}</strong></div>
      <div style="margin-top: 6px;">Watch time @1x: <strong>${formatDuration(totalAtNormal)}</strong></div>
    `;
    resultBox.classList.add("show");
  }

  function formatDuration(value) {
    if (!value) return "-";
    if (typeof value === "string") return value;
    const { hours = 0, minutes = 0, seconds = 0 } = value;
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
  }

  function isLikelyPlaylist(url) {
    if (!url) return false;
    return /youtube\.com\/.*(list=|playlist)/i.test(url) || /youtu\.be\/.*list=/i.test(url);
  }

  async function detectFromActiveTab() {
    setStatus("Detecting playlist from active tab...");
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const active = tabs?.[0];
      if (active?.url && isLikelyPlaylist(active.url)) {
        urlInput.value = active.url;
        setStatus("Detected playlist URL from the current tab.", "ok");
      } else {
        setStatus("Open a YouTube playlist tab first.", "error");
      }
    } catch (err) {
      console.error(err);
      setStatus("Unable to access tabs. Grant permission and retry.", "error");
    }
  }

  async function analyzePlaylist() {
    const playlistUrl = urlInput.value.trim();
    if (!playlistUrl) {
      setStatus("Enter a playlist URL first.", "error");
      return;
    }

    if (API_BASE.includes("your-vercel-domain")) {
      setStatus("Update popup.js with your deployed Vercel domain first.", "error");
      return;
    }

    setStatus("Analyzing playlist...");
    resultBox.classList.remove("show");
    analyzeBtn.disabled = true;
    detectBtn.disabled = true;

    const endpoint = `${API_BASE.replace(/\/$/, "")}/api/analyze`;
    const qs = new URLSearchParams({ url: playlistUrl, start: "1", end: "0" });

    try {
      const res = await fetch(`${endpoint}?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok || data?.error) {
        setStatus(data?.error || "Failed to analyze playlist.", "error");
        renderResult(null);
      } else {
        setStatus("Success!", "ok");
        renderResult(data);
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error. Check connectivity and try again.", "error");
      renderResult(null);
    } finally {
      analyzeBtn.disabled = false;
      detectBtn.disabled = false;
    }
  }

  detectBtn.addEventListener("click", detectFromActiveTab);
  analyzeBtn.addEventListener("click", analyzePlaylist);

  // Try to prefill from active YouTube tab on load without blocking the user.
  detectFromActiveTab();
})();
