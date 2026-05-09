"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

const sizePresets = [
  { label: "Square", value: "1024x1024", dims: "1:1" },
  { label: "Portrait", value: "1024x1792", dims: "9:16" },
  { label: "Landscape", value: "1792x1024", dims: "16:9" },
  { label: "Wide", value: "1920x1080", dims: "16:9" },
  { label: "Custom", value: "custom", dims: "?" },
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

const backgroundOptions = [
  { label: "Auto", value: "auto" },
  { label: "Transparent", value: "transparent" },
  { label: "Solid", value: "solid" },
  { label: "Blur", value: "blur" },
];

const formatOptions = [
  { label: "PNG", value: "png" },
  { label: "JPEG", value: "jpeg" },
  { label: "WebP", value: "webp" },
];

export default function Studio() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState("1024x1024");
  const [selectedQuality, setSelectedQuality] = useState("hd");
  const [selectedStyle, setSelectedStyle] = useState("vivid");
  const [selectedBackground, setSelectedBackground] = useState("auto");
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [batchCount, setBatchCount] = useState(1);
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock generated images
  const [generatedImages, setGeneratedImages] = useState<
    { id: number; url: string; prompt: string }[]
  >([]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg)]">
        {/* Header */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0">
          <h1 className="font-[family-name:var(--font-manrope)] text-base font-semibold text-[var(--text1)]">
            Studio
          </h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-colors">
              History
            </button>
            <button className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-colors">
              Templates
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Prompt & Controls */}
          <div className="w-[420px] flex flex-col border-r border-[var(--border)] overflow-y-auto">
            <div className="p-5 space-y-6">
              {/* Prompt */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full h-28 p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Negative Prompt */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                  Negative Prompt
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Things to exclude..."
                  className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sizePresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setSelectedSize(preset.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedSize === preset.value
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)]"
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">{preset.dims}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                  Quality
                </label>
                <div className="space-y-2">
                  {qualityOptions.map((q) => (
                    <button
                      key={q.value}
                      onClick={() => setSelectedQuality(q.value)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedQuality === q.value
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)]"
                      }`}
                    >
                      <span className="font-medium">{q.label}</span>
                      <span className="text-xs opacity-60">{q.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                  Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedStyle === style.value
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)]"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                  Background
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => setSelectedBackground(bg.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedBackground === bg.value
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)]"
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format & Seed */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                    Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  >
                    {formatOptions.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                    Seed
                  </label>
                  <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Random"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {/* Batch Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)]">
                    Batch Count
                  </label>
                  <span className="text-xs text-[var(--text3)]">{batchCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-[var(--surface3)] accent-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="p-5 border-t border-[var(--border)] sticky bottom-0 bg-[var(--bg)]">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ${
                  !prompt.trim() || isGenerating
                    ? "bg-[var(--surface3)] text-[var(--text4)] cursor-not-allowed"
                    : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent)]/20"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  `Generate ${batchCount > 1 ? `${batchCount} Images` : "Image"}`
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 flex flex-col min-w-0">
            {generatedImages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface1)] border border-[var(--border)] flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-[var(--text1)] mb-2">
                  Start Creating
                </h3>
                <p className="text-sm text-[var(--text3)] max-w-sm">
                  Enter a prompt and configure your output settings. Your generated images will appear here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-4">
                  {generatedImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative rounded-xl overflow-hidden bg-[var(--surface1)] border border-[var(--border)] hover:border-[var(--border-visible)] transition-all"
                    >
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                        <span className="text-xs text-white truncate max-w-[70%]">
                          {img.prompt}
                        </span>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
