# Wix Editor Guide — Adding Pages to Notewright

## Current State
- **Site:** "Notewright (DRAFT)" on Wix
- **Pages built:** Home (1 page with hero, value pillars, and basic content)
- **Pages needed:** 8 more content pages + 3 legal placeholders

## How to Add Pages in the Wix Editor

### Step 1 — Open the Editor
1. Go to https://manage.wix.com
2. Find "Notewright (DRAFT)" in your site list
3. Click "Edit Site" to open the visual editor

### Step 2 — Add a New Page
1. In the editor, click the **Pages** icon in the left sidebar (looks like stacked pages)
2. Click **"+ Add Page"**
3. Choose **"Blank Page"** (we'll add content manually)
4. Name the page (e.g., "How It Works")

### Step 3 — Add Content
For each page, copy the content from the corresponding `.md` file in the `content/` folder of the GitHub repo.

**Recommended section structure for each page:**
1. Add a **Strip/Section** for the hero area (full-width, navy background #1B2A4A)
2. Add **Text** elements for headings (white text on navy) and body text
3. Add **Columns** for side-by-side content (e.g., the 3 pillars, 3 tiers)
4. Add a **Button** for CTAs — text "Join the Waitlist", link to the Contact page or waitlist form
5. Add a **Strip** at the bottom for the Flowtica disclaimer (italic text)

### Step 4 — Add the Waitlist Form
On Home and Contact pages:
1. Click **"+ Add"** in the left sidebar
2. Go to **Interactive** → **Form**
3. Choose a simple form layout
4. Remove all fields except **Email**
5. Set the button text to **"Join the Waitlist"**
6. Set form submissions to go to your **Wix Inbox** or connected email

### Step 5 — Add to Navigation
Each page should automatically appear in the site menu. Reorder them:
1. Home
2. How It Works
3. Features
4. Mastery Pack
5. Who It's For
6. About
7. FAQ
8. Contact
9. Blog

Legal pages (Privacy Policy, Terms, Disclaimer) should be in the **footer menu only**, not the main nav.

### Step 6 — Set Colours & Fonts
- Primary background: Navy #1B2A4A
- Accent/buttons: Teal #2A9D8F
- Text on dark: White #FFFFFF
- Text on light: Navy #1B2A4A
- Headings: Clean sans-serif
- Body: 16px minimum

### Page-by-Page Content

| Page | Content File | Key Elements |
|------|-------------|--------------|
| Home | `content/01-home.md` | Hero, 3 pillars, waitlist form, disclaimer |
| How It Works | `content/02-how-it-works.md` | 3-step workflow, device features, disclaimer |
| Features | `content/03-features.md` | Feature cards/grid (8 features), CTA |
| Mastery Pack | `content/04-mastery-pack.md` | 3 tier cards (Starter/Pro/Business), CTA |
| Who It's For | `content/05-who-its-for.md` | 6 audience segments with benefits, CTA |
| About | `content/06-about.md` | Mission, beliefs, independence statement |
| FAQ | `content/07-faq.md` | 8 Q&A items, contact link |
| Contact | `content/08-contact.md` | Waitlist form (email only), enquiries |
| Blog | `content/09-blog.md` | Placeholder with topic list, CTA |
| Privacy Policy | `legal/privacy-policy.md` | Placeholder text |
| Terms of Service | `legal/terms-of-service.md` | Placeholder text |
| Disclaimer | `legal/disclaimer.md` | Placeholder text, independence statement |

## ⚠️ Important Reminders
- **DO NOT publish** the site or connect a domain
- **DO NOT add** ABN, registered business name, or payment/checkout features
- **DO NOT claim** Flowtica partnership or endorsement
- All CTAs must say **"Join the Waitlist"** only
- Include the independence disclaimer on every page that mentions Flowtica
