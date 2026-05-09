"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

const tools = [
  {
    id: "brush",
    label: "Brush",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
        <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2.5 2.24 0 .46.62.8.62.8" />
      </svg>
    ),
  },
  {
    id: "eraser",
    label: "Eraser",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
        <path d="M22 21H7" />
        <path d="m5 11 9 9" />
      </svg>
    ),
  },
  {
    id: "select",
    label: "Select",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3a2 2 0 0 0-2 2" />
        <path d="M19 3a2 2 0 0 1 2 2" />
        <path d="M21 19a2 2 0 0 1-2 2" />
        <path d="M5 21a2 2 0 0 1-2-2" />
        <path d="M9 3h1" />
        <path d="M9 21h1" />
        <path d="M14 3h1" />
        <path d="M14 21h1" />
        <path d="M3 9v1" />
        <path d="M21 9v1" />
        <path d="M3 14v1" />
        <path d="M21 14v1" />
      </svg>
    ),
  },
  {
    id: "crop",
    label: "Crop",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </svg>
    ),
  },
];

const adjustments = [
  { label: "Brightness", key: "brightness", min: -100, max: 100, default: 0 },
  { label: "Contrast", key: "contrast", min: -100, max: 100, default: 0 },
  { label: "Saturation", key: "saturation", min: -100, max: 100, default: 0 },
  { label: "Warmth", key: "warmth", min: -100, max: 100, default: 0 },
];

export default function Editor() {
  const [activeTool, setActiveTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(20);
  const [adjustmentValues, setAdjustmentValues] = useState<Record<string, number>>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
  });

  const updateAdjustment = (key: string, value: number) => {
    setAdjustmentValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg)]">
        {/* Header */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0">
          <h1 className="font-[family-name:var(--font-manrope)] text-base font-semibold text-[var(--text1)]">
            Editor
          </h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] border border-[var(--border)] transition-colors">
              Reset
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
              Save
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] border border-[var(--border)] transition-colors">
              Export
            </button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <div className="w-14 flex flex-col items-center py-4 border-r border-[var(--border)] bg-[var(--surface1)] gap-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  activeTool === tool.id
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)]"
                }`}
                title={tool.label}
              >
                {tool.icon}
              </button>
            ))}
            <div className="w-8 h-px bg-[var(--border)] my-2" />
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-all" title="Undo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-all" title="Redo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
              </svg>
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-[var(--bg)] p-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/20 border border-[var(--border)]">
              <img
                src="https://picsum.photos/seed/editor/800/600"
                alt="Editor canvas"
                className="max-w-full max-h-[calc(100vh-180px)] object-contain"
                style={{
                  filter: `brightness(${100 + adjustmentValues.brightness}%) contrast(${100 + adjustmentValues.contrast}%) saturate(${100 + adjustmentValues.saturation}%)`,
                }}
              />
              {/* Overlay for editing indication */}
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-[var(--accent)]/30 rounded-xl" />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[280px] flex flex-col border-l border-[var(--border)] overflow-y-auto bg-[var(--surface1)]">
            {/* Brush Settings */}
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)] mb-3">
                Brush
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-[var(--text2)]">Size</label>
                    <span className="text-xs text-[var(--text3)]">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-[var(--surface3)] accent-[var(--accent)] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-[var(--text2)]">Opacity</label>
                    <span className="text-xs text-[var(--text3)]">100%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="100"
                    className="w-full h-1.5 rounded-full appearance-none bg-[var(--surface3)] accent-[var(--accent)] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-[var(--text2)]">Hardness</label>
                    <span className="text-xs text-[var(--text3)]">80%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-full h-1.5 rounded-full appearance-none bg-[var(--surface3)] accent-[var(--accent)] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Adjustments */}
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)] mb-3">
                Adjustments
              </h3>
              <div className="space-y-4">
                {adjustments.map((adj) => (
                  <div key={adj.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-[var(--text2)]">{adj.label}</label>
                      <span className="text-xs text-[var(--text3)] tabular-nums">
                        {adjustmentValues[adj.key] > 0 ? "+" : ""}
                        {adjustmentValues[adj.key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={adj.min}
                      max={adj.max}
                      value={adjustmentValues[adj.key]}
                      onChange={(e) => updateAdjustment(adj.key, Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none bg-[var(--surface3)] accent-[var(--accent)] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text3)] mb-3">
                AI Actions
              </h3>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text2)] hover:text-[var(--text1)] bg-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
                Remove Background
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text2)] hover:text-[var(--text1)] bg-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                  <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                  <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                  <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                </svg>
                Upscale 2x
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text2)] hover:text-[var(--text1)] bg-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                Inpaint Selection
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text2)] hover:text-[var(--text1)] bg-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 12-4-4-4 4" />
                  <path d="M12 16V8" />
                </svg>
                Style Transfer
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
