# Tell Their Stories

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A Family History AI Toolset** - Go beyond names and dates. Research deeply, tell stories, create content.

![Tell Their Stories Homepage](https://img.shields.io/badge/Status-Active%20Development-brightgreen)

## 🌟 Overview

Tell Their Stories is a platform for family historians who want to go beyond collecting names and dates. It transforms genealogical data into compelling narratives using AI assistance.

### Key Principles

- **🔍 Research Depth** - Understand context, not just collect facts
- **📖 Storytelling First** - Turn data into compelling narratives  
- **🎨 Content Creation** - Photos, documents, timelines, and shareable stories
- **🤖 AI Assistance** - Leverage modern AI for analysis and synthesis
- **🔒 Privacy First** - All data stays local on your computer

## ✨ Features

### Source Documentation Tool (Available Now)

Extract and document FamilySearch sources with AI-powered analysis. Creates two types of documents:

| Document Type | Description |
|--------------|-------------|
| **Raw Evidence Document** | Complete, lossless capture of all source data (deterministic, no AI) |
| **Contextualized Dossier** | AI-assisted synthesis that identifies patterns, conflicts, and research opportunities |

#### How It Works

1. **Extract** - Use the browser extension to capture sources from FamilySearch
2. **Import** - Upload the Evidence Pack JSON to the app
3. **Process** - Run 3-stage AI analysis (Normalize → Cluster → Synthesize)
4. **Export** - Download raw documents and contextualized dossiers

### Coming Soon

- 📝 **Story Writer** - AI-assisted narrative generation from documented facts
- 📷 **Photo Analyzer** - Extract context and dates from old photographs
- 📅 **Timeline Builder** - Visual timelines synthesized from sources
- 🎯 **Research Planner** - Track goals with AI-powered suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/scottjarvie/tell-their-stories.git
cd tell-their-stories

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3443](http://localhost:3443) to see the app.

### Browser Extension Setup

The browser extension is located in the `/extension` folder:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select the `/extension` folder
4. Navigate to a FamilySearch person's sources page (e.g., `familysearch.org/tree/person/sources/XXXX-XXX`)
5. Click the extension icon to start extraction

## 📁 Project Structure

```
tell-their-stories/
├── app/                    # Next.js App Router pages
│   ├── app/               # App routes (dashboard, tools)
│   ├── features/          # Feature marketing pages
│   ├── about/             # About page
│   ├── roadmap/           # Roadmap page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # ShadCN UI components
│   ├── layout/            # Layout components (nav, sidebar, footer)
│   └── marketing/         # Marketing page components
├── convex/                # Convex backend (GEDCOM X data model)
│   ├── schema.ts          # Data model following GEDCOM X
│   ├── persons.ts         # Person operations
│   ├── relationships.ts   # Relationship operations
│   ├── events.ts          # Event operations
│   ├── sources.ts         # Source/citation operations
│   └── helpers.ts         # Helper functions
├── features/              # Feature modules
│   └── source-docs/       # Source Documentation Tool
│       ├── components/    # Feature-specific components
│       └── lib/           # Schemas, generators, utils
├── lib/                   # Shared utilities
│   ├── storage/           # Local file storage layer
│   └── ai/                # OpenRouter integration
├── extension/             # Chrome browser extension (MV3)
│   ├── content/           # Content scripts for extraction
│   ├── popup/             # Extension popup UI
│   └── lib/               # Evidence Pack schema
└── data/                  # Local storage (gitignored)
    └── people/            # Extracted person data
        └── {personId}/    # Per-person folder
            └── runs/      # Versioned extraction runs
```

## 📊 Data Model (GEDCOM X)

This project uses the **GEDCOM X data model** adapted for Convex's document-oriented storage. Key differences from traditional genealogy software:

### Relationship-Based (Not Family-Based)

**Traditional approach:**
```
Family entity contains:
  - Husband
  - Wife
  - Children[]
```

**Our approach (GEDCOM X):**
```
Relationships are direct Person↔Person:
  - Couple (John ↔ Mary)
  - ParentChild (John → Child1, Mary → Child1)
  - ParentChild (John → Child2, Mary → Child2)
```

**Why this is better:**
- ✅ Handles remarriages cleanly (multiple Couple relationships)
- ✅ Step-families (ParentChild with type "Step")
- ✅ Adoptions (ParentChild with type "Adopted")
- ✅ Unknown parents (one-sided relationships)
- ✅ Same-sex couples (no husband/wife designation)
- ✅ Complex family situations without workarounds

### Embedded Facts for Performance

Common facts (birth, death) are **embedded on Person records** for fast reads:
```typescript
person.birth.date.year  // Fast: no join needed
person.death.place.original  // Fast: no join needed
```

These facts are **also stored in the events table** for:
- Complex queries (all births in a year)
- Multiple witnesses/participants
- Events without a known person yet

### Evidence vs. Conclusion

Citations distinguish **evidence** (raw from records) from **conclusions** (researcher's interpretation):
- `citation.isEvidence = true` → Verbatim from a census, birth certificate, etc.
- `citation.isEvidence = false` → Researcher's conclusion combining multiple sources

This follows the **Genealogical Proof Standard** and enables AI to distinguish between source data and inferences.

### FamilySearch Integration

Every entity tracks its FamilySearch ID for bi-directional sync:
- `person.fsId` → FamilySearch Person ID
- `relationship.familySearchId` → FamilySearch Relationship ID
- `source.fsId` → FamilySearch Source ID

The `familySearchSync` table tracks:
- When each person was last synced
- What changed (local vs. remote)
- Conflict detection (simultaneous edits)

### Core Entities

| Entity | Purpose | GEDCOM X Equivalent |
|--------|---------|---------------------|
| **Person** | Individual (living or deceased) | Person |
| **Relationship** | Direct Person↔Person link (Couple, ParentChild) | Relationship |
| **Event** | Standalone events (census, occupation, etc.) | Event |
| **Place** | Hierarchical place descriptions | PlaceDescription |
| **Source** | Top-level source (book, census, etc.) | SourceDescription |
| **Citation** | Specific reference within source | SourceReference |
| **Story** | AI-generated or user-written narratives | *(our extension)* |
| **ResearchTask** | AI-suggested research tasks | *(our extension)* |
| **FamilySearchSync** | Sync state per person | *(our extension)* |

## ⚙️ Configuration

### OpenRouter API Key

To use in-app AI processing:

1. Get an API key from [OpenRouter](https://openrouter.ai/keys)
2. Open **Settings** in the app (`/app/settings`)
3. Enter your API key and click **Save**
4. Select your preferred AI model (Claude, GPT-4o, Gemini, etc.)

### Privacy Controls

- **Auto-redact sensitive info** - Automatically removes emails, phone numbers, addresses before AI processing
- **Living person detection** - Warns when data may contain living individuals
- **Original vs Redacted toggle** - Choose which version to send to AI

### Admin Mode

For development/testing, enable Admin Mode in Settings:
- Faster extraction pacing (no delays)
- No expansion caps
- Testing features enabled

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | ShadCN UI |
| Validation | Zod |
| AI Integration | OpenRouter API |
| Storage | Local filesystem (JSON, Markdown) |
| Extension | Chrome Manifest V3 |

## 🔒 Data Privacy

Your data stays with you:

- ✅ All data stored locally on your computer
- ✅ Nothing sent to external servers without explicit action
- ✅ Sensitive information auto-redacted before AI processing
- ✅ Export everything in readable formats (JSON, Markdown)
- ✅ No account required, no tracking

## 📋 Compliance Note

This tool is designed to work with FamilySearch in a compliance-friendly manner:

- ✅ User-initiated extraction only (no automated scraping)
- ✅ Paced operations with built-in delays
- ✅ Read-only behavior (no modifications to FamilySearch)
- ✅ Clear consent before data capture
- ✅ Follows FamilySearch plugin guidance

Please ensure you comply with [FamilySearch's Terms of Use](https://www.familysearch.org/legal/terms) when using this tool.

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Platform setup (Next.js, Tailwind, ShadCN)
- [x] Marketing website
- [x] App dashboard with sidebar navigation
- [x] Settings page with API key management
- [x] Browser extension skeleton

### Phase 2: Source Documentation (Current)
- [x] Evidence Pack schema and validation
- [x] Import/export workflow
- [x] Raw document generator
- [x] AI processing pipeline (3 stages)
- [x] Redaction and privacy controls
- [ ] Full extension extraction logic
- [ ] Contextualized dossier generation

### Phase 3: Storytelling
- [ ] Story Writer tool
- [ ] Narrative templates
- [ ] Timeline visualization

### Phase 4: Advanced Features
- [ ] Photo Analyzer
- [ ] Research Planner
- [ ] Collaboration features

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Created by [@scottjarvie](https://github.com/scottjarvie)

---

*Tell Their Stories - Because every ancestor has a story worth telling.*
