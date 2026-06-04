"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";

/* ─── Tool definitions ────────────────────────────────────────────── */

const tools = [
  {
    id: "select",
    label: "Select",
    shortcut: "V",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3a2 2 0 0 0-2 2" />
        <path d="M19 3a2 2 0 0 1 2 2" />
        <path d="M21 19a2 2 0 0 1-2 2" />
        <path d="M5 21a2 2 0 0 1-2-2" />
        <path d="M9 3h1" /><path d="M9 21h1" />
        <path d="M14 3h1" /><path d="M14 21h1" />
        <path d="M3 9v1" /><path d="M21 9v1" />
        <path d="M3 14v1" /><path d="M21 14v1" />
      </svg>
    ),
  },
  {
    id: "crop",
    label: "Crop",
    shortcut: "C",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </svg>
    ),
  },
  {
    id: "brush",
    label: "Brush",
    shortcut: "B",
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
    shortcut: "E",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
        <path d="M22 21H7" />
        <path d="m5 11 9 9" />
      </svg>
    ),
  },
  {
    id: "text",
    label: "Text",
    shortcut: "T",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: "adjustments",
    label: "Adjustments",
    shortcut: "A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    id: "ai-enhance",
    label: "AI Enhance",
    shortcut: "I",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" /><path d="M12 18v4" />
        <path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" />
        <path d="M2 12h4" /><path d="M18 12h4" />
        <path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
  },
] as const;

type ToolId = (typeof tools)[number]["id"];

/* ─── Adjustment slider config ────────────────────────────────────── */

const adjustmentSliders = [
  { label: "Brightness", key: "brightness", min: -100, max: 100 },
  { label: "Contrast", key: "contrast", min: -100, max: 100 },
  { label: "Saturation", key: "saturation", min: -100, max: 100 },
  { label: "Hue", key: "hue", min: -180, max: 180 },
] as const;

/* ─── AI Enhance actions ──────────────────────────────────────────── */

const aiActions = [
  {
    id: "upscale",
    label: "Upscale 2\u00d7",
    description: "Double resolution with detail preservation",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
        <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
        <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
        <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
      </svg>
    ),
  },
  {
    id: "remove-bg",
    label: "Remove Background",
    description: "Isolate subject from background",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22h20" />
        <path d="M6.36 17.4 4 17l-2-4 4.01-2.21" />
        <path d="m10.39 7.73 2.61-.73 2 4-3.46 1.91" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: "restore-faces",
    label: "Restore Faces",
    description: "Enhance facial details and clarity",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
];

/* ─── Animation config ────────────────────────────────────────────── */

const panelVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const panelTransition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1] as const,
};

const transitionStyle = {
  transitionProperty: "border-color, background-color, color",
  transitionDuration: "var(--dur-short)",
  transitionTimingFunction: "var(--ease-out)",
};

/* ─── Editor page ─────────────────────────────────────────────────── */

export default function Editor() {
  const [activeTool, setActiveTool] = useState<ToolId>("select");
  const [hasImage, setHasImage] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [canUndo] = useState(false);
  const [canRedo] = useState(false);

  const [adjustmentValues, setAdjustmentValues] = useState<Record<string, number>>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
  });

  const updateAdjustment = useCallback((key: string, value: number) => {
    setAdjustmentValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleOpenImage = useCallback(() => {
    setHasImage(true);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 25, 400));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 25, 25));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-paper">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="h-14 border-b border-rule flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-base font-semibold text-ink">
              Editor
            </h1>

            {/* Undo / Redo */}
            <div className="flex items-center gap-1 ml-2">
              <motion.button
                whileTap={canUndo ? { scale: 0.98 } : undefined}
                disabled={!canUndo}
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  canUndo
                    ? "text-muted hover:text-ink-2 hover:bg-paper-3"
                    : "opacity-55 cursor-not-allowed text-neutral"
                }`}
                style={transitionStyle}
                aria-label="Undo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </motion.button>
              <motion.button
                whileTap={canRedo ? { scale: 0.98 } : undefined}
                disabled={!canRedo}
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  canRedo
                    ? "text-muted hover:text-ink-2 hover:bg-paper-3"
                    : "opacity-55 cursor-not-allowed text-neutral"
                }`}
                style={transitionStyle}
                aria-label="Redo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                </svg>
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="h-9 px-3.5 rounded-lg text-sm font-medium text-muted hover:text-ink-2"
              style={transitionStyle}
            >
              Reset
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="h-9 px-3.5 rounded-lg text-sm font-medium bg-paper-3 border border-rule text-muted hover:text-ink-2 hover:border-rule-2"
              style={transitionStyle}
            >
              Save
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="h-9 px-4 rounded-lg text-sm font-display font-semibold bg-accent text-accent-ink hover:bg-accent-hover"
              style={{
                transitionProperty: "background-color",
                transitionDuration: "var(--dur-short)",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              Export
            </motion.button>
          </div>
        </header>

        {/* ── Editor body ────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── Left toolbar (56px) ──────────────────────────────── */}
          <div className="w-14 flex flex-col items-center py-3 border-r border-rule bg-paper shrink-0 gap-0.5">
            {tools.map((tool) => {
              const isActive = activeTool === tool.id;
              return (
                <motion.button
                  key={tool.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTool(tool.id)}
                  className={`relative w-10 h-10 rounded-lg flex items-center justify-center border group ${
                    isActive
                      ? "bg-accent-subtle border-accent text-accent"
                      : "border-transparent text-neutral hover:text-ink-2 hover:bg-paper-3"
                  }`}
                  style={transitionStyle}
                  aria-label={tool.label}
                  aria-pressed={isActive}
                >
                  {tool.icon}

                  {/* Tooltip */}
                  <span
                    className="absolute left-full ml-2 px-2 py-1 rounded-md bg-paper-3 border border-rule text-xs font-medium text-ink whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10"
                    style={{
                      transitionProperty: "opacity",
                      transitionDuration: "var(--dur-short)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                    role="tooltip"
                  >
                    {tool.label}
                    <span className="ml-1.5 font-mono text-neutral">{tool.shortcut}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* ── Canvas area ──────────────────────────────────────── */}
          <div className="flex-1 relative flex items-center justify-center bg-paper-2 overflow-hidden">
            {hasImage ? (
              <div className="relative rounded-lg border border-rule overflow-hidden">
                <img
                  src="https://picsum.photos/seed/editor/800/600"
                  alt="Editor canvas"
                  className="max-w-full max-h-[calc(100vh-180px)] object-contain"
                  style={{
                    filter: `brightness(${100 + adjustmentValues.brightness}%) contrast(${100 + adjustmentValues.contrast}%) saturate(${100 + adjustmentValues.saturation}%) hue-rotate(${adjustmentValues.hue}deg)`,
                  }}
                />
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center gap-4 text-center px-6">
                <div className="w-14 h-14 rounded-xl bg-paper-3 border border-rule flex items-center justify-center text-neutral">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-ink">
                    Open an image to start editing
                  </p>
                  <p className="text-xs text-neutral mt-1">
                    Adjustments, brushes, and AI tools become available once an image is loaded.
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenImage}
                  className="h-10 px-5 rounded-lg text-sm font-display font-semibold bg-accent text-accent-ink hover:bg-accent-hover"
                  style={{
                    transitionProperty: "background-color",
                    transitionDuration: "var(--dur-short)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  Open Image
                </motion.button>
              </div>
            )}

            {/* ── Zoom controls (bottom-left) ────────────────────── */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-paper border border-rule rounded-lg p-0.5">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleZoomOut}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-ink-2 hover:bg-paper-3"
                style={transitionStyle}
                aria-label="Zoom out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </motion.button>
              <span className="w-12 text-center font-mono text-xs text-neutral tabular-nums select-none">
                {zoom}%
              </span>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleZoomIn}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-ink-2 hover:bg-paper-3"
                style={transitionStyle}
                aria-label="Zoom in"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* ── Right panel (280px) ──────────────────────────────── */}
          <div className="w-[280px] flex flex-col border-l border-rule bg-paper shrink-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Adjustments panel */}
              {activeTool === "adjustments" && (
                <motion.div
                  key="adjustments"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={panelTransition}
                  className="p-4"
                >
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral mb-4">
                    Adjustments
                  </h3>
                  <div className="space-y-5">
                    {adjustmentSliders.map((slider) => (
                      <div key={slider.key}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted">
                            {slider.label}
                          </label>
                          <span className="font-mono text-xs text-neutral tabular-nums min-w-[3ch] text-right">
                            {adjustmentValues[slider.key] > 0 ? "+" : ""}
                            {adjustmentValues[slider.key]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={slider.min}
                          max={slider.max}
                          value={adjustmentValues[slider.key]}
                          onChange={(e) =>
                            updateAdjustment(slider.key, Number(e.target.value))
                          }
                          className="w-full h-1.5 rounded-full appearance-none bg-paper-3 accent-accent cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AI Enhance panel */}
              {activeTool === "ai-enhance" && (
                <motion.div
                  key="ai-enhance"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={panelTransition}
                  className="p-4"
                >
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral mb-4">
                    AI Enhance
                  </h3>
                  <div className="divide-y divide-rule">
                    {aiActions.map((action) => (
                      <motion.button
                        key={action.id}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-start gap-3 py-3 first:pt-0 last:pb-0 text-left group"
                      >
                        <span
                          className="mt-0.5 text-neutral group-hover:text-accent shrink-0"
                          style={{
                            transitionProperty: "color",
                            transitionDuration: "var(--dur-short)",
                            transitionTimingFunction: "var(--ease-out)",
                          }}
                        >
                          {action.icon}
                        </span>
                        <div>
                          <span
                            className="text-sm font-medium text-ink-2 group-hover:text-ink block"
                            style={{
                              transitionProperty: "color",
                              transitionDuration: "var(--dur-short)",
                              transitionTimingFunction: "var(--ease-out)",
                            }}
                          >
                            {action.label}
                          </span>
                          <span className="text-xs text-neutral mt-0.5 block">
                            {action.description}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Brush panel */}
              {activeTool === "brush" && (
                <motion.div
                  key="brush"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={panelTransition}
                  className="p-4"
                >
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral mb-4">
                    Brush
                  </h3>
                  <div className="space-y-5">
                    {[
                      { label: "Size", defaultVal: 20, min: 1, max: 100, unit: "px" },
                      { label: "Opacity", defaultVal: 100, min: 0, max: 100, unit: "%" },
                      { label: "Hardness", defaultVal: 80, min: 0, max: 100, unit: "%" },
                    ].map((param) => (
                      <BrushSlider key={param.label} {...param} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Eraser panel */}
              {activeTool === "eraser" && (
                <motion.div
                  key="eraser"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={panelTransition}
                  className="p-4"
                >
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral mb-4">
                    Eraser
                  </h3>
                  <div className="space-y-5">
                    {[
                      { label: "Size", defaultVal: 30, min: 1, max: 100, unit: "px" },
                      { label: "Hardness", defaultVal: 50, min: 0, max: 100, unit: "%" },
                    ].map((param) => (
                      <BrushSlider key={param.label} {...param} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Default panel for tools without specific controls */}
              {!["adjustments", "ai-enhance", "brush", "eraser"].includes(activeTool) && (
                <motion.div
                  key="default"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={panelTransition}
                  className="p-4"
                >
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral mb-4">
                    {tools.find((t) => t.id === activeTool)?.label}
                  </h3>
                  <p className="text-sm text-muted">
                    No configurable properties for this tool.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Brush slider sub-component ──────────────────────────────────── */

function BrushSlider({
  label,
  defaultVal,
  min,
  max,
  unit,
}: {
  label: string;
  defaultVal: number;
  min: number;
  max: number;
  unit: string;
}) {
  const [value, setValue] = useState(defaultVal);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-muted">{label}</label>
        <span className="font-mono text-xs text-neutral tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-paper-3 accent-accent cursor-pointer"
      />
    </div>
  );
}
