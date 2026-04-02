import { useState } from "react";

// ─── Icons ───────────────────────────────
const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
);

const DBIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
  </svg>
);

// ─── Feature data ────────────────────────
const FEATURES = [
  {
    icon: <BoltIcon />,
    title: "Instant Indexing",
    description: "Paste any YouTube URL. We extract and embed the transcript in seconds using OpenAI embeddings.",
  },
  {
    icon: <ChatIcon />,
    title: "Conversational AI",
    description: "Ask natural language questions and get precise, context-aware answers powered by GPT.",
  },
  {
    icon: <DBIcon />,
    title: "Vector Search",
    description: "Qdrant-powered semantic search finds the most relevant transcript segments instantly.",
  },
  {
    icon: <ShieldIcon />,
    title: "Context-Grounded",
    description: "Responses are strictly grounded in the video transcript. No hallucinations, no guessing.",
  },
];

// ─── Steps data ──────────────────────────
const STEPS = [
  { num: "01", title: "Paste a YouTube URL", desc: "Drop any public YouTube video link into the input field." },
  { num: "02", title: "We index the transcript", desc: "The transcript is chunked, embedded, and stored in a vector database." },
  { num: "03", title: "Ask anything", desc: "Chat naturally — our RAG pipeline retrieves context and generates answers." },
];


// ═══════════════════════════════════════════
// HERO LANDING PAGE
// ═══════════════════════════════════════════
export default function HeroPage({ onGetStarted }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* ── Background effects ── */}
      <div className="hero-grid" />
      <div className="hero-glow hero-glow-1" />
      {/* <div className="hidden sm:block hero-glow hero-glow-2" /> */}

      {/* ── Animated beams (hidden on mobile for perf) ── */}
      <div className="hidden sm:block hero-beam" style={{ left: '20%', animationDelay: '0s' }} />
      <div className="hidden sm:block hero-beam" style={{ left: '40%', animationDelay: '1.5s' }} />
      <div className="hidden sm:block hero-beam" style={{ left: '60%', animationDelay: '3s' }} />
      <div className="hidden sm:block hero-beam" style={{ left: '80%', animationDelay: '0.8s' }} />

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-5 animate-fade-in-down">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-transparent flex items-center justify-center">
            <PlayCircleIcon />
          </div>
          <span className="text-sm sm:text-[15px] font-semibold tracking-tight text-white">ZenTube AI</span>
        </div>
        <div className="hidden md:flex items-center gap-1 nav-pill rounded-full px-1.5 py-1.5">
          <a href="#features" className="px-4 py-1.5 text-[13px] text-neutral-400 hover:text-white transition-colors rounded-full">Features</a>
          <a href="#how-it-works" className="px-4 py-1.5 text-[13px] text-neutral-400 hover:text-white transition-colors rounded-full">How it works</a>
        </div>
        <button
          onClick={onGetStarted}
          className="btn-secondary px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px]"
        >
          Launch App
        </button>
      </nav>

      {/* ── Hero section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 lg:pt-10 lg:pb-32">
        {/* Badge */}
        <div className="badge bg-red-600/10 animate-fade-in-up mb-5 sm:mb-8 text-[11px] sm:text-[12px]">
          <SparkleIcon />
          <span>Powered by RAG + GPT</span>
        </div>

        {/* Headline */}
        <h1 className="animate-text-reveal max-w-3xl">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] gradient-text">
            Chat with any
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white mt-1">
            You<span className="bg-red-600 text-white px-1.5 sm:px-2.5 py-0.5 rounded-lg sm:rounded-xl ml-0.5 inline-block">Tube</span> video
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-neutral-500 max-w-xs sm:max-w-md lg:max-w-lg leading-relaxed animate-fade-in-up delay-300">
          Paste a link, ask questions, get answers — all grounded in the actual video transcript. No hallucinations.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 sm:mt-10 w-full sm:w-auto animate-fade-in-up delay-500">
          <button
            onClick={onGetStarted}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="btn-primary w-full sm:w-auto px-6 py-3 text-sm flex items-center justify-center gap-2 group"
          >
            Get Started
            <span className={`transition-transform duration-200 ${isHovering ? 'translate-x-0.5' : ''}`}>
              <ArrowIcon />
            </span>
          </button>

        </div>

        {/* Social proof */}
        <div className="mt-10 sm:mt-16 animate-fade-in-up delay-700">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-neutral-600 font-medium mb-3 sm:mb-4">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-neutral-500">
            <span className="text-[12px] sm:text-[13px] font-medium flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.52-2.77A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.997 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.52 2.769A6.056 6.056 0 0 0 13.293 24a6.052 6.052 0 0 0 5.734-4.138 5.985 5.985 0 0 0 3.997-2.9 6.046 6.046 0 0 0-.742-7.14z" /></svg>
              OpenAI
            </span>
            <span className="hidden sm:inline text-neutral-700">·</span>
            <span className="text-[12px] sm:text-[13px] font-medium">Qdrant</span>
            <span className="hidden sm:inline text-neutral-700">·</span>
            <span className="text-[12px] sm:text-[13px] font-medium">FastAPI</span>
            <span className="hidden sm:inline text-neutral-700">·</span>
            <span className="text-[12px] sm:text-[13px] font-medium">React</span>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-neutral-600 font-semibold mb-2 sm:mb-3 animate-fade-in-up">Features</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white animate-fade-in-up delay-100">
              Everything you need
            </h2>
            <p className="text-neutral-500 mt-2 sm:mt-3 text-sm sm:text-base max-w-md mx-auto animate-fade-in-up delay-200">
              A complete RAG pipeline from video to conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card p-4 sm:p-6 group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-neutral-700 transition-all mb-3 sm:mb-4">
                  {f.icon}
                </div>
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-white mb-1 sm:mb-1.5">{f.title}</h3>
                <p className="text-[12px] sm:text-[13px] text-neutral-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-neutral-600 font-semibold mb-2 sm:mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Three simple steps
            </h2>
          </div>

          <div className="flex flex-col gap-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-4 sm:gap-6 py-6 sm:py-8 border-t border-neutral-900 group">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-800 group-hover:text-neutral-600 transition-colors tabular-nums min-w-[36px] sm:min-w-[48px]">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-[12px] sm:text-[13px] text-neutral-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CTA ── */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-24 lg:py-32 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4">
          Ready to chat?
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8">
          Start a conversation with any YouTube video in seconds.
        </p>
        <button
          onClick={onGetStarted}
          className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm inline-flex items-center gap-2"
        >
          Launch ZenTube AI
          <ArrowIcon />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-neutral-900 px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[11px] sm:text-[12px] text-neutral-600">© 2026 ZenTube AI</p>
        <p className="text-[11px] sm:text-[12px] text-neutral-700">Built with OpenAI · Qdrant · FastAPI · React</p>
      </footer>
    </div>
  );
}
