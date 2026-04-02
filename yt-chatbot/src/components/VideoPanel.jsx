import { useState, useRef } from "react";
import { indexVideo } from "../api";

// ─── Icons ───────────────────────────────
const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Extract video ID ────────────────────
function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0];
    if (u.searchParams.has("v")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
    return null;
  } catch {
    return null;
  }
}

// ─── Status badge ────────────────────────
function StatusBadge({ status, chunks }) {
  const config = {
    idle: { dotClass: "idle", text: "Paste a URL" },
    loading: { dotClass: "loading", text: "Indexing…" },
    success: { dotClass: "active", text: `Ready · ${chunks}` },
    error: { dotClass: "idle", text: "Failed" },
  };
  const c = config[status] || config.idle;
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className={`status-dot ${c.dotClass}`} />
      <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium truncate">{c.text}</span>
    </div>
  );
}


// ═══════════════════════════════════════════
// VIDEO PANEL
// ═══════════════════════════════════════════
export default function VideoPanel({ onIndexed, onBack }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [videoId, setVideoId] = useState(null);
  const [chunks, setChunks] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    const vid = extractVideoId(trimmed);
    if (!vid) {
      setStatus("error");
      setErrorMsg("Invalid YouTube URL");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setVideoId(vid);

    try {
      const data = await indexVideo(trimmed);
      setChunks(data.chunks);
      setStatus("success");
      onIndexed?.(data.video_id);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 border-b border-neutral-900 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="text-neutral-600 hover:text-neutral-300 transition-colors p-1 -ml-1 flex-shrink-0"
              title="Back to home"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-white">Video</h2>
            <p className="text-[10px] sm:text-[11px] text-neutral-600 mt-0.5 truncate">Paste a YouTube link</p>
          </div>
        </div>
        <StatusBadge status={status} chunks={chunks} />
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col p-3 sm:p-5 gap-3 sm:gap-5 overflow-y-auto">
        {/* URL Input */}
        <form onSubmit={handleSubmit} className="animate-fade-in-up flex-shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-neutral-600">
                <LinkIcon />
              </span>
              <input
                ref={inputRef}
                id="yt-url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="youtube.com/watch?v=..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 input-field text-[13px] sm:text-sm font-medium"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || !url.trim()}
              className="btn-primary px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0"
            >
              {status === "loading" ? (
                <SpinnerIcon />
              ) : (
                <>
                  <span className="hidden sm:inline">Index</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>

          {/* Error / success messages */}
          {status === "error" && errorMsg && (
            <p className="mt-2 text-[11px] sm:text-[12px] text-red-400 animate-fade-in">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="mt-2 text-[11px] sm:text-[12px] text-emerald-500 flex items-center gap-1 animate-fade-in">
              <CheckCircleIcon /> Indexed and ready
            </p>
          )}
        </form>

        {/* Video Embed */}
        <div className="flex-1 rounded-xl overflow-hidden border border-neutral-900 animate-fade-in-up delay-100 min-h-0">
          {videoId ? (
            <iframe
              id="yt-embed-player"
              className="w-full h-full min-h-[200px] sm:min-h-[280px]"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full min-h-[200px] sm:min-h-[280px] flex flex-col items-center justify-center gap-2 sm:gap-3 bg-neutral-950">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
              </div>
              <p className="text-[12px] sm:text-[13px] text-neutral-700 font-medium">Video preview</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-3 py-2 sm:px-5 sm:py-3 border-t border-neutral-900 flex-shrink-0">
        <p className="text-[9px] sm:text-[10px] text-neutral-700 text-center">OpenAI Embeddings · Qdrant Vector DB</p>
      </div>
    </div>
  );
}
