// Popup logic for the Chrome extension. No API keys are stored here.
(() => {
  const urlInput = document.getElementById("playlistUrl");
  const statusBox = document.getElementById("status");
  const resultBox = document.getElementById("result");
  const analyzeBtn = document.getElementById("analyzeBtn");

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

    const range = data.range || "full playlist";
    const total = data.total || {};

    // Build speed cards for all available speeds
    let speedCards = "";
    const speeds = ["1x", "1.25x", "1.5x", "2x"];
    
    speeds.forEach(speed => {
      const duration = total[speed];
      if (duration) {
        const formatted = formatDuration(duration);
        speedCards += `
          <div class="speed-card">
            <div class="speed-label">${speed}</div>
            <div class="speed-time">${formatted}</div>
          </div>
        `;
      }
    });

    resultBox.innerHTML = `
      <div class="pill">Total videos <span>${data.totalVideos ?? "-"}</span></div>
      <div style="margin-top: 8px;">Range: <strong>${range}</strong></div>
      ${speedCards ? `<div class="speed-grid">${speedCards}</div>` : ''}
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

  async function autoDetectFromTab() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const active = tabs?.[0];
      if (active?.url && isLikelyPlaylist(active.url)) {
        urlInput.value = active.url;
        setStatus("Detected playlist from current tab!", "ok");
      }
    } catch (err) {
      console.error("Auto-detect failed:", err);
    }
  }


  async function analyzePlaylist() {
    const playlistUrl = urlInput.value.trim();
    if (!playlistUrl) {
      setStatus("Enter a playlist URL first.", "error");
      return;
    }

    setStatus("Analyzing playlist...");
    resultBox.classList.remove("show");
    analyzeBtn.disabled = true;

    try {
      // Send message to background script to fetch the data
      chrome.runtime.sendMessage(
        { action: "analyzePlaylist", url: playlistUrl, start: "1", end: "0" },
        (response) => {
          if (!response) {
            setStatus("No response from background script.", "error");
            renderResult(null);
          } else if (!response.success) {
            setStatus(response.error || "Failed to analyze playlist.", "error");
            renderResult(null);
          } else {
            const data = response.data;
            console.log("Response data:", data);

            if (data?.error) {
              setStatus(data.error, "error");
              renderResult(null);
            } else if (data?.data) {
              setStatus("Success!", "ok");
              renderResult(data.data);
            } else {
              setStatus("Success!", "ok");
              renderResult(data);
            }
          }

          analyzeBtn.disabled = false;
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setStatus(`Error: ${err.message}`, "error");
      renderResult(null);
      analyzeBtn.disabled = false;
    }
  }

  analyzeBtn.addEventListener("click", analyzePlaylist);
  
  // Auto-detect playlist URL from current tab when popup opens
  autoDetectFromTab();
})();
