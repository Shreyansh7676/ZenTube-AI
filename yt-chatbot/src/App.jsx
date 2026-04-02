import { useState } from "react";
import HeroPage from "./components/HeroPage";
import VideoPanel from "./components/VideoPanel";
import ChatPanel from "./components/ChatPanel";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("hero"); // "hero" | "app"
  const [videoId, setVideoId] = useState(null);
  const [activeTab, setActiveTab] = useState("video"); // mobile tab: "video" | "chat"

  if (page === "hero") {
    return <HeroPage onGetStarted={() => setPage("app")} />;
  }

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* ── Mobile tab switcher (visible only on small screens) ── */}
      <div className="flex md:hidden border-b border-neutral-900 flex-shrink-0">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex-1 py-3 text-xs font-semibold tracking-wide text-center transition-colors ${
            activeTab === "video"
              ? "text-white border-b-2 border-white"
              : "text-neutral-600"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-xs font-semibold tracking-wide text-center transition-colors ${
            activeTab === "chat"
              ? "text-white border-b-2 border-white"
              : "text-neutral-600"
          }`}
        >
          Chat
        </button>
      </div>

      {/* ── App layout ── */}
      {/* Desktop: side-by-side | Mobile: tab-based single panel */}
      <div className="flex-1 flex flex-col md:flex-row md:p-3 overflow-hidden">
        {/* ── Left panel — Video ── */}
        <div
          className={`${
            activeTab === "video" ? "flex" : "hidden"
          } md:flex app-panel-mobile md:app-panel w-full md:w-[40%] flex-shrink-0 overflow-hidden animate-scale-in flex-col flex-1 md:flex-initial
          md:rounded-r-none`}
        >
          <VideoPanel
            onIndexed={(vid) => {
              setVideoId(vid);
              setActiveTab("chat"); // auto-switch to chat on mobile after indexing
            }}
            onBack={() => setPage("hero")}
          />
        </div>

        {/* ── Divider (desktop only) ── */}
        <div className="hidden md:block app-divider" />

        {/* ── Right panel — Chat ── */}
        <div
          className={`${
            activeTab === "chat" ? "flex" : "hidden"
          } md:flex app-panel-mobile md:app-panel flex-1 overflow-hidden animate-scale-in delay-100 flex-col
          md:rounded-l-none`}
        >
          <ChatPanel videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
