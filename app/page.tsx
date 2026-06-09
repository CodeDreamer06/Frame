"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";

const defaultSizePresets = [
  { label: "Square", value: "1024x1024", ratio: "1:1" },
  { label: "Portrait", value: "1024x1792", ratio: "9:16" },
  { label: "Landscape", value: "1792x1024", ratio: "16:9" },
  { label: "Wide", value: "1920x1080", ratio: "16:9" },
  { label: "Custom", value: "custom", ratio: "?" },
];

const defaultQualityOptions = [
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

  const [provider, setProvider] = useState("openai");
  const [selectedModel, setSelectedModel] = useState("gpt-image-2");
  const [customWidth, setCustomWidth] = useState("1024");
  const [customHeight, setCustomHeight] = useState("1024");
  const [gptImage2Background, setGptImage2Background] = useState("auto");
  const [referenceImages, setReferenceImages] = useState<{ url: string; file?: File }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("frame_settings");
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.provider) setProvider(settings.provider);
        if (settings.selectedModel) {
          setSelectedModel(settings.selectedModel);
          if (settings.selectedModel === "gpt-image-2") {
            setSelectedQuality("auto");
            setSelectedSize("1024x1024");
          } else {
            if (settings.sizePreset) {
              const normalizedSize = settings.sizePreset.replace("×", "x");
              setSelectedSize(normalizedSize);
            }
          }
        }
      }
      setSettingsLoaded(true);
    } catch (e) {
      console.error("Failed to load settings in Studio", e);
      setSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      referenceImages.forEach((img) => {
        if (img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  const isGptImage2 = selectedModel === "gpt-image-2";

  const sizePresets = isGptImage2
    ? [
        { label: "Square", value: "1024x1024", ratio: "1:1" },
        { label: "Portrait", value: "1024x1792", ratio: "9:16" },
        { label: "Landscape", value: "1792x1024", ratio: "16:9" },
        { label: "4K Square", value: "2048x2048", ratio: "1:1" },
        { label: "4K Landscape", value: "3840x2160", ratio: "16:9" },
        { label: "4K Portrait", value: "2160x3840", ratio: "9:16" },
        { label: "Custom", value: "custom", ratio: "?" },
      ]
    : defaultSizePresets;

  const qualityOptions = isGptImage2
    ? [
        { label: "Auto", value: "auto", desc: "Automatic quality" },
        { label: "Standard", value: "standard", desc: "Standard details" },
        { label: "High", value: "high", desc: "Maximum fidelity" },
      ]
    : defaultQualityOptions;

  const supportsImageInput =
    selectedModel.toLowerCase().includes("gpt-image-2") ||
    selectedModel.toLowerCase().includes("gpt-image-1") ||
    selectedModel.toLowerCase().includes("flux-1.1-pro") ||
    selectedModel.toLowerCase().includes("flux-schnell") ||
    selectedModel.toLowerCase().includes("stable-diffusion-xl") ||
    selectedModel.toLowerCase().includes("sdxl") ||
    selectedModel.toLowerCase().includes("sd3");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (supportsImageInput) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!supportsImageInput) return;
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const imgFiles = files.filter((f) => f.type.startsWith("image/"));
    const newRefs = imgFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setReferenceImages((prev) => [...prev, ...newRefs]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveReferenceImage = (idx: number) => {
    setReferenceImages((prev) => {
      const copy = [...prev];
      if (copy[idx].url.startsWith("blob:")) {
        URL.revokeObjectURL(copy[idx].url);
      }
      copy.splice(idx, 1);
      return copy;
    });
  };

  useEffect(() => {
    if (isGptImage2) {
      if (!["auto", "standard", "high"].includes(selectedQuality)) {
        setSelectedQuality("auto");
      }
    } else {
      if (!["standard", "hd", "ultra"].includes(selectedQuality)) {
        setSelectedQuality("hd");
      }
    }
  }, [selectedModel]);

  const [generatedImages, setGeneratedImages] = useState<
    { id: number; url: string; prompt: string; date: string; size: string; model: string; favorite: boolean }[]
  >([]);

  /* Load generations on mount */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("frame_generations");
      if (stored) {
        setGeneratedImages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load generations in Studio", e);
    }
  }, []);

  const saveGenerationsToLocalStorage = (newImgs: any[]) => {
    if (typeof window === "undefined") return;
    try {
      const existing = JSON.parse(localStorage.getItem("frame_generations") || "[]");
      const updated = [...newImgs, ...existing];
      localStorage.setItem("frame_generations", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save generations to local storage", e);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(120, el.scrollHeight)}px`;
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Load latest settings from local storage
    let currentSettings = {
      provider: "openai",
      apiKey: "",
      apiBaseUrl: "",
      selectedModel: "gpt-image-2",
    };
    try {
      const stored = localStorage.getItem("frame_settings");
      if (stored) {
        currentSettings = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    const { provider: settingsProvider, apiKey, apiBaseUrl, selectedModel: settingsModel } = currentSettings;

    // Check if API Key is configured. If not, use mock generation.
    if (!apiKey) {
      setTimeout(() => {
        const newImages = Array.from({ length: batchCount }, (_, i) => {
          const id = Date.now() + i;
          const width = selectedSize === "custom" ? Number(customWidth) || 1024 : 1024;
          const height = selectedSize === "custom" ? Number(customHeight) || 1024 : 1024;
          return {
            id,
            url: `https://picsum.photos/seed/${id}/${width}/${height}`,
            prompt: prompt,
            date: new Date().toISOString().split("T")[0],
            size: selectedSize === "custom" ? `${customWidth}×${customHeight}` : selectedSize.replace("x", "×"),
            model: settingsModel,
            favorite: false,
          };
        });

        setGeneratedImages((prev) => [...newImages, ...prev]);
        saveGenerationsToLocalStorage(newImages);
        setIsGenerating(false);
      }, 1500);
      return;
    }

    // Real API call based on provider
    try {
      if (settingsProvider === "openai") {
        const baseUrl = apiBaseUrl || "https://api.openai.com/v1";
        const endpoint = `${baseUrl}/images/generations`;

        const sizeParam = selectedSize === "custom" ? `${customWidth}x${customHeight}` : selectedSize;
        const body: Record<string, any> = {
          model: settingsModel,
          prompt: prompt,
          n: batchCount,
          size: sizeParam,
          response_format: "b64_json",
        };

        if (isGptImage2) {
          body.quality = selectedQuality; // 'auto', 'standard', 'high'
          body.background = gptImage2Background; // 'auto', 'opaque'
        } else {
          // DALL-E 3 only supports 'standard' or 'hd'
          body.quality = selectedQuality === "high" || selectedQuality === "hd" || selectedQuality === "ultra" ? "hd" : "standard";
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `OpenAI request failed: status ${res.status}`);
        }

        const data = await res.json();
        const newImages = data.data.map((img: any, i: number) => {
          const id = Date.now() + i;
          const imgUrl = img.b64_json ? `data:image/png;base64,${img.b64_json}` : img.url;
          return {
            id,
            url: imgUrl,
            prompt: prompt,
            date: new Date().toISOString().split("T")[0],
            size: selectedSize === "custom" ? `${customWidth}×${customHeight}` : selectedSize.replace("x", "×"),
            model: settingsModel,
            favorite: false,
          };
        });

        setGeneratedImages((prev) => [...newImages, ...prev]);
        saveGenerationsToLocalStorage(newImages);
      } else if (settingsProvider === "stability") {
        const baseUrl = apiBaseUrl || "https://api.stability.ai/v2beta";
        const endpoint = `${baseUrl}/stable-image/generate/core`;

        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "webp");
        
        let aspect = "1:1";
        if (selectedSize === "1024x1792" || selectedSize === "2160x3840") aspect = "9:16";
        else if (selectedSize === "1792x1024" || selectedSize === "3840x2160" || selectedSize === "1920x1080") aspect = "16:9";
        formData.append("aspect_ratio", aspect);

        if (referenceImages.length > 0 && referenceImages[0].file) {
          formData.append("image", referenceImages[0].file);
          formData.append("strength", "0.7");
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Accept": "application/json"
          },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.errors?.[0] || errData.message || `Stability request failed: status ${res.status}`);
        }

        const data = await res.json();
        const newImages = [{
          id: Date.now(),
          url: `data:image/webp;base64,${data.image}`,
          prompt: prompt,
          date: new Date().toISOString().split("T")[0],
          size: selectedSize === "custom" ? `${customWidth}×${customHeight}` : selectedSize.replace("x", "×"),
          model: settingsModel,
          favorite: false,
        }];

        setGeneratedImages((prev) => [...newImages, ...prev]);
        saveGenerationsToLocalStorage(newImages);
      } else if (settingsProvider === "replicate") {
        const baseUrl = apiBaseUrl || "https://api.replicate.com/v1";
        const endpoint = `${baseUrl}/predictions`;

        const body: Record<string, any> = {
          version: settingsModel.includes("flux-1.1-pro") 
            ? "flux-1.1-pro" 
            : settingsModel.includes("flux-schnell")
            ? "flux-schnell"
            : "sdxl",
          input: {
            prompt: prompt,
          }
        };

        if (referenceImages.length > 0 && referenceImages[0].file) {
          const base64 = await convertFileToBase64(referenceImages[0].file);
          body.input.image = base64;
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${apiKey}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Replicate prediction failed: status ${res.status}`);
        }

        const prediction = await res.json();
        let pollUrl = prediction.urls.get || `${baseUrl}/predictions/${prediction.id}`;
        let completedPrediction = prediction;
        let attempts = 0;

        while (completedPrediction.status !== "succeeded" && completedPrediction.status !== "failed" && attempts < 30) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const pollRes = await fetch(pollUrl, {
            headers: {
              "Authorization": `Token ${apiKey}`,
            }
          });
          if (pollRes.ok) {
            completedPrediction = await pollRes.json();
          }
          attempts++;
        }

        if (completedPrediction.status === "succeeded") {
          const outputUrls = Array.isArray(completedPrediction.output) 
            ? completedPrediction.output 
            : [completedPrediction.output];
          
          const newImages = outputUrls.map((url: string, i: number) => ({
            id: Date.now() + i,
            url: url,
            prompt: prompt,
            date: new Date().toISOString().split("T")[0],
            size: selectedSize === "custom" ? `${customWidth}×${customHeight}` : selectedSize.replace("x", "×"),
            model: settingsModel,
            favorite: false,
          }));

          setGeneratedImages((prev) => [...newImages, ...prev]);
          saveGenerationsToLocalStorage(newImages);
        } else {
          throw new Error(`Replicate prediction failed: ${completedPrediction.error || "unknown error"}`);
        }
      }
    } catch (error: any) {
      console.error("API Call error:", error);
      alert(`API Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLabel =
    batchCount > 1 ? `Generate ${batchCount} images` : "Generate";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-paper">
        {/* Header */}
        <header className="h-14 border-b border-rule flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-base font-semibold text-ink">
              Studio
            </h1>
            <span className="text-[10px] font-mono text-neutral bg-paper-2 border border-rule px-2 py-0.5 rounded-md uppercase tracking-wider">
              {provider} / {selectedModel}
            </span>
          </div>
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
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-lg bg-paper-3 border transition-colors ${
                    isDragging ? "border-accent bg-accent-subtle/5" : "border-rule"
                  } focus-within:border-accent overflow-hidden`}
                  style={{
                    transitionProperty: "border-color, background-color",
                    transitionDuration: "var(--dur-short)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      supportsImageInput
                        ? "Describe your vision, or drop reference images here..."
                        : "Describe your vision..."
                    }
                    className="w-full p-4 bg-transparent text-sm text-ink leading-relaxed placeholder:text-neutral resize-none outline-none"
                    style={{
                      minHeight: "120px",
                    }}
                  />

                  {/* Previews if model supports image input */}
                  {supportsImageInput && referenceImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-4 pb-3">
                      {referenceImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group w-14 h-14 rounded-md overflow-hidden border border-rule"
                        >
                          <img
                            src={img.url}
                            alt={`Reference ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveReferenceImage(idx)}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-opacity"
                            style={{
                              transitionProperty: "opacity, background-color",
                              transitionDuration: "var(--dur-micro)",
                              transitionTimingFunction: "var(--ease-out)",
                            }}
                            aria-label="Remove reference image"
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* Small click to upload box */}
                      <label
                        className="flex items-center justify-center w-14 h-14 rounded-md border border-dashed border-rule-2 hover:border-accent hover:bg-paper-2 cursor-pointer transition-colors text-neutral hover:text-accent"
                        style={{
                          transitionProperty: "border-color, background-color, color",
                          transitionDuration: "var(--dur-short)",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </label>
                    </div>
                  )}

                  {/* Drag overlay message */}
                  {isDragging && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-accent-subtle/20 backdrop-blur-xs pointer-events-none">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent mb-1 animate-bounce"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        Drop images here
                      </span>
                    </div>
                  )}
                </div>

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

                  {/* Conditional manual inputs for Custom size */}
                  <AnimatePresence>
                    {selectedSize === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1] as const,
                        }}
                        className="overflow-hidden mt-3 grid grid-cols-2 gap-3"
                      >
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral mb-1">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            min={256}
                            max={4096}
                            className="w-full px-3 py-2 bg-paper-3 border border-rule rounded-md text-sm text-ink outline-none focus-visible:border-accent"
                            style={{
                              transitionProperty: "border-color",
                              transitionDuration: "var(--dur-short)",
                              transitionTimingFunction: "var(--ease-out)",
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral mb-1">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            min={256}
                            max={4096}
                            className="w-full px-3 py-2 bg-paper-3 border border-rule rounded-md text-sm text-ink outline-none focus-visible:border-accent"
                            style={{
                              transitionProperty: "border-color",
                              transitionDuration: "var(--dur-short)",
                              transitionTimingFunction: "var(--ease-out)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                {/* Background (GPT-image-2 only) */}
                {isGptImage2 && (
                  <Section label="Background">
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-2">
                        {["auto", "opaque"].map((bg) => (
                          <button
                            key={bg}
                            onClick={() => setGptImage2Background(bg)}
                            className={`px-3 py-2.5 rounded-md text-xs font-medium transition-colors border capitalize ${
                              gptImage2Background === bg
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
                            {bg}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-neutral mt-1.5">
                        GPT-image-2 does not support transparent outputs.
                      </p>
                    </div>
                  </Section>
                )}

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
                      max={isGptImage2 ? "10" : "8"}
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
