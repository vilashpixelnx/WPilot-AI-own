# WPilot AI — Sales Landing Page

A high-conversion, single-page marketing/sales landing page for **WPilot AI**, a bundle of 10 AI-powered WordPress plugins sold under a one-time, lifetime-access license.

> _"10 AI WordPress Plugins. 1 License. Every Task Automated. Forever."_

---

## Overview

This folder is a **self-contained static website** — plain HTML, CSS, and vanilla JavaScript with no build step, framework, or backend. Drop the three files on any static host (or open `index.html` directly) and the page runs.

The page is a long-form direct-response sales page: hero hook → pain agitation → solution reveal → product demos → the 10 plugins → value stacking → social proof → pricing → guarantee → FAQ → final CTA.

## Files

| File | Size | Purpose |
|------|------|---------|
| [`index.html`](index.html) | ~62 KB | All page markup and copy across ~30 sections |
| [`style.css`](style.css) | ~72 KB | Full design system + all section styling + responsive rules |
| [`script.js`](script.js) | ~5 KB | Scroll animations, count-ups, countdown, card tilt, popup |

## External Dependencies (loaded via CDN)

- **Google Fonts** — Be Vietnam Pro (single font family)
- **GSAP 3.12.5** + **ScrollTrigger** — scroll-reveal animations and 3D card tilt
- **Unsplash** — some hero/demo imagery is hot-linked

> An internet connection is required for fonts, animations, and images to load. The page degrades gracefully — a fallback in `script.js` forces all content visible if GSAP fails to load.

## Page Structure

The CSS header documents the section order. The main sections are:

1. **Top bar** — flash-sale banner, discount code (`WPILOT2`), and live countdown timer
2. **Hero** — brand lockup, headline, primary CTA, trust badges
3. **Trust stats** — animated count-up metrics
4. **Social proof bar** — compatibility / trust logos
5. **Pain section** — the cost of juggling 10+ subscriptions
6. **Solution reveal** — WPilot AI as the single replacement
7. **Product demo collage** — mock UI screenshots of the plugins
8. **Live activity feed** — scrolling "recent purchases" ticker
9. **Plugins bento** — the 10 plugins, each with features and what it replaces
10. **A day with WPilot AI**, **Money saved**, **Philosophy**, **Before/After**, **Value comparison**
11. **Testimonials** and **Income opportunity**
12. **Pricing** — `$19` one-time (`$17` with code), anchored against `$199/mo`
13. **Bonuses**, **Guarantee** (30-day money-back), **Who it's for**, **FAQ**
14. **Final CTA** and **Footer**

## The 10 Plugins

| # | Plugin | Replaces |
|---|--------|----------|
| 01 | AI Commerce | Nosto + Tidio + Signifyd + Weglot |
| 02 | Claude Assistant | A $500–$1,800/mo VA |
| 03 | GEO Optimizer | Yoast Premium + GEO consultant |
| 04 | Image Optimizer | ShortPixel, Smush Pro, Imagify |
| 05 | Affiliate System | AffiliateWP + Refersion |
| 06 | WhatsApp Notifier | Wati + Interakt |
| 07 | Security Plugin | Wordfence Premium + Sucuri |
| 08 | TryIt Virtual Try-On | Custom AI services ($199–$499/mo) |
| 09 | Uptime Monitor | UptimeRobot, Pingdom, Better Uptime |
| 10 | Custom Checkout Fields | Checkout Field Editor ($79/yr) |

## JavaScript Behavior (`script.js`)

All logic is wrapped in a single IIFE (`'use strict'`) with no dependencies of its own beyond the optional GSAP globals:

- **Scroll reveals** — `.reveal` elements fade/slide in via ScrollTrigger (hero plays on load)
- **Count-up numbers** — `.count-up` elements animate to their `data-target` with an ease-out curve
- **3D card tilt** — plugin cards tilt toward the cursor (fine-pointer devices only)
- **Countdown timer** — the flash-sale clock counts down and rolls over so it never hits zero
- **Social proof popup** — dismissible "recent purchase" notification
- **Graceful fallback** — after 3.5s, any still-hidden `.reveal` element is forced visible

## Running Locally

No build required. Either:

```bash
# Simplest — just open the file
start index.html          # Windows

# Or serve it (recommended, avoids any file:// quirks)
npx serve .
# or
python -m http.server 8000
```

Then visit `http://localhost:8000` (if serving).

## Customization Notes

- **Design tokens** live at the top of [`style.css`](style.css) under `:root` — edit colors, fonts, and spacing there.
- **Copy** is all inline in [`index.html`](index.html); sections are clearly commented (e.g. `<!-- PRICING -->`).
- **Pricing / discount code** — update in the top bar, pricing card, and coupon box (`WPILOT2`).
- **Checkout link** — the pricing CTA currently points to `#`; wire it to your real checkout URL.
- **Countdown** — the starting time is hardcoded in `script.js` (`initCountdown`) and resets on each page load.

## Notes

- The page uses placeholder/marketing figures (savings, spots left, "verified purchases") typical of a sales page — replace with real values before going live.
- Contact email in the footer: `support@wpilotai.com`. Privacy/Terms/Refund links are placeholders.
