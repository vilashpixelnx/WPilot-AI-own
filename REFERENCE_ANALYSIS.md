# Reference Design Analysis — `refference -live-page` (RecurHub)

> **Status: ANALYSIS ONLY. No files in the current project have been modified.**
> This document records what makes the reference page work so we can later match its
> **design quality, layout discipline, spacing, and modern UI concepts** — while keeping
> **WPilot AI's own color palette, gradients, and branding**. We will NOT copy the
> reference's colors or clone it 1:1.

---

## 1. What the reference is

- **Product:** "RecurHub" — a long-form, single-page direct-response **sales/landing page**.
- **Files:** `index.html` (~200 KB), `live.css` (~108 KB), `live.js` (~5 KB), plus a large
  `assets/` folder (**169 PNG, 9 SVG, 2 WebP** — logos, feature shots, avatars, backgrounds).
- **Stack:** Hand-written HTML/CSS/vanilla JS. No framework, no build step. Fonts:
  **Plus Jakarta Sans** (headings) + **Inter** (body) via Google Fonts.
- **Same family as our project:** static three-file sales page — so its patterns port cleanly.

---

## 2. Overall page structure & section order

A deliberate direct-response narrative arc, top → bottom:

1. **Announcement bar** — thin top strip (offer + optional countdown timer).
2. **Nav** — minimal logo + CTA; becomes a **sticky header that slides in after 300px** scroll.
3. **Hero** (`#hero`) — eyebrow tag → huge headline (90px) with gradient words → 3-step flow
   → **embedded video (VSL)** replacing a static mockup → CTA row → trust line.
4. **Platforms preview** (`#platforms-preview`, light) — proof table of recurring commissions
   with an "annual recurring" total box.
5. **Problem** (`#problem`, dark) — pain cards ("The Real Problem").
6. **Reality** (light) — the cost/"trap" framing.
7. **Platforms marquee** (`#platforms`) — 230+ logos in **multi-row auto-scrolling marquees**
   (alternating direction & speed).
8. **Intro / Solution** (`#intro`) — product reveal, split layout + video.
9. **How it works** (`#how`, light) — **4-step system** with a connecting line.
10. **Features** (`#features`) — feature rows, also marquee-style numbered rows with imagery.
11. **Results** (`#results`, light) — testimonial / story cards.
12. **The Math** (`section-math`) — industry facts, income journey, milestone cards.
13. **Who it's for** (`#who`, light) — audience persona cards.
14. **What's included / Stack** (`#stack`) — value stack ($1,143+ → offer).
15. **Pricing** (`#pricing`) — premium tag, single one-time price card ($17 vs $97).
16. **Guarantee** (`section-guar`) — iron-clad guarantee band.
17. **Proof** (`#proof`) — more verified reviews.
18. **FAQ** (`#faq`, light) — **accordion** (one-open-at-a-time).
19. **Final CTA** (`section-final`) — closing headline + button.
20. **Disclaimer / Footer** — legal, brand promo box, copyright + links.

**Takeaway for us:** the *rhythm* is the asset — problem → agitation → proof → solution →
mechanism → proof → value stack → price → risk-reversal → FAQ → final push. Our WPilot page
already follows a similar arc; the reference shows how to make each beat feel more polished.

---

## 3. Layout & spacing system

- **Container:** `max-width: 1180px`, `padding: 0 28px`, centered. (Wider `1440px` variant for
  full-bleed hero art.)
- **Section vertical rhythm:** `.section { padding: 96px 0; overflow: hidden; }` — generous,
  consistent breathing room. Every section is `position: relative; overflow: hidden` so
  decorative art can bleed without causing horizontal scroll.
- **Section header block:** `.section-head` capped at `~1140px`, sub-copy capped at `~820px`,
  center-aligned — keeps line length readable.
- **Alternating tone:** dark sections and `.section-light` (near-white `#F7F5FB`) sections
  alternate to segment the long page and reset the eye. This is the single biggest structural
  device — **we can replicate the alternation using OUR light/tinted backgrounds.**
- **Radius scale (tokens):** `10 / 16 / 24 / 32 / 999px` (sm→pill). Consistent rounding.

---

## 4. Typography

- **Headings:** Plus Jakarta Sans, weight 700–900. Fluid sizing with `clamp()`:
  - `h1: clamp(2.4rem, 5.2vw, 4.4rem)` (hero overrides to a dramatic **90px**), line-height ~1.04.
  - `h2: clamp(1.85rem, 4vw, 3.5rem)`, weight 800.
  - `h3: clamp(1.15rem, 2vw, 1.4rem)`.
- **Body:** Inter, 16px, line-height 1.6, antialiased.
- **Gradient text** (`.grad-text`) on key words for emphasis — a **second accent gradient**
  (gold→red `#FDC854 → #FF312B`) is used on hero/feature/price highlight words, distinct from
  the primary brand gradient. Two-gradient system = strong visual hierarchy.
- **Eyebrow tags** (`.section-tag`): uppercase, 14px, weight 800, `letter-spacing: 0.18em`,
  pill-shaped, soft-tinted background + subtle border. Every section opens with one — a clean,
  repeatable "kicker" pattern.

**Takeaway:** fluid `clamp()` type, one display font + one text font, uppercase tracked
eyebrows, and gradient-highlighted keywords. We keep our Inter/Plus Jakarta/Space Grotesk stack
and OUR gradients, but adopt the same hierarchy discipline.

---

## 5. Color & theming (reference only — DO NOT adopt)

Recorded for understanding; **we keep WPilot's palette.**

- Brand gradient: `linear-gradient(90deg, #771AFF → #F072AF)` (purple → pink).
- Accent gradient: `#FDC854 → #FF312B` (gold → red) for highlight words / badges.
- Dark surfaces: `#08060F` bg, elevated `#0F0B1D`, cards `#130E26 / #1A1330`.
- Light surfaces: `#F7F5FB` bg, `#FFFFFF` cards.
- Semantic: success `#10B981`, gold `#F59E0B`, error `#EF4444`.
- Fully **token-driven** (`:root` custom properties for color, radius, shadow, easing, fonts).

**Method to borrow (not the values):** a disciplined `:root` token layer — brand gradient +
soft brand tint + one accent gradient + neutral surface ramp + semantic colors + radius/shadow/
easing scales. Our page already has tokens; the reference shows a more complete, layered set.

---

## 6. Component design language

- **Buttons:** pill-shaped (`999px`), Plus Jakarta, weight 800. Primary = brand gradient with
  `background-size: 200%` for a **hover gradient-shift**, brand-colored shadow, and an animated
  arrow (`svg` slides `translateX(3px)` on hover). Sizes: `btn-lg`, `btn-xl`, `btn-block`.
  Ghost variant with border for secondary actions.
- **Cards** (pain / feature / story / persona / milestone): rounded, subtle border
  (`rgba(255,255,255,0.08)`), soft elevation, a `::before` gradient accent, and a lift-on-hover.
  Consistent internal padding and a clear title→body hierarchy.
- **Pricing card:** premium gradient tag, big price with struck-through anchor price
  (`$17` vs `$97`), feature list with alternating-row tint (`nth-child(even)`), secure-payment
  row, guarantee seal.
- **Tables** (commission proof): zebra striping via `nth-child(even)`, hover row highlight,
  a summarizing "total" box — makes dense numeric proof scannable.
- **Section tags / badges:** consistent pill kicker system (covered above).
- **Shadows:** layered token set — neutral (`0 12px 32px rgba(0,0,0,.25)`) and **brand-tinted**
  (`0 12px 32px rgba(119,26,255,.35)`) for CTAs, so buttons glow in the brand hue.

---

## 7. Backgrounds, gradients & decorative graphics

- Heavy use of **SVG background art** (`bh-bg.svg`, `bnr-head-bg.svg`, `effect-bg.svg`,
  `feat1-bg.svg`, `feat2-bg.svg`, `btn-bg.svg`) plus PNG/WebP hero side icons.
- **Animated hero background:** floating ellipse (`heroEllipseFloat`), flowing vertical
  "figma stripes" generated in JS (`heroStripes`, 24 columns), stripe-flow keyframes.
- Soft radial/linear glows behind sections; `overflow: hidden` on sections keeps bleed contained.
- **Takeaway:** decorative depth comes from layered SVG + subtle motion, never from noise.
  We can achieve the same richness with OUR existing banner art + orbs, kept subtle.

---

## 8. Images, illustrations & icons

- ~169 raster assets: platform **logos** (in `assets/logos/`), numbered feature shots
  (`feat-2…13.png`), avatars (`bn-*`, `g-*`, `l-*`), persona images, badges, guarantee/licence.
- Inline **SVG icons** for button arrows and small UI marks (crisp, recolorable).
- `img { max-width: 100%; display: block; }` global — no overflow, no inline-gap.
- **Takeaway:** real product screenshots + real logos build credibility; SVG for UI chrome.

---

## 9. Animations & interactions (`live.js`, 141 lines, vanilla)

- **Scroll-reveal:** a curated selector list gets `.reveal` (opacity 0 + `translateY(28px)`),
  revealed via **IntersectionObserver** (`threshold 0.08`, `rootMargin -40px`) adding
  `.is-visible`. Transition: `0.7s cubic-bezier(0.16, 1, 0.3, 1)`. Graceful fallback: if no
  IO support, everything is shown immediately.
- **Sticky header:** appears (`.header-visible`) after `scrollY > 300`.
- **FAQ accordion:** one-open-at-a-time, toggles `.open`, manages `aria-expanded`.
- **Countdown timer:** `localStorage`-persisted 47-hour end time so the deadline is stable
  across reloads; `setTimeout` self-scheduling tick (not `setInterval`).
- **Marquee rows:** CSS keyframe scroll (`mScrollL` / `mScrollR`), alternating direction and
  duration (105s / 115s / 130s) per row; **JS pauses animation on hover**.
- **Smooth scroll:** intercepts in-page `#` anchor links for smooth `scrollIntoView`.
- **Easing token:** one shared `cubic-bezier(0.16, 1, 0.3, 1)` ("ease-out-expo"-like) across
  all transitions → cohesive motion feel.

**Takeaway:** motion is tasteful and cheap — IO reveals + CSS marquees + accordion + a shared
easing curve. All of this is compatible with our current GSAP/vanilla setup; the *restraint* and
*consistency* are what to emulate.

---

## 10. Responsive behavior

- **Breakpoints observed:** `1439, 1100, 1024, 991, 768, 720, 575, 480, 420px` — a thorough,
  progressively-degrading ladder (not just one mobile breakpoint).
- Fluid `clamp()` typography reduces how much per-breakpoint work is needed.
- Hero side decorations scale down / hide at narrower widths; marquees and multi-column grids
  collapse; container padding tightens.
- `overflow-x: hidden` on `body` as a global safety net against horizontal scroll.
- **Takeaway:** design mobile as a first-class state with several checkpoints, and lean on
  `clamp()` so the middle sizes look intentional rather than squeezed.

---

## 11. Overall design language & consistency

What makes it feel premium and cohesive:

1. **Token-driven everything** — color, radius, shadow, easing, fonts all centralized.
2. **One display + one text font**, used consistently.
3. **Repeatable section skeleton** — eyebrow tag → h2 → capped sub-paragraph → content grid.
4. **Alternating dark/light sections** to pace a very long page.
5. **Two-gradient hierarchy** — brand gradient for identity, accent gradient for emphasis words.
6. **Generous, consistent spacing** (96px section rhythm; readable line-length caps).
7. **Subtle, shared motion** (one easing curve; IO reveals; hover micro-interactions).
8. **Credibility devices** — logos, tables with totals, persistent countdown, guarantee seals,
   verified reviews.

---

## 12. How this maps to our WPilot AI project (for the LATER build — not now)

When implementation is authorized, apply the reference's **quality and structure**, not its skin:

- **Keep:** WPilot's colors, gradients, logo, brain/indigo-cyan identity, existing copy/voice.
- **Adopt (concepts):**
  - A fuller `:root` token layer (radius/shadow/easing scales) in OUR hues.
  - Consistent **eyebrow-tag → h2 → capped sub** section headers.
  - **Alternating light/tinted section backgrounds** to pace the page.
  - Fluid `clamp()` typography and a two-tier gradient-highlight hierarchy using OUR gradients.
  - Pill CTAs with gradient-shift hover + arrow micro-motion, brand-tinted shadows.
  - IntersectionObserver scroll-reveals with one shared easing curve.
  - Card system with subtle borders, `::before` accents, lift-on-hover.
  - A responsive ladder with several breakpoints + `clamp()`.
- **Do NOT:** copy RecurHub's purple/pink or gold/red palette, clone layouts pixel-for-pixel,
  or import its assets.

---

## 13. Constraints honored for this task

- ✅ No files edited, created, deleted, or moved in the current project **except this analysis doc**.
- ✅ No colors changed; reference palette recorded for context only.
- ✅ No redesign started — awaiting further instructions.
