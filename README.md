# Picmorable — Personal Memory Preservation Platform

<p align="center">
  <img src="./public/favicon.svg" alt="Picmorable Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>An intelligent personal memory platform transforming scattered photo archives into organised, searchable, and beautifully preserved life experiences.</strong>
</p>

<p align="center">
  <em>"Turn your scattered photographs into a beautiful, searchable story of your life. Less organising. More remembering."</em>
</p>

---

## 📖 Overview: What is Picmorable?

Conventional photo applications (Google Photos, Apple Photos, Amazon Photos) primarily focus on **cloud storage, backup, and sync**. For people who have accumulated 5,000 to 20,000+ photographs over 15–20 years across old laptops, memory cards, external drives, and chat backups, standard tools often feel overwhelming, disorganized, or trapped behind monthly cloud lock-ins.

**Picmorable** is built on a different proposition: **Personal Memory Management (PMM)**. It is an intelligent memory reconstruction platform designed to:
1. **Reconcile forgotten photo archives** from multiple devices into a single coherent timeline.
2. **Eliminate duplicates and compressed messaging copies** while preserving high-resolution masters.
3. **Reconstruct life events automatically** (holidays, graduations, road trips, family occasions) from camera timestamps and GPS coordinates.
4. **Generate context-aware memory captions** that combine verified camera facts with descriptive prose.
5. **Preserve memories for generations** through interactive timelines, digital albums, and layflat hardcover photo book layouts.

---

## ✨ Key Features & Architectural Modules

### 1. Intelligent Photo Importation & Pipeline (Module A)
- **Multi-Source Ingestion:** Import from local computer folders, external hard drives, SD cards, and cloud archives (Google Takeout, iCloud, WhatsApp media exports).
- **Pre-Seeded 15-Year Archive:** Includes a built-in sample collection of 3,420 photographs spanning 2012–2026 across 5 devices with full EXIF metadata.
- **Resumable Bulk Upload Simulator:** 6-stage pipeline (*File Validation → Duplicate Detection → EXIF Extraction → Thumbnails & Embeddings → Event Clustering → AI Memory Captioning*) with background continuation so you can browse your library immediately.
- **Duplicate & Burst Resolver:** Side-by-side comparison separating exact file duplicates (MD5 hash) from perceptual similarities (burst shots, compressed transfers) with one-click master consolidation.

### 2. Multi-Dimensional Organisation & Event Clustering (Modules B & D)
- **Multi-Dimensional Taxonomy:** Browse by chronological years/months, camera gear (Leica, Canon, Sony, Fujifilm, Apple), and verified GPS locations (Andalucía, Oxford, Cotswolds, Kyoto, London).
- **Intelligent Event Reconstruction:** Clustered events using temporal proximity and geographical boundaries (e.g. *Summer Holiday in Andalucía, University Graduation & Celebration, Autumn Weekend in the Cotswolds*).
- **User-Confirmed Albums:** Review suggested event clusters, approve them, edit custom narrative stories, or merge/split clusters.

### 3. Context-Aware AI Captions & Provenance Inspector (Module C)
- **3-Tier Provenance Separation:**
  - **Tier 1 (Verified Metadata):** EXIF timestamp, camera model, lens, exposure, and GPS coordinates (unalterable facts).
  - **Tier 2 (Visual Detections):** Computer vision objects, subjects, and scenes.
  - **Tier 3 (Contextual Inference):** AI-generated narrative hypothesis.
- **Three Switchable Caption Styles:**
  - *Simple:* Concise, factual summary.
  - *Descriptive:* Rich sensory and compositional details.
  - *Memory Style:* Warm, narrative prose blending verified facts with atmosphere.
- **Personal Customization:** Inline caption editor with user confirmation tracking.

### 4. "Your Life in Pictures" — Interactive Timeline (Module E)
- **Visual Dot-Density Timeline (2012–2026):** Ribbon showing photographic density across 15 years.
- Click any year to reveal reconstructed milestone events, geographic footprints, active months, and photographic highlights.

### 5. Memory Discovery ("On This Day")
- Flashback engine surfacing memories captured on today's date across previous years (e.g. 3 years ago today in Castle Combe, 5 years ago in Oxford).
- Seasonal memory cards prompting rediscovery without manual searching.

### 6. 4-Layer Natural Language Hybrid Search (Module F)
- Conversational search interface (`⌘K` shortcut) that decomposes natural language into:
  - *Layer 1:* Structured metadata filters (dates, countries, cameras)
  - *Layer 2:* Semantic visual concepts (beach, sea, cliffs, stone cottage, graduation gown)
  - *Layer 3:* Narrative caption text
  - *Layer 4:* Contextual query interpreter displaying an inspectable **AST / JSON Query Plan**.

### 7. Physical Memory Products — Layflat Photo Books (Section 15)
- Turn any approved digital album into a museum-grade **12×12″ Layflat Hardcover Photo Book**.
- Features linen texture covers, foil-stamped typography, multi-page editorial spreads, narrative captions, and exportable 300 DPI print-ready specifications.

### 8. Trust, Privacy & UK GDPR Governance (Sections 6 & 7)
- **The 7 Trust Commitments:** Zero AI model training on your photos, private by default, full data portability, and permanent cryptographic purge.
- **Processing Architecture Switch:** Choose between *Standard Private Cloud* or *Privacy-Enhanced On-Device Processing*.
- **Facial Recognition Safeguard:** Disabled by default under UK ICO biometric guidance; strictly opt-in.
- **Data Portability:** One-click full library manifest export (JSON format with complete EXIF and provenance data).
- **Flexible Commercial Model:** Choose between accessible subscriptions (£0–£10.99/mo) or a **One-Off 20-Year Archive Preservation Package** (£39.00 lifetime curation with no recurring fees).

---

## 🚀 How Best to Use Picmorable

### Step 1: Import Your Archive
- Click **"Import Photos"** in the top navigation bar.
- Choose **"Pre-Seeded 15-Year Archive"** for an immediate tour of a multi-device collection, or drag and drop your own photo files.
- Watch the resumable pipeline validate files, compute hashes, extract EXIF data, and form event clusters.

### Step 2: Resolve Duplicates
- If duplicates or rapid bursts are detected, click the **"Duplicates"** pill in the header.
- Inspect the side-by-side comparison (master RAW/DNG file vs compressed WhatsApp export).
- Choose **"Consolidate (Keep Master Only)"** to declutter your feed while safeguarding the highest-resolution original.

### Step 3: Explore Suggested Event Albums
- Navigate to **"Suggested Albums"**.
- Review automatically clustered events. Click **"Approve Album"** to confirm an event, or click **"Edit album story"** to add personal family recollections.

### Step 4: Inspect Provenance and Captions
- Click any photo in the library to open the **Memory Inspector**.
- Switch between **Simple**, **Descriptive**, and **Memory** caption styles.
- Click the **"Provenance Architecture"** tab to see how Picmorable separates camera hardware facts from AI computer vision and narrative inferences.

### Step 5: Search in Natural Language
- Press `⌘K` or click **"Natural Search"** in the header.
- Type conversational questions like:
  - *"Photos of beach and coastal cliffs in Spain in 2022"*
  - *"Autumn stone cottages with bridge"*
  - *"University graduation celebrations with family in Oxford"*
- Toggle the **"View Query AST"** button to see the underlying structured JSON interpretation.

### Step 6: Create a Hardcover Memory Book
- Open any album and click **"Layflat Book"** (or **"Memory Book"**).
- Flip through the simulated hardcover layflat book spreads, view the typography, and export the print-ready proof.

---

## 🌐 Hosting via GitHub Pages (`github.io`)

Picmorable is pre-configured for GitHub Pages hosting:

1. **Relative Asset Paths:** `vite.config.ts` defines `base: './'`, ensuring all assets, scripts, stylesheets, and images load correctly whether hosted at the root domain (`https://<username>.github.io/`) or a project subpath (`https://<username>.github.io/<repo-name>/`).
2. **Building the Production Bundle:**
   ```bash
   npm run build
   ```
   This generates a static `dist/` directory ready for any static web host.

3. **Deploying to GitHub Pages:**
   - **Option A (GitHub Actions):** Push to GitHub and enable **GitHub Pages** in your repository settings (*Settings → Pages → Source: GitHub Actions*). You can use standard Vite deploy actions.
   - **Option B (Manual gh-pages branch):**
     ```bash
     npm run build
     npx gh-pages -d dist
     ```

---

## 🛠️ Technology Stack

- **Framework:** React 19 (Functional components, hooks)
- **Build Tool:** Vite 8 (with relative asset linking for GitHub Pages)
- **Styling:** Tailwind CSS v4 with bespoke `@theme` typography (`Fraunces` editorial serif, `Plus Jakarta Sans`, and `JetBrains Mono`)
- **Icons:** Lucide React
- **Design Constitution:** Compliant with the Universal Frontend Design Constitution (60-30-10 color allocation, Zero-Pill metadata discipline, Top Bar Contract, single-elevation depth, and tabular figures).

---

## 📄 License

Apache-2.0. Built for personal digital memory preservation.
