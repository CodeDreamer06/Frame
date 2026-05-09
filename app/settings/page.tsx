"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  isActive: boolean;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("api");
  const [baseUrl, setBaseUrl] = useState("https://api.openai.com/v1");
  const [timeout, setTimeout] = useState(30);
  const [retries, setRetries] = useState(3);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "1", name: "Primary Key", key: "sk-••••••••••••••••••••••••••••••", provider: "OpenAI", isActive: true },
    { id: "2", name: "Backup Key", key: "sk-••••••••••••••••••••••••••••••", provider: "OpenAI", isActive: true },
  ]);
  const [showAddKey, setShowAddKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("OpenAI");

  const addApiKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    setApiKeys([
      ...apiKeys,
      {
        id: Date.now().toString(),
        name: newKeyName,
        key: newKeyValue.slice(0, 7) + "••••••••••••••••••••••••••••••",
        provider: newKeyProvider,
        isActive: true,
      },
    ]);
    setNewKeyName("");
    setNewKeyValue("");
    setShowAddKey(false);
  };

  const toggleKey = (id: string) => {
    setApiKeys(
      apiKeys.map((k) => (k.id === id ? { ...k, isActive: !k.isActive } : k))
    );
  };

  const removeKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const tabs = [
    { id: "api", label: "API Configuration" },
    { id: "output", label: "Output Defaults" },
    { id: "storage", label: "Storage" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg)]">
        {/* Header */}
        <header className="h-14 border-b border-[var(--border)] flex items-center px-6 shrink-0">
          <h1 className="font-[family-name:var(--font-manrope)] text-base font-semibold text-[var(--text1)]">
            Settings
          </h1>
        </header>

        {/* Tabs */}
        <div className="px-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text3)] hover:text-[var(--text1)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* API Configuration */}
            {activeTab === "api" && (
              <>
                <section>
                  <h2 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-[var(--text1)] mb-1">
                    API Configuration
                  </h2>
                  <p className="text-sm text-[var(--text3)] mb-6">
                    Configure your AI provider settings and manage API keys.
                  </p>

                  <div className="space-y-5">
                    {/* Base URL */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="https://api.openai.com/v1"
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                      />
                      <p className="text-xs text-[var(--text3)]">
                        Custom endpoint for self-hosted or proxy setups
                      </p>
                    </div>

                    {/* Timeout & Retries */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text1)]">
                          Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          value={timeout}
                          onChange={(e) => setTimeout(Number(e.target.value))}
                          min="5"
                          max="120"
                          className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text1)]">
                          Max Retries
                        </label>
                        <input
                          type="number"
                          value={retries}
                          onChange={(e) => setRetries(Number(e.target.value))}
                          min="0"
                          max="10"
                          className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* API Keys */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-base font-semibold text-[var(--text1)]">
                        API Keys
                      </h3>
                      <p className="text-xs text-[var(--text3)] mt-0.5">
                        Multiple keys are rotated in round-robin fashion
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddKey(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
                    >
                      Add Key
                    </button>
                  </div>

                  <div className="space-y-2">
                    {apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-[var(--surface1)] border border-[var(--border)]"
                      >
                        <button
                          onClick={() => toggleKey(key.id)}
                          className={`w-9 h-5 rounded-full transition-colors relative ${
                            key.isActive ? "bg-[var(--accent)]" : "bg-[var(--surface3)]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                              key.isActive ? "left-[18px]" : "left-0.5"
                            }`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text1)]">{key.name}</p>
                          <p className="text-xs text-[var(--text3)] font-mono">{key.key}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface2)] text-[var(--text3)]">
                          {key.provider}
                        </span>
                        <button
                          onClick={() => removeKey(key.id)}
                          className="p-1.5 rounded-md text-[var(--text4)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Key Form */}
                  {showAddKey && (
                    <div className="mt-4 p-4 rounded-xl bg-[var(--surface1)] border border-[var(--border)] space-y-3">
                      <h4 className="text-sm font-medium text-[var(--text1)]">Add New API Key</h4>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key name (e.g., Production)"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] focus:outline-none focus:border-[var(--accent)]"
                      />
                      <input
                        type="password"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] focus:outline-none focus:border-[var(--accent)]"
                      />
                      <select
                        value={newKeyProvider}
                        onChange={(e) => setNewKeyProvider(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)]"
                      >
                        <option>OpenAI</option>
                        <option>Stability AI</option>
                        <option>Anthropic</option>
                        <option>Custom</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={addApiKey}
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
                        >
                          Add Key
                        </button>
                        <button
                          onClick={() => setShowAddKey(false)}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Output Defaults */}
            {activeTab === "output" && (
              <>
                <section>
                  <h2 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-[var(--text1)] mb-1">
                    Output Defaults
                  </h2>
                  <p className="text-sm text-[var(--text3)] mb-6">
                    Default settings for image generation.
                  </p>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">Default Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["1024x1024", "1024x1792", "1792x1024"].map((size) => (
                          <button
                            key={size}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)] transition-all"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">Default Quality</label>
                      <select className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)]">
                        <option>Standard</option>
                        <option selected>HD</option>
                        <option>Ultra</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">Default Style</label>
                      <select className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)]">
                        <option selected>Vivid</option>
                        <option>Natural</option>
                        <option>Cinematic</option>
                        <option>Anime</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">Default Format</label>
                      <div className="flex gap-2">
                        {["PNG", "JPEG", "WebP"].map((fmt) => (
                          <button
                            key={fmt}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                              fmt === "PNG"
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)]"
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">Default Background</label>
                      <select className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] focus:outline-none focus:border-[var(--accent)]">
                        <option selected>Auto</option>
                        <option>Transparent</option>
                        <option>Solid</option>
                        <option>Blur</option>
                      </select>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Storage */}
            {activeTab === "storage" && (
              <>
                <section>
                  <h2 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-[var(--text1)] mb-1">
                    Local Storage
                  </h2>
                  <p className="text-sm text-[var(--text3)] mb-6">
                    Manage your local IndexedDB storage.
                  </p>

                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-[var(--surface1)] border border-[var(--border)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--text1)]">Storage Used</span>
                        <span className="text-sm text-[var(--text3)]">142 MB / 5 GB</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--surface3)] overflow-hidden">
                        <div className="h-full w-[3%] rounded-full bg-[var(--accent)]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)]">
                        <div>
                          <p className="text-sm font-medium text-[var(--text1)]">Auto-save generations</p>
                          <p className="text-xs text-[var(--text3)]">Save all generated images automatically</p>
                        </div>
                        <button className="w-9 h-5 rounded-full bg-[var(--accent)] relative">
                          <span className="absolute top-0.5 left-[18px] w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)]">
                        <div>
                          <p className="text-sm font-medium text-[var(--text1)]">Save metadata</p>
                          <p className="text-xs text-[var(--text3)]">Store prompts and parameters with images</p>
                        </div>
                        <button className="w-9 h-5 rounded-full bg-[var(--accent)] relative">
                          <span className="absolute top-0.5 left-[18px] w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)] transition-colors">
                        Export Gallery
                      </button>
                      <button className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--surface1)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border-visible)] transition-colors">
                        Import Gallery
                      </button>
                      <button className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20 hover:bg-[var(--error)]/20 transition-colors">
                        Clear All Data
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Advanced */}
            {activeTab === "advanced" && (
              <>
                <section>
                  <h2 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-[var(--text1)] mb-1">
                    Advanced
                  </h2>
                  <p className="text-sm text-[var(--text3)] mb-6">
                    Fine-tune application behavior.
                  </p>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text1)]">Custom Headers</label>
                      <textarea
                        placeholder={`{"X-Custom-Header": "value"}`}
                        className="w-full h-24 p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] font-mono resize-none focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)]">
                      <div>
                        <p className="text-sm font-medium text-[var(--text1)]">NSFW Content Filter</p>
                        <p className="text-xs text-[var(--text3)]">Block potentially unsafe content</p>
                      </div>
                      <button className="w-9 h-5 rounded-full bg-[var(--accent)] relative">
                        <span className="absolute top-0.5 left-[18px] w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)]">
                      <div>
                        <p className="text-sm font-medium text-[var(--text1)]">Enable Debug Mode</p>
                        <p className="text-xs text-[var(--text3)]">Show detailed API logs</p>
                      </div>
                      <button className="w-9 h-5 rounded-full bg-[var(--surface3)] relative">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface1)] border border-[var(--border)]">
                      <div>
                        <p className="text-sm font-medium text-[var(--text1)]">Rate Limit Warnings</p>
                        <p className="text-xs text-[var(--text3)]">Notify when approaching limits</p>
                      </div>
                      <button className="w-9 h-5 rounded-full bg-[var(--accent)] relative">
                        <span className="absolute top-0.5 left-[18px] w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
