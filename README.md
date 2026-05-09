# Frame — AI Image Studio

A beautiful, dark-first AI image generation and editing studio built with Next.js. Frame provides a powerful interface for generating images via AI APIs, editing them with precision, and managing everything locally through IndexedDB.

![Frame Studio](public/frame-preview.png)

## Features

### Core Studio
- **Prompt-based Generation** — Natural language prompts with real-time parameter tuning
- **Multiple AI Provider Support** — Compatible with OpenAI DALL-E, Stability AI, Midjourney API, and any OpenAI-compatible endpoint
- **Custom Base URL** — Configure your own API endpoint for self-hosted or proxy setups
- **Round-Robin API Key Rotation** — Add multiple API keys for load balancing and rate limit management
- **Batch Generation** — Generate multiple variants in a single request

### Local-First Storage
- **IndexedDB Gallery** — All generated images saved locally with metadata
- **Project Organization** — Tag, favorite, and organize images into collections
- **Export & Import** — Backup your gallery as JSON or ZIP, restore anytime
- **Offline Access** — Browse and manage your entire gallery without internet

### Image Editor
- **Smart Masking** — Brush-based inpainting with adjustable size and softness
- **Background Removal** — One-click transparent backgrounds
- **Style Transfer** — Apply artistic styles to existing images
- **Upscaling** — 2x/4x enhancement with quality preservation
- **Cropping & Resizing** — Aspect ratio presets and freeform crop
- **Adjustment Controls** — Brightness, contrast, saturation, warmth

### Output Customization
- **Size Presets** — Square (1024x1024), Portrait (1024x1792), Landscape (1792x1024), and custom
- **Quality Settings** — Standard, HD, Ultra quality tiers
- **Background Control** — Transparent, solid color, blur, or auto-detect
- **Style Modifiers** — Vivid, natural, anime, cinematic, 3D render, sketch
- **Format Selection** — PNG, JPEG, WebP output
- **Seed Control** — Reproducible generations with seed locking

### Advanced Settings
- **API Configuration** — Custom headers, timeout, retry logic
- **Rate Limiting** — Per-key rate tracking and automatic backoff
- **Prompt Templates** — Save and reuse common prompt patterns
- **Negative Prompts** — Exclude unwanted elements
- **NSFW Filtering** — Content safety toggles

## Architecture

```
frame/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Halcyon design system
│   ├── page.tsx           # Studio (home)
│   ├── gallery/page.tsx   # Local gallery
│   ├── editor/page.tsx    # Image editor
│   └── settings/page.tsx  # Configuration
├── components/            # React components
│   ├── ui/               # Base UI (buttons, inputs, cards)
│   ├── studio/           # Generation interface
│   ├── gallery/          # Grid, filters, viewer
│   ├── editor/           # Canvas, tools, panels
│   └── settings/         # Forms, config panels
├── lib/                   # Utilities
│   ├── db.ts             # IndexedDB wrapper
│   ├── api.ts            # API client with key rotation
│   └── store.ts          # App state management
└── public/               # Static assets
```

## Design System

Frame uses the **Halcyon Design System** — a dark-first, architecturally precise UI kit characterized by:
- Cool near-black neutrals (`#0A1019` canvas)
- Blue-teal accents (`#4680F5` primary, `#2FA7A3` secondary)
- Sculptural glass-bar hero identity
- Manrope + Inter typography pairing
- Precise 4px spacing scale

## Roadmap

- [x] Core UI scaffolding
- [ ] API integration with key rotation
- [ ] IndexedDB persistence layer
- [ ] Image editor with canvas tools
- [ ] Export/import functionality
- [ ] Plugin system for custom AI providers
- [ ] Batch processing pipeline
- [ ] Collaborative workspaces

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## License

MIT
