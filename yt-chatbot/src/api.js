const API_BASE = import.meta.env.VITE_HOSTED_API;

/**
 * Index a YouTube video — sends the URL to the backend for transcript extraction & embedding.
 * @param {string} youtubeUrl
 * @returns {Promise<{video_id: string, status: string, chunks: number}>}
 */
export async function indexVideo(youtubeUrl) {
  const res = await fetch(`${API_BASE}api/index`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Indexing failed" }));
    throw new Error(err.detail || "Indexing failed");
  }
  return res.json();
}

/**
 * Send a chat question about an indexed video.
 * @param {string} videoId
 * @param {string} question
 * @returns {Promise<{answer: string}>}
 */
export async function chatWithVideo(videoId, question) {
  const res = await fetch(`${API_BASE}api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Chat request failed" }));
    throw new Error(err.detail || "Chat request failed");
  }
  return res.json();
}
