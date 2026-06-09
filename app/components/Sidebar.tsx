"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    label: "Studio",
    href: "/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Editor",
    href: "/editor",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle help shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }

      // Close modal
      if (e.key === "Escape") {
        setShowShortcuts(false);
      }

      // Navigation shortcuts (Alt + 1, 2, 3, 4)
      if (e.altKey) {
        if (e.key === "1") {
          e.preventDefault();
          router.push("/");
        } else if (e.key === "2") {
          e.preventDefault();
          router.push("/gallery");
        } else if (e.key === "3") {
          e.preventDefault();
          router.push("/editor");
        } else if (e.key === "4") {
          e.preventDefault();
          router.push("/settings");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <aside className="w-[220px] min-h-screen bg-paper-2 border-r border-rule flex flex-col shrink-0">
      {/* Wordmark */}
      <div className="px-5 py-6 flex items-center gap-2.5">
        <span
          className="block w-2.5 h-2.5 rounded-sm bg-accent"
          aria-hidden="true"
        />
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Frame
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                transitionProperty: "background-color, color",
                transitionDuration: "var(--dur-short)",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              {/* Active indicator — animated vertical bar */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={`transition-colors ${
                  isActive ? "text-accent" : "text-neutral group-hover:text-ink-2"
                }`}
                style={{
                  transitionProperty: "color",
                  transitionDuration: "var(--dur-short)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                {item.icon}
              </span>
              <span
                className={
                  isActive
                    ? "text-ink"
                    : "text-muted group-hover:text-ink"
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Shortcuts trigger info at bottom */}
      <div className="px-5 py-2 text-[10px] text-neutral border-t border-rule/50">
        <div className="flex items-center justify-between">
          <span>Shortcuts help</span>
          <kbd className="px-1 py-0.5 font-mono text-[9px] bg-paper-3 border border-rule-2 rounded text-muted shadow-xs">
            ⌘ /
          </kbd>
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-rule">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-paper-3 border border-rule flex items-center justify-center text-xs font-mono font-medium text-muted">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">Admin</p>
            <p className="text-xs font-mono text-neutral">Local</p>
          </div>
        </div>
      </div>

      {/* Shortcuts Modal dialog */}
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </aside>
  );
}

/* ── Shortcuts Modal dialog ────────────────────────────────── */

function ShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md bg-paper-2 border border-rule rounded-xl shadow-2xl overflow-hidden p-5 z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-rule pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
                <h2 className="font-display text-base font-semibold text-ink">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-neutral hover:text-ink hover:bg-paper-3 p-1 rounded-md transition-colors"
                aria-label="Close dialog"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="space-y-5 max-h-[350px] overflow-y-auto pr-1">
              {/* Navigation Group */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral mb-2">
                  Navigation
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  <ShortcutRow keys={["⌥", "1"]} desc="Go to Studio" />
                  <ShortcutRow keys={["⌥", "2"]} desc="Go to Gallery" />
                  <ShortcutRow keys={["⌥", "3"]} desc="Go to Editor" />
                  <ShortcutRow keys={["⌥", "4"]} desc="Go to Settings" />
                </div>
              </div>

              {/* Studio Actions Group */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral mb-2">
                  Studio Page
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  <ShortcutRow keys={["⌘", "Enter"]} desc="Generate image(s)" />
                  <ShortcutRow keys={["⌥", "P"]} desc="Focus Prompt Input" />
                  <ShortcutRow keys={["⌥", "N"]} desc="Toggle Negative Prompt" />
                  <ShortcutRow keys={["⌥", "C"]} desc="Cycle Canvas presets" />
                  <ShortcutRow keys={["⌥", "Q"]} desc="Cycle Quality options" />
                  <ShortcutRow keys={["⌥", "S"]} desc="Cycle Style options" />
                  <ShortcutRow keys={["⌥", "B"]} desc="Focus Batch slider" />
                </div>
              </div>

              {/* General Group */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral mb-2">
                  General
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  <ShortcutRow keys={["⌘", "/"]} desc="Toggle Shortcuts Help" />
                  <ShortcutRow keys={["Esc"]} desc="Close Modal" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ShortcutRow({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-rule/20 last:border-0">
      <span className="text-muted">{desc}</span>
      <div className="flex gap-1 shrink-0">
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="px-1.5 py-0.5 min-w-[18px] text-center font-mono text-[9px] bg-paper-3 border border-rule-2 rounded text-ink font-semibold shadow-xs"
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}
