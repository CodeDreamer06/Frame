"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

const mockImages = [
  { id: 1, url: "https://picsum.photos/seed/1/400/400", prompt: "A serene mountain landscape at sunset", date: "2024-01-15", favorite: true },
  { id: 2, url: "https://picsum.photos/seed/2/400/500", prompt: "Cyberpunk city street at night", date: "2024-01-14", favorite: false },
  { id: 3, url: "https://picsum.photos/seed/3/500/400", prompt: "Abstract geometric patterns", date: "2024-01-13", favorite: true },
  { id: 4, url: "https://picsum.photos/seed/4/400/400", prompt: "Portrait of a futuristic robot", date: "2024-01-12", favorite: false },
  { id: 5, url: "https://picsum.photos/seed/5/400/600", prompt: "Underwater coral reef scene", date: "2024-01-11", favorite: false },
  { id: 6, url: "https://picsum.photos/seed/6/600/400", prompt: "Vintage car on a coastal road", date: "2024-01-10", favorite: true },
  { id: 7, url: "https://picsum.photos/seed/7/400/400", prompt: "Mystical forest with glowing mushrooms", date: "2024-01-09", favorite: false },
  { id: 8, url: "https://picsum.photos/seed/8/400/500", prompt: "Space station orbiting earth", date: "2024-01-08", favorite: false },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Favorites", value: "favorites" },
  { label: "Recent", value: "recent" },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredImages = mockImages.filter((img) => {
    if (activeFilter === "favorites" && !img.favorite) return false;
    if (searchQuery && !img.prompt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelection = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg)]">
        {/* Header */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0">
          <h1 className="font-[family-name:var(--font-manrope)] text-base font-semibold text-[var(--text1)]">
            Gallery
          </h1>
          <div className="flex items-center gap-3">
            {selectedImages.length > 0 && (
              <span className="text-xs text-[var(--text3)]">
                {selectedImages.length} selected
              </span>
            )}
            <div className="flex items-center bg-[var(--surface1)] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-[var(--surface2)] text-[var(--text1)]" : "text-[var(--text3)]"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-[var(--surface2)] text-[var(--text1)]" : "text-[var(--text3)]"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface1)] border border-[var(--border)] text-sm text-[var(--text1)] placeholder:text-[var(--text4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div className="flex items-center gap-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === filter.value
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`group relative rounded-xl overflow-hidden bg-[var(--surface1)] border transition-all cursor-pointer ${
                    selectedImages.includes(img.id)
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                      : "border-[var(--border)] hover:border-[var(--border-visible)]"
                  }`}
                  onClick={() => toggleSelection(img.id)}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={img.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{img.prompt}</p>
                    <p className="text-[10px] text-white/60 mt-0.5">{img.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedImages.includes(img.id)
                      ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                      : "border-[var(--border)] hover:border-[var(--border-visible)] bg-[var(--surface1)]"
                  }`}
                  onClick={() => toggleSelection(img.id)}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text1)] truncate">{img.prompt}</p>
                    <p className="text-xs text-[var(--text3)] mt-0.5">{img.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-md text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={img.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-md text-[var(--text3)] hover:text-[var(--text1)] hover:bg-[var(--surface2)] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
