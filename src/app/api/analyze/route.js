import { NextResponse } from "next/server";

/* ---------- HELPERS ---------- */
function getPlaylistId(url) {
  if (!url) return null;
  const parts = url.split("list=");
  if (parts.length < 2) return null;
  return parts[1].split("&")[0];
}

function isoToSeconds(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return (
    (parseInt(m?.[1] || 0) * 3600) +
    (parseInt(m?.[2] || 0) * 60) +
    (parseInt(m?.[3] || 0))
  );
}

function formatSeconds(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return { hours: h, minutes: m, seconds: s };
}

/* ---------- MAIN ---------- */
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const playlistUrl = searchParams.get("url");
  const start = Math.max(parseInt(searchParams.get("start") || "1"), 1);
  const end = parseInt(searchParams.get("end") || "0");

  const playlistId = getPlaylistId(playlistUrl);
  if (!playlistId) {
    return NextResponse.json({ error: "Invalid playlist URL" });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;

  /* Playlist title */
  const infoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
  );
  const info = await infoRes.json();
  const playlistTitle = info.items?.[0]?.snippet?.title || "Unknown Playlist";
  const channelName = info.items?.[0]?.snippet?.channelTitle || "Unknown Creator";

  /* Fetch all video IDs */
  let ids = [];
  let token = "";

  do {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&pageToken=${token}&key=${API_KEY}`
    );
    const data = await res.json();
    if (!data.items) break;
    data.items.forEach(v => ids.push(v.contentDetails.videoId));
    token = data.nextPageToken;
  } while (token);

  const s = start - 1;
  const e = end > 0 ? Math.min(end, ids.length) : ids.length;
  const selected = ids.slice(s, e);

  /* Durations */
  let totalSeconds = 0;

  for (let i = 0; i < selected.length; i += 50) {
    const chunk = selected.slice(i, i + 50);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk.join(",")}&key=${API_KEY}`
    );
    const data = await res.json();
    data.items?.forEach(v => {
      totalSeconds += isoToSeconds(v.contentDetails.duration);
    });
  }

  const avgSeconds = selected.length
    ? Math.floor(totalSeconds / selected.length)
    : 0;

  return NextResponse.json({
    playlistTitle,
    channelName,
    totalVideos: ids.length,
    range: `${start}-${end || ids.length}`,
    rangeVideos: selected.length,

    averageVideo: formatSeconds(avgSeconds),

    total: {
      "1x": formatSeconds(totalSeconds),
      "1.25x": formatSeconds(totalSeconds / 1.25),
      "1.5x": formatSeconds(totalSeconds / 1.5),
      "2x": formatSeconds(totalSeconds / 2),
    },

    totalHours: +(totalSeconds / 3600).toFixed(2),
  });
}
