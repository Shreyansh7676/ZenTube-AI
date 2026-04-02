import { useState, useRef, useEffect } from "react";
import { chatWithVideo } from "../api";

// ─── Icons ───────────────────────────────
const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const BotAvatar = () => (
  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white flex items-center justify-center flex-shrink-0">
    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  </div>
);

const UserAvatar = () => (
  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-neutral-800 flex items-center justify-center flex-shrink-0">
    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  </div>
);

// ─── Typing indicator ────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 sm:gap-2.5 animate-fade-in">
      <BotAvatar />
      <div className="chat-bubble-bot px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

// ─── Single message ──────────────────────
function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 sm:gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? <UserAvatar /> : <BotAvatar />}
      <div className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-2.5 text-[12px] sm:text-[13px] leading-relaxed ${
        isUser ? "chat-bubble-user" : "chat-bubble-bot"
      }`}>
        {content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < content.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Welcome state ───────────────────────
function WelcomeState({ isReady, onSuggestion }) {
  const suggestions = [
    "Summarize this video",
    "What are the key points?",
    "Explain the main topic",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 animate-fade-in">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-neutral-800 bg-neutral-900 flex items-center justify-center">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-[13px] sm:text-sm font-semibold text-neutral-300">
          {isReady ? "Ready to chat" : "No video indexed"}
        </h3>
        <p className="text-[11px] sm:text-[12px] text-neutral-600 mt-1 max-w-[220px]">
          {isReady
            ? "Ask anything about the video."
            : "Index a video first to start chatting."}
        </p>
      </div>
      {isReady && (
        <div className="flex flex-col gap-1.5 w-full max-w-[260px] mt-1 sm:mt-2 animate-fade-in-up delay-100">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestion?.(s)}
              className="text-left text-[11px] sm:text-[12px] text-neutral-500 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-300 transition-all duration-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════
// CHAT PANEL
// ═══════════════════════════════════════════
export default function ChatPanel({ videoId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isReady = !!videoId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isReady) inputRef.current?.focus();
  }, [isReady]);

  useEffect(() => {
    setMessages([]);
  }, [videoId]);

  const handleSend = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || !videoId || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await chatWithVideo(videoId, text);
      setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `Error: ${err.message || "Something went wrong."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 border-b border-neutral-900 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-white">Chat</h2>
          <p className="text-[10px] sm:text-[11px] text-neutral-600 mt-0.5">
            {isReady ? "Ask about the video" : "Waiting for video…"}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-[10px] sm:text-[11px] text-neutral-600 hover:text-neutral-300 font-medium transition-colors px-2 py-1 rounded-md hover:bg-neutral-900"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4 min-h-0">
        {messages.length === 0 ? (
          <WelcomeState isReady={isReady} onSuggestion={(text) => handleSend(text)} />
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 border-t border-neutral-900 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isReady ? "Ask something…" : "Index a video first…"}
            disabled={!isReady || isLoading}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 input-field text-[13px] sm:text-sm font-medium min-w-0"
          />
          <button
            id="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!isReady || isLoading || !input.trim()}
            className="btn-primary px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center justify-center flex-shrink-0"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
