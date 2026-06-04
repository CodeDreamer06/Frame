"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";

const sizePresets = [
  { label: "Square", value: "1024x1024", ratio: "1:1" },
  { label: "Portrait", value: "1024x1792", ratio: "9:16" },
  { label: "Landscape", value: "1792x1024", ratio: "16:9" },
  { label: "Wide", value: "1920x1080", ratio: "16:9" },
  { label: "Custom", value: "custom", ratio: "?" },
];

const qualityOptions = [
  { label: "Standard", value: "standard", desc: "Fast, good quality" },
  { label: "HD", value: "hd", desc: "Balanced" },
  { label: "Ultra", value: "ultra", desc: "Best quality, slower" },
];

const styleOptions = [
  { label: "Vivid", value: "vivid" },
  { label: "Natural", value: "natural" },
  { label: "Cinematic", value: "cinematic" },
  { label: "Anime", value: "anime" },
  { label: "3D Render", value: "3d-render" },
  { label: "Sketch", value: "sketch" },
];

const fadeItem = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* Collapsible section */
function Section({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-rule last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-neutral">
          {label}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral transition-transform"
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transitionDuration: "var(--dur-short)",
            transitionTimingFunction: "var(--ease-out)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows]"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionDuration: "var(--dur-long)",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-4 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Studio() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState("1024x1024");
  const [selectedQuality, setSelectedQuality] = useState("hd");
  const [selectedStyle, setSelectedStyle] = useState("vivid");
  const [batchCount, setBatchCount] = useState(1);
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNegative, setShowNegative] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [generatedImages, setGeneratedImages] = useState<
    { id: number; url: string; prompt: string }[]
  >([]);

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(120, el.scrollHeight)}px`;
  }, [prompt]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newImages = Array.from({ length: batchCount }, (_, i) => ({
        id: Date.now() + i,
        url: `https://picsum.photos/seed/${Date.now() + i}/400/400`,
        prompt: prompt,
      }));
      setGeneratedImages((prev) => [...newImages, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateLabel =
    batchCount > 1 ? `Generate ${batchCount} images` : "Generate";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-paper">
        {/* Header */}
        <header className="h-14 border-b border-rule flex items-center justify-between px-6 shrink-0">
          <h1 className="font-display text-base font-semibold text-ink">
            Studio
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-xs font-medium text-neutral hover:text-ink transition-colors" style={{ transitionProperty: "color", transitionDuration: "var(--dur-short)", transitionTimingFunction: "var(--ease-out)" }}>
              History
            </button>
            <button className="text-xs font-medium text-neutral hover:text-ink transition-colors" style={{ transitionProperty: "color", transitionDuration: "var(--dur-short)", transitionTimingFunction: "var(--ease-out)" }}>
              Templates
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel — Prompt & Controls */}
          <div className="w-[420px] flex flex-col border-r border-rule overflow-y-auto">
            <div className="p-5 space-y-0">
              {/* Prompt area */}
              <div className="pb-4 border-b border-rule">
                <label className="block mb-2 font-display text-sm font-medium tracking-wide text-ink-2">
                  Describe your vision
                </label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A watercolor painting of coastal cliffs at golden hour\u2026"
                  rows={4}
                  className="w-full p-4 rounded-lg bg-paper-3 border border-rule text-sm text-ink leading-relaxed placeholder:text-neutral resize-none outline-none transition-colors focus-visible:border-accent"
                  style={{
                    transitionProperty: "border-color",
                    transitionDuration: "var(--dur-short)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                />

                {/* Negative prompt toggle */}
                <button
                  onClick={() => setShowNegative(!showNegative)}
                  className="mt-2 flex items-center gap-1.5 text-xs text-neutral hover:text-muted"
                  style={{ transitionProperty: "color", transitionDuration: "var(--dur-short)", transitionTimingFunction: "var(--ease-out)" }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform"
                    style={{
                      transform: showNegative
                        ? "rotate(0deg)"
                        : "rotate(-90deg)",
                      transitionDuration: "var(--dur-short)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  Negative prompt
                </button>

                <AnimatePresence>
                  {showNegative && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Things to exclude\u2026"
                        className="mt-2 w-full px-4 py-2.5 rounded-lg bg-paper-3 border border-rule text-sm text-ink placeholder:text-neutral outline-none transition-colors focus-visible:border-accent"
                        style={{
                          transitionProperty: "border-color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Parameters */}
              <div className="pt-1">
                {/* Size */}
                <Section label="Canvas">
                  <div className="grid grid-cols-3 gap-2">
                    {sizePresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setSelectedSize(preset.value)}
                        className={`px-3 py-2.5 rounded-md text-xs font-medium transition-colors border ${
                          selectedSize === preset.value
                            ? "border-accent bg-accent-subtle text-accent"
                            : "border-rule bg-paper-3 text-muted hover:text-ink-2 hover:border-rule-2"
                        }`}
                        style={{
                          transitionProperty:
                            "border-color, background-color, color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        <div>{preset.label}</div>
                        <div className="mt-0.5 font-mono text-[10px] opacity-60">
                          {preset.ratio}
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>

                {/* Quality */}
                <Section label="Quality">
                  <div className="space-y-1.5">
                    {qualityOptions.map((q) => (
                      <button
                        key={q.value}
                        onClick={() => setSelectedQuality(q.value)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm border transition-colors ${
                          selectedQuality === q.value
                            ? "border-accent bg-accent-subtle text-accent"
                            : "border-rule bg-paper-3 text-muted hover:text-ink-2 hover:border-rule-2"
                        }`}
                        style={{
                          transitionProperty:
                            "border-color, background-color, color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        <span className="font-medium">{q.label}</span>
                        <span className="text-xs font-mono opacity-60">
                          {q.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>

                {/* Style */}
                <Section label="Style">
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          selectedStyle === style.value
                            ? "border-accent bg-accent-subtle text-accent"
                            : "border-rule bg-paper-3 text-muted hover:text-ink-2 hover:border-rule-2"
                        }`}
                        style={{
                          transitionProperty:
                            "border-color, background-color, color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </Section>

                {/* Output */}
                <Section label="Output" defaultOpen={false}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted">
                        Format
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-md bg-paper-3 border border-rule text-sm text-ink outline-none transition-colors focus-visible:border-accent"
                        style={{
                          transitionProperty: "border-color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        <option>PNG</option>
                        <option>JPEG</option>
                        <option>WebP</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted">
                        Seed
                      </label>
                      <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="Random"
                        className="w-full px-3 py-2 rounded-md bg-paper-3 border border-rule text-sm text-ink placeholder:text-neutral outline-none transition-colors focus-visible:border-accent"
                        style={{
                          transitionProperty: "border-color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      />
                    </div>
                  </div>
                  {/* Batch count */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-muted">
                        Batch
                      </label>
                      <span className="text-xs font-mono text-neutral tabular-nums">
                        {batchCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={batchCount}
                      onChange={(e) =>
                        setBatchCount(Number(e.target.value))
                      }
                      className="w-full h-1 rounded-full appearance-none bg-rule-2 accent-accent cursor-pointer"
                    />
                  </div>
                </Section>
              </div>
            </div>

            {/* Generate button — sticky bottom */}
            <div className="mt-auto p-5 border-t border-rule bg-paper">
              <motion.button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                whileTap={
                  !prompt.trim() || isGenerating ? undefined : { scale: 0.98 }
                }
                className={`w-full py-3 rounded-lg text-sm font-display font-semibold tracking-wide transition-colors ${
                  !prompt.trim() || isGenerating
                    ? "bg-paper-3 text-neutral cursor-not-allowed"
                    : "bg-accent text-accent-ink hover:bg-accent-hover"
                }`}
                style={{
                  transitionProperty: "background-color, color",
                  transitionDuration: "var(--dur-short)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating\u2026
                  </span>
                ) : (
                  generateLabel
                )}
              </motion.button>
            </div>
          </div>

          {/* Right Panel — Output */}
          <div className="flex-1 flex flex-col min-w-0">
            {generatedImages.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-xl border border-rule flex items-center justify-center mb-5">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">
                  Your canvas awaits
                </h3>
                <p className="text-sm text-muted max-w-xs leading-relaxed">
                  Describe what you see in your mind. Frame will bring it to
                  life.
                </p>
              </div>
            ) : (
              /* Generated images */
              <div className="flex-1 overflow-y-auto p-5">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {generatedImages.map((img) => (
                    <motion.div
                      key={img.id}
                      variants={fadeItem}
                      className="group relative rounded-lg overflow-hidden border border-rule hover:border-rule-2 transition-transform"
                      style={{
                        transitionProperty: "transform, box-shadow, border-color",
                        transitionDuration: "var(--dur-short)",
                        transitionTimingFunction: "var(--ease-out)",
                      }}
                      whileHover={{ y: -3 }}
                    >
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full aspect-square object-cover"
                      />
                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end p-3"
                        style={{
                          transitionProperty: "opacity",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        <div className="flex items-end justify-between w-full">
                          <span className="text-xs text-white/90 font-mono truncate max-w-[70%]">
                            {img.prompt}
                          </span>
                          <div className="flex gap-1">
                            <button
                              className="p-1.5 rounded-md bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm"
                              style={{
                                transitionProperty: "background-color",
                                transitionDuration: "var(--dur-micro)",
                                transitionTimingFunction: "var(--ease-out)",
                              }}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              className="p-1.5 rounded-md bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm"
                              style={{
                                transitionProperty: "background-color",
                                transitionDuration: "var(--dur-micro)",
                                transitionTimingFunction: "var(--ease-out)",
                              }}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
