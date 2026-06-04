"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabId = "api" | "output" | "advanced";
type Provider = "openai" | "stability" | "replicate";
type ConnectionStatus = "connected" | "untested" | "error";
type OutputFormat = "PNG" | "JPEG" | "WebP";
type SizePreset = "1024×1024" | "1024×1792" | "1792×1024";

const tabs: { id: TabId; label: string }[] = [
  { id: "api", label: "API" },
  { id: "output", label: "Output" },
  { id: "advanced", label: "Advanced" },
];

const providers: { id: Provider; name: string; description: string }[] = [
  { id: "openai", name: "OpenAI", description: "DALL·E 3, GPT-Image" },
  { id: "stability", name: "Stability AI", description: "Stable Diffusion XL, SD3" },
  { id: "replicate", name: "Replicate", description: "Community models, Flux" },
];

const models: Record<Provider, string[]> = {
  openai: ["gpt-image-1", "dall-e-3", "dall-e-2"],
  stability: ["stable-diffusion-xl", "sd3-medium", "sd3-large"],
  replicate: ["flux-1.1-pro", "flux-schnell", "sdxl"],
};

const sizePresets: SizePreset[] = ["1024×1024", "1024×1792", "1792×1024"];
const formats: OutputFormat[] = ["PNG", "JPEG", "WebP"];

/* ------------------------------------------------------------------ */
/*  Shared transition style (never transition-all)                     */
/* ------------------------------------------------------------------ */

const borderTransition = {
  transitionProperty: "border-color, background-color",
  transitionDuration: "var(--dur-short)",
  transitionTimingFunction: "var(--ease-out)",
};

const colorTransition = {
  transitionProperty: "color, background-color",
  transitionDuration: "var(--dur-short)",
  transitionTimingFunction: "var(--ease-out)",
};

/* ------------------------------------------------------------------ */
/*  Crossfade animation variants                                       */
/* ------------------------------------------------------------------ */

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const fadeTransition = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1] as const,
};

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-[22px] rounded-full shrink-0 ${
        checked ? "bg-accent" : "bg-paper-3 border border-rule"
      }`}
      style={borderTransition}
    >
      <motion.span
        className="absolute top-[3px] w-4 h-4 rounded-full bg-paper shadow-sm"
        animate={{ left: checked ? 20 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Dot                                                         */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: ConnectionStatus }) {
  const color =
    status === "connected"
      ? "bg-success"
      : status === "error"
      ? "bg-error"
      : "bg-warning";

  const label =
    status === "connected"
      ? "Connected"
      : status === "error"
      ? "Connection failed"
      : "Not tested";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-neutral">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline Spinner                                                     */
/* ------------------------------------------------------------------ */

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

export default function Settings() {
  /* --- Tab state --- */
  const [activeTab, setActiveTab] = useState<TabId>("api");

  /* --- API tab state --- */
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models.openai[0]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("untested");
  const [isTesting, setIsTesting] = useState(false);

  /* --- Output tab state --- */
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("PNG");
  const [quality, setQuality] = useState(80);
  const [sizePreset, setSizePreset] = useState<SizePreset>("1024×1024");
  const [autoSave, setAutoSave] = useState(true);
  const outputDir = "~/Documents/Frame/output";

  /* --- Advanced tab state --- */
  const [historyRetention, setHistoryRetention] = useState("30");

  /* --- Handlers --- */
  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate network request
    await new Promise((r) => window.setTimeout(r, 1500));
    setConnectionStatus(apiKey.length > 0 ? "connected" : "error");
    setIsTesting(false);
  };

  const handleProviderChange = (p: Provider) => {
    setProvider(p);
    setSelectedModel(models[p][0]);
    setConnectionStatus("untested");
  };

  /* --- Reusable label --- */
  const FieldLabel = ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium text-muted mb-1.5"
    >
      {children}
    </label>
  );

  const HelperText = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs text-neutral mt-1.5">{children}</p>
  );

  const inputClass =
    "w-full bg-paper-3 border border-rule rounded-md px-3 py-2.5 text-sm text-ink placeholder:text-neutral outline-none focus-visible:border-accent";

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-paper">
        {/* ---- Header ---- */}
        <header className="h-14 border-b border-rule flex items-center justify-between px-6 shrink-0">
          <h1 className="font-display text-base font-semibold text-ink">
            Settings
          </h1>
        </header>

        {/* ---- Tabs ---- */}
        <div className="px-6 border-b border-rule">
          <div className="flex items-center gap-6 -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 pt-3 text-sm font-medium ${
                    isActive ? "text-ink" : "text-muted"
                  }`}
                  style={colorTransition}
                >
                  {tab.label}

                  {isActive && (
                    <motion.span
                      layoutId="settings-tab"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-accent rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Content ---- */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {/* ============================================== */}
              {/*  API TAB                                        */}
              {/* ============================================== */}
              {activeTab === "api" && (
                <motion.div
                  key="api"
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={fadeTransition}
                  className="space-y-8"
                >
                  {/* Section heading */}
                  <h2 className="font-display text-sm font-semibold text-ink-2 mb-4">
                    API Configuration
                  </h2>

                  {/* Provider selector */}
                  <div>
                    <FieldLabel>Provider</FieldLabel>
                    <div className="grid grid-cols-3 gap-3 mt-1.5">
                      {providers.map((p) => {
                        const isSelected = provider === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleProviderChange(p.id)}
                            className={`text-left p-3 rounded-lg border ${
                              isSelected
                                ? "border-accent bg-accent-subtle"
                                : "border-rule bg-paper-3"
                            }`}
                            style={borderTransition}
                          >
                            <span className="block text-sm font-medium text-ink">
                              {p.name}
                            </span>
                            <span className="block text-xs text-neutral mt-0.5">
                              {p.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* API Key */}
                  <div>
                    <FieldLabel htmlFor="api-key">API Key</FieldLabel>
                    <div className="relative">
                      <input
                        id="api-key"
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setConnectionStatus("untested");
                        }}
                        placeholder="sk-..."
                        className={`${inputClass} pr-10`}
                        style={borderTransition}
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                        style={colorTransition}
                        aria-label={showKey ? "Hide key" : "Show key"}
                      >
                        {showKey ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <HelperText>
                      Your key is stored locally and never sent to our servers.
                    </HelperText>
                  </div>

                  {/* Model selector */}
                  <div>
                    <FieldLabel htmlFor="model-select">Model</FieldLabel>
                    <select
                      id="model-select"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className={inputClass}
                      style={borderTransition}
                    >
                      {models[provider].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test connection + status */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTestConnection}
                      disabled={isTesting || !apiKey}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-paper-3 border border-rule text-muted disabled:opacity-50"
                      style={borderTransition}
                    >
                      {isTesting && <Spinner />}
                      {isTesting ? "Testing\u2026" : "Test connection"}
                    </motion.button>

                    <StatusDot status={connectionStatus} />
                  </div>
                </motion.div>
              )}

              {/* ============================================== */}
              {/*  OUTPUT TAB                                      */}
              {/* ============================================== */}
              {activeTab === "output" && (
                <motion.div
                  key="output"
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={fadeTransition}
                  className="space-y-8"
                >
                  <h2 className="font-display text-sm font-semibold text-ink-2 mb-4">
                    Output Defaults
                  </h2>

                  {/* Format selector */}
                  <div>
                    <FieldLabel>Default Format</FieldLabel>
                    <div className="flex gap-2 mt-1.5">
                      {formats.map((fmt) => {
                        const isSelected = outputFormat === fmt;
                        return (
                          <motion.button
                            key={fmt}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setOutputFormat(fmt)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                              isSelected
                                ? "bg-accent text-accent-ink"
                                : "bg-paper-3 border border-rule text-muted"
                            }`}
                            style={borderTransition}
                          >
                            {fmt}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quality slider */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <FieldLabel>Default Quality</FieldLabel>
                      <span className="text-xs font-mono text-neutral">
                        {quality}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-[var(--color-accent)] h-1.5 rounded-full bg-paper-3"
                    />
                    <HelperText>
                      Higher quality increases file size. 80% is a good balance.
                    </HelperText>
                  </div>

                  {/* Size preset */}
                  <div>
                    <FieldLabel>Default Size</FieldLabel>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {sizePresets.map((size) => {
                        const isSelected = sizePreset === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setSizePreset(size)}
                            className={`px-3 py-2.5 rounded-md text-xs font-mono font-medium ${
                              isSelected
                                ? "border-accent bg-accent-subtle text-ink border"
                                : "bg-paper-3 border border-rule text-muted"
                            }`}
                            style={borderTransition}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto-save toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-paper-3 border border-rule">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Auto-save generations
                      </p>
                      <p className="text-xs text-neutral mt-0.5">
                        Save all generated images to the output directory
                      </p>
                    </div>
                    <Toggle checked={autoSave} onChange={setAutoSave} />
                  </div>

                  {/* Output directory */}
                  <div>
                    <FieldLabel>Output Directory</FieldLabel>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex-1 px-3 py-2.5 rounded-md bg-paper-3 border border-rule text-sm font-mono text-muted truncate">
                        {outputDir}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium bg-paper-3 border border-rule text-muted shrink-0"
                        style={borderTransition}
                      >
                        Change
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ============================================== */}
              {/*  ADVANCED TAB                                    */}
              {/* ============================================== */}
              {activeTab === "advanced" && (
                <motion.div
                  key="advanced"
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={fadeTransition}
                  className="space-y-8"
                >
                  <h2 className="font-display text-sm font-semibold text-ink-2 mb-4">
                    Storage &amp; Data
                  </h2>

                  {/* Storage usage */}
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm font-medium text-ink">
                        Storage used
                      </span>
                      <span className="text-xs font-mono text-neutral">
                        1.2 / 5.0 GB
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-paper-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: "24%" }}
                      />
                    </div>
                  </div>

                  {/* Clear cache */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Cached data
                      </p>
                      <p className="text-xs text-neutral mt-0.5">
                        Thumbnails and temporary files
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium bg-paper-3 border border-rule text-muted"
                      style={borderTransition}
                    >
                      Clear cache
                    </motion.button>
                  </div>

                  {/* History retention */}
                  <div>
                    <FieldLabel htmlFor="history-retention">
                      History Retention
                    </FieldLabel>
                    <select
                      id="history-retention"
                      value={historyRetention}
                      onChange={(e) => setHistoryRetention(e.target.value)}
                      className={inputClass}
                      style={borderTransition}
                    >
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                      <option value="forever">Forever</option>
                    </select>
                    <HelperText>
                      How long to keep generation history before automatic
                      cleanup.
                    </HelperText>
                  </div>

                  {/* ---- Danger zone ---- */}
                  <div className="pt-6">
                    <h3 className="text-xs font-semibold tracking-widest uppercase text-error mb-4">
                      Danger Zone
                    </h3>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-rule">
                      <div>
                        <p className="text-sm font-medium text-ink">
                          Reset all settings
                        </p>
                        <p className="text-xs text-neutral mt-0.5">
                          Restores every option to its factory default. This
                          cannot be undone.
                        </p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-error text-accent-ink shrink-0"
                        style={{
                          transitionProperty: "background-color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        Reset
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
