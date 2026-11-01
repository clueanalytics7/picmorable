# Picmorable — Privacy-First Traditional Hardcover Photo Album

<p align="center">
  <img src="./public/favicon.svg" alt="Picmorable Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>A privacy-first, 100% on-device photo album creator that arranges your pictures into an authentic traditional hardcover book with personal captions, narrative stories, and template exports.</strong>
</p>

<p align="center">
  <em>"Turn your scattered photographs into a beautiful, tangible story of your life — with zero pictures leaving your device."</em>
</p>

---

## 📖 Overview: What is Picmorable?

Conventional photo applications often focus on cloud storage, backup, and sync. For people who want to preserve special moments without uploading private family photographs to third-party cloud servers, standard tools can feel intrusive and overly complex.

**Picmorable** is built on a strict **Privacy-First, On-Device** proposition:
1. **100% Client-Side Processing:** No picture ever leaves your device. All thumbnails, aspect ratio computations, layout arrangements, and exports are executed locally within your browser sandbox.
2. **Traditional Hardcover Album Experience:** Turn pages of a tactile, old-fashioned hardcover photo album complete with textured linen/leather bindings, debossed gold/silver foil typography, stitched spine creases, and vintage photo corner mounts.
3. **Intelligent & Intuitive Photo Arrangement:** Upload multiple photos at once; Picmorable automatically analyzes their orientations and pairs portraits, highlights wide panoramic shots, and balances two-page spreads.
4. **Rich Dual-Level Descriptions:** Write a dedicated, comprehensive narrative description for the **entire album** (printed on the opening frontispiece) as well as personal archival captions for **each individual photograph**.
5. **Instant Template & Archival Downloads:** Export your rearranged photos organized by page and item number alongside a formatted caption transcript (`.TXT`) and structured manifest (`.JSON`) packaged in a single client-side `.ZIP` file.

---

## ✨ Key Features

### 🔒 1. 100% On-Device Privacy Guarantee
- **Zero Cloud Uploads:** Photos are ingested via browser memory buffers (`URL.createObjectURL`). Not a single byte is transmitted over the network.
- **Works Fully Offline:** You can disconnect your network connection, upload hundreds of photos, arrange spreads, and export the final package completely offline.
- **Zero Tracking:** No telemetry, tracking scripts, or analytics cookies.

### 📚 2. Authentic Old-Fashioned Hardcover Album
- **Tactile Hardcover Bindings:** Choose between Royal Burgundy Leather, Vintage Forest Linen, Deep Oxford Navy Buckram, Warm Sandstone Cloth, and Antique Espresso Calfskin.
- **Debossed Metallic Foil Stamping:** Custom foil stamping in Antique Gold, Polished Silver, Rose Copper, or Blind Embossed lettering.
- **Physical Two-Page Spreads:** Left and right cream parchment pages (`#faf8f2`) featuring authentic center gutter creases, deckle borders, and subtle paper texture.
- **Vintage Photo Mount Corners:** Classic diagonal tri-corner photo mounts (Black Paper, Brass Gold, Ivory Cloth, or Clean White Photographic Margins).
- **Subtle Acoustic Feedback:** Synthesized paper page-turn rustle using the browser's Web Audio API (no external audio files required, toggleable anytime).

### 📐 3. Intelligent Arrangement Engine
- **Balanced Layouts:** Automatically detects photo aspect ratios:
  - Pairs vertical portraits side-by-side (`twin-portrait`).
  - Gives landscape and panoramic vistas prominent hero placements (`hero-single` / `duo-landscape`).
  - Assembles vignettes into harmonious trios (`story-trio`) or 2x2 collage grids (`quad-scrapbook`).
- **Flexible Arrangement Strategies:**
  - *Intelligent Balanced:* Harmonious pairing based on orientation and visual weight.
  - *Chronological Timeline:* Arranged sequentially by capture timestamp.
  - *Single Hero Plates:* One high-impact photo per page with centered caption.
  - *Dense Scrapbook:* Four photos per spread with authentic rotational offsets.
- **Per-Page Customization:** Switch any individual page's template on the fly via the template selector.

### ✍️ 4. Captions & Album Narrative Story
- **Album Narrative Field:** A prominent, rich description block on the frontispiece page where you write the overarching story of the album (the holiday, family gathering, wedding, or milestone).
- **Per-Picture Descriptions:** An inline editable caption slip directly beneath each photograph formatted in classic italic serif typography.

### 🎬 5. Sleek Fullscreen Slideshow / Presentation Mode
- **Cinema-Grade Viewing:** Click **"Slideshow"** in the top toolbar or click directly on any mounted photograph to launch an immersive full-screen presentation room with soft ambient vignettes.
- **Autoplay & Speed Tuning:** Play and pause automatic slideshow progression with customizable intervals (Fast 3s, Normal 5s, Slow 8s).
- **Archival Caption Overlay:** View the photo caption, plate number, date, and location in classic serif typography, with a one-click toggle (`C`) for an unobstructed view of the photo.
- **Thumbnail Scrubber Filmstrip:** Seamlessly scrub across the entire collection to jump directly to any photograph.
- **Keyboard Navigation:** Full support for `Space` (play/pause), `Arrow Left / Right`, `F` (toggle true browser fullscreen), `C` (toggle caption), and `Esc` (exit).

### 📦 6. Downloaded Product in Your Chosen Photo Album Format
Unlike basic tools that merely return loose individual photos and text files, Picmorable exports your creation **in the format of your chosen photo album**:
- **Archival Hardcover Photo Book (.PDF):** A multi-page, landscape photo book laid out in your exact chosen hardcover material (e.g. Burgundy Leather, Forest Linen, Navy Buckram). Includes debossed gold/silver cover stamping, a dedicated frontispiece narrative plate, and carefully spaced album pages with antique photo corner mounts and italic captions. Ready to view, share, or send to a print shop.
- **Standalone Offline Interactive Album (.HTML):** A self-contained, single-file interactive photo album you can double-click on any computer offline. Features the tactile hardcover binding, turning pages, Web Audio paper rustle sounds, and integrated fullscreen slideshow.
- **Complete Archival Package (.ZIP):** Bundles the Hardcover Book (.PDF), the Standalone Interactive Album (.HTML), the formatted transcript (.TXT), and all rearranged high-resolution photos into one archival backup.
- **Plain Text Transcript (.TXT):** Formatted archival transcript of your album story narrative and all photo captions.

---

## 🚀 How Best to Use Picmorable

### Step 1: Browse or Personalize the Starter Album
- Explore the pre-loaded sample album (*"Summer by the Atlantic Coast"*) to experience page turning, cover styles, and captions.
- Click **"Open Photo Album"** or use the **`←`** and **`→`** arrow keys on your keyboard to turn pages.

### Step 2: Upload Your Own Photos
- Click **"+ Add Photos"** in the top navigation toolbar.
- Drag and drop multiple photos from your computer or click to browse.
- Choose whether to **"Start new album"** or **"Append to current album"**.
- Select your preferred arrangement strategy (*Intelligent Balanced*, *Chronological*, etc.) and click **"Arrange into Hardcover Album"**.

### Step 3: Write Your Descriptions
- **Album Story:** Click on the opening frontispiece plate (Page 1) to write the overview description of the entire album.
- **Photo Captions:** Click directly on the caption text below any photograph to write personal recollections, dates, or locations. Press **Enter** to save.

### Step 4: Customize the Hardcover
- Click the **Sliders** icon in the toolbar or return to the cover view to customize:
  - Album Title & Subtitle.
  - Hardcover material (Burgundy Leather, Forest Linen, Navy Buckram, etc.).
  - Foil stamping (Gold, Silver, Rose Copper).
  - Photo corner style (Classic Black, Brass, Ivory).

### Step 5: Download in Your Chosen Photo Album Format
- Click **"Download"** in the top-right corner.
- Select your preferred format:
  - **Hardcover Photo Book (.PDF):** For reading or printing the complete landscape album with cover foil, frontispiece narrative, and arranged photo plates.
  - **Interactive Standalone Album (.HTML):** For a portable, offline album app that turns pages, rustles, and plays fullscreen slideshows on any computer.
  - **Complete Archival Package (.ZIP):** To get the PDF, interactive HTML, transcript, and photos all in one archival zip.

---

## 🛠️ Technology Stack

- **Framework:** React 19 (Functional components, hooks)
- **Styling:** Tailwind CSS v4 with bespoke editorial typography (`Fraunces` serif, `Plus Jakarta Sans`, and `JetBrains Mono`)
- **Archiving & Packaging:** `jszip` for 100% on-device file bundling
- **Audio Engine:** Web Audio API procedural synthesis for paper rustle sound
- **Icons:** Lucide React
- **Build System:** Vite 8

---

## 📄 License

Apache-2.0. Built for personal privacy and lifelong memory preservation.
