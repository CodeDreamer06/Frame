"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

/* ── Mock data ─────────────────────────────────────────────── */

interface GalleryImage {
  id: number;
  url: string;
  prompt: string;
  date: string;
  size: string;
  model: string;
  favorite: boolean;
}

const mockImages: GalleryImage[] = [
  { id: 1, url: "https://picsum.photos/seed/1/400/400", prompt: "A serene mountain landscape at sunset with golden light", date: "2024-01-15", size: "1024×1024", model: "SDXL", favorite: true },
  { id: 2, url: "https://picsum.photos/seed/2/400/500", prompt: "Cyberpunk city street at night with neon reflections", date: "2024-01-14", size: "768×1024", model: "DALL·E 3", favorite: false },
  { id: 3, url: "https://picsum.photos/seed/3/500/400", prompt: "Abstract geometric patterns in warm earth tones", date: "2024-01-13", size: "1024×768", model: "SDXL", favorite: true },
  { id: 4, url: "https://picsum.photos/seed/4/400/400", prompt: "Portrait of a futuristic robot in a garden", date: "2024-01-12", size: "1024×1024", model: "Midjourney", favorite: false },
  { id: 5, url: "https://picsum.photos/seed/5/400/600", prompt: "Underwater coral reef scene with tropical fish", date: "2024-01-11", size: "768×1152", model: "SDXL", favorite: false },
  { id: 6, url: "https://picsum.photos/seed/6/600/400", prompt: "Vintage car on a coastal road at golden hour", date: "2024-01-10", size: "1152×768", model: "DALL·E 3", favorite: true },
  { id: 7, url: "https://picsum.photos/seed/7/400/400", prompt: "Mystical forest with glowing mushrooms and fireflies", date: "2024-01-09", size: "1024×1024", model: "Midjourney", favorite: false },
  { id: 8, url: "https://picsum.photos/seed/8/400/500", prompt: "Space station orbiting earth at dawn", date: "2024-01-08", size: "768×1024", model: "SDXL", favorite: false },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Favorites", value: "favorites" },
  { label: "Recent", value: "recent" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

/* ── Transition helpers ────────────────────────────────────── */

const borderTransition = {
  transitionProperty: "border-color, background-color",
  transitionDuration: "var(--dur-short)",
  transitionTimingFunction: "var(--ease-out)",
} as const;

const colorTransition = {
  transitionProperty: "color, background-color",
  transitionDuration: "var(--dur-short)",
  transitionTimingFunction: "var(--ease-out)",
} as const;

/* ── Framer-motion variants ────────────────────────────────── */

const gridContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

/* ── Icons ─────────────────────────────────────────────────── */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function EmptyGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/* ── Gallery page ──────────────────────────────────────────── */

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [images, setImages] = useState<GalleryImage[]>(mockImages);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (activeFilter === "favorites" && !img.favorite) return false;
      if (activeFilter === "recent") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(img.date) >= weekAgo;
      }
      if (searchQuery && !img.prompt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [images, activeFilter, searchQuery]);

  const handleDelete = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-paper">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="h-14 border-b border-rule flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-base font-semibold text-ink">
              Gallery
            </h1>
            <span className="text-xs font-mono text-neutral">
              {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg border ${
                viewMode === "grid"
                  ? "bg-paper-3 border-accent text-ink"
                  : "border-transparent text-neutral hover:text-ink-2"
              }`}
              style={borderTransition}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <GridIcon />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg border ${
                viewMode === "list"
                  ? "bg-paper-3 border-accent text-ink"
                  : "border-transparent text-neutral hover:text-ink-2"
              }`}
              style={borderTransition}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <ListIcon />
            </motion.button>
          </div>
        </header>

        {/* ── Search + Filters ───────────────────────────── */}
        <div className="px-6 pt-4 pb-0 space-y-4 shrink-0">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by prompt..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-paper-3 border border-rule text-sm text-ink placeholder:text-neutral outline-none focus-visible:border-accent"
              style={borderTransition}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-6 border-b border-rule" role="tablist">
            {filters.map((filter) => (
              <button
                key={filter.value}
                role="tab"
                aria-selected={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`relative pb-3 text-sm font-medium ${
                  activeFilter === filter.value
                    ? "text-ink"
                    : "text-neutral hover:text-ink-2"
                }`}
                style={colorTransition}
              >
                {filter.label}
                {activeFilter === filter.value && (
                  <motion.span
                    layoutId="gallery-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            /* ── Empty state ──────────────────────────────── */
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-xl border border-rule flex items-center justify-center text-neutral mb-4">
                <EmptyGridIcon />
              </div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Nothing here yet
              </h2>
              <p className="text-sm text-muted mt-1.5 max-w-[280px]">
                Generate your first image in the Studio.
              </p>
              <Link href="/">
                <motion.span
                  whileTap={{ scale: 0.98 }}
                  className="inline-block mt-5 px-5 py-2.5 bg-accent text-accent-ink font-display font-semibold text-sm rounded-lg hover:bg-accent-hover"
                  style={colorTransition}
                >
                  Open Studio
                </motion.span>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            /* ── Grid view ────────────────────────────────── */
            <motion.div
              key={`grid-${activeFilter}-${searchQuery}`}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={gridContainer}
              initial="hidden"
              animate="show"
            >
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  variants={gridItem}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                  className="group relative rounded-lg overflow-hidden border border-rule cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />

                  {/* Delete button — top right on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-paper border border-rule text-neutral hover:text-error hover:border-rule-2 opacity-0 group-hover:opacity-100"
                    style={{
                      transitionProperty: "opacity, color, border-color",
                      transitionDuration: "var(--dur-short)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                    aria-label={`Delete "${img.prompt}"`}
                  >
                    <CloseIcon />
                  </button>

                  {/* Bottom gradient overlay with metadata */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-ink/80 to-transparent opacity-0 group-hover:opacity-100"
                    style={{
                      transitionProperty: "opacity",
                      transitionDuration: "var(--dur-short)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  >
                    <p className="font-mono text-xs text-paper truncate">
                      {img.prompt}
                    </p>
                    <p className="font-mono text-[11px] text-paper/60 mt-0.5">
                      {img.date}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ── List view ────────────────────────────────── */
            <motion.div
              key={`list-${activeFilter}-${searchQuery}`}
              variants={listContainer}
              initial="hidden"
              animate="show"
            >
              {filteredImages.map((img, idx) => (
                <motion.div
                  key={img.id}
                  variants={listItem}
                  className={`group flex items-center gap-4 py-3 px-1 ${
                    idx < filteredImages.length - 1 ? "border-b border-rule" : ""
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                    loading="lazy"
                  />

                  {/* Prompt — Fraunces */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-ink truncate">
                      {img.prompt}
                    </p>
                  </div>

                  {/* Metadata — mono */}
                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <span className="font-mono text-xs text-neutral">{img.date}</span>
                    <span className="font-mono text-xs text-neutral">{img.size}</span>
                    <span className="font-mono text-xs text-neutral">{img.model}</span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded-md text-neutral hover:text-error opacity-0 group-hover:opacity-100 shrink-0"
                    style={{
                      transitionProperty: "opacity, color",
                      transitionDuration: "var(--dur-short)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                    aria-label={`Delete "${img.prompt}"`}
                  >
                    <CloseIcon />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
