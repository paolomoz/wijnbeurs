# EDS conversion log — wijnabonnement (replica deploy)

Source of truth: the gated replica prototype
`sites/wijnbeurs-nl/stardust/prototypes/wijnabonnement-proposed.html`
(source-fidelity gate: 1440 2.37%/Δ2, 360 6.05%/Δ0 vs live wijnbeurs.nl).
Schema: `stardust/eds-schema/wijnabonnement.json`.

## Block inventory + decode tiers (locked)

| block | tier | prototype section | notes |
|---|---|---|---|
| `hero` | template-slotted | `.section-wrap[data-section=hero]` | bg photo authorable layer + white rounded card, benefits checks from a `<ul>` |
| `steps` | reconstructive | `.steps` | one row per step (icon/title/desc); head = default content; caption row reserves live's 91px |
| `plans` | reconstructive + featured variant | `.subs` | one row per plan (single cell); leading `<p><em>label</em></p>` = "Meest gekozen" ribbon + maroon frame; CTA pinned to card bottom (flex + margin-top:auto, 31px offset) |
| `photo-text` | template-slotted | `.quote` | bg photo + display h2 + copy |
| `accordion` | reconstructive (Block Collection shape) | `.faq` | Q/A rows, tap-to-toggle, aria-expanded |
| `header` / `footer` | template-slotted chrome | canon.css | /nav (brand: 2 logos; links: 2 lists = left/right groups; tools: usp list) · /footer (10-section contract) |

## Deliberate deltas vs the live page

1. **One responsive content set** replaces live's desktop+mobile PageBuilder twins
   (every text/CTA existed twice on live; the roundtrip gate's MISSING items are
   those twin duplicates).
2. **h2 promotions**: display titles that live renders as styled spans/blockquote
   text are real `<h2>`s ("Kies voor gemak", section heads as default content).
3. **Hidden request-info form** (amhideprice) not migrated.
4. **Hero/quote mobile bg variants**: one authored image per band (live swaps
   assets per breakpoint); authorable later as extra rows.
5. **USP bars frozen** to slide 1 at mobile (live: slick autoplay carousel).
6. Search/account/cart link to the live Magento endpoints (no commerce backend).

## Fonts

Adobe Fonts kits (customer's own: why3wdc + cbo7uar) imported in
`styles/fonts.css` after first paint; metric-matched `degular-fallback` (Arial)
and `ivypresto-fallback` (Times) computed with fontTools; body carries
`font-variation-settings: 'ital' 0, 'opsz' 6` (without it degular renders ~12%
narrow — replica-run finding). ⚠️ kit domains are license-scoped: fonts/LICENSING.md.

## Published-origin gate history (1440)

9.54%/Δ23 → (CTA pinning, nav-height 229, steps caption row 91px, plans pad)
→ 5.73%/Δ1 → (CTA 31px bottom offset; header-main box-sizing defect named:
prototype assumed global border-box) → **5.39%/Δ1 PASS**, CLS 0.0041.
Residual: top band 12.6% = hero-photo rendition recompression (pipeline webp vs
live PNG) + Adobe-Fonts raster deltas + header micro-offsets ≤3px. All bands ≤12.6%.

---

# het-vatencollectief (campaign landing, 2026-09-01)

Second page into the site. Live source is a Magento PageBuilder campaign page
(desktop/mobile twin content, slick USP carousels, data-pb-style visibility
matrix). Replica gate 1440: 4.39%/Δ0, 0 structural red. 360 recorded FAIL at
iteration cap (17.91% — live mobile is a separate twin-content composition);
the EDS page ships one responsive content set gated at 1440.

## Block inventory (block economy)

| Block | Status | Justification |
|---|---|---|
| header | reused | shared chrome, untouched |
| footer | reused | shared chrome, untouched |
| hero | reused + `campaign` variant | same band+card composition as base hero; variant adds full-bleed bg layer (474px photo over cream 631px band), centered white card, authored-order cell rendering — no new block needed |
| accordion | reused + `faq-panel` variant | identical q/a behavior; variant is a pure CSS skin (#D2E1E6 rounded panel) |
| product-card | new (ported from wijnvoordeel repo) | proefpakket buy-box: price decode, qty select, CTA — logic already existed in the sister repo; ported with wijnbeurs skin + single-price fallback rather than reinvented |
| tabs | new (Block Collection name) | 5-tab wine-model browser (15 cards, chips, attrs, per-panel CTA) — no existing block renders labeled panels; named per Block Collection for future reuse |
| columns | new (Block Collection name) | generic n-up used for USP/tile rows; mobile shows first column (carousel freeze); site previously had no generic columns block |

Section styles added to `styles/styles.css` (no new blocks): campaign-quote,
anchor-chips, kalender-band, gradient-band, tinted-green, divider-line,
voordeel (content-anchored via `:has(img[alt^="Volumekorting"])` — multi-value
section style tokens did not deliver a second class on this stack).

## Authoring gotchas hit

1. **`<hr>` is the section delimiter** — authoring it fractured the divider
   sections; replaced with empty `divider-line` sections + CSS `::after` line.
2. **Empty sections vs section-status**: `display:block !important` (needed
   against `:empty` hiding) also defeated EDS pre-load hiding → 0.75 CLS;
   scoped to `[data-section-status='loaded']`.
3. **Full-bleed variant vs wrap max-width**: base `.hero-wrap{max-width:1280px}`
   (no auto margins) left-pinned the whole hero → `max-width:none` on the
   campaign variant. Worth ~3% of the page-level pixel diff on its own.
4. Page-specific header→main gap (6px vs site 26px) handled inside the hero
   block (`margin-top:-20px` on `.hero.campaign`), not in chrome.

## Published-origin gate history (1440)

33.11%/Δ27 → (Δ decomposed exactly: tabs 16 + super 9 + proef 71 + voordeel 27
+ faq 46) → 24.12 → 15.76 → 12.84 → 11.56 → 10.57 → (hero authored-order
fineprint, logo full-bleed) → 10.45 → (hero-wrap max-width:none, dark second
button row) → **7.64% PASS** (doc 6121 live / 6137 eds; −16px is live footer
drift, eds footer is 100.00% identical to the gated wijnabonnement eds footer).
Chrome crops: header 98.47% (residual = day-dependent USP bar text), footer
98.16% at per-side offsets 5521/5522. CLS 0.075 (residual = shared header
chrome shift). Guard: h1 1, 15 tab cards, 14 faq items, 0 zero-width imgs,
0 pageerrors.

Deliberate deltas: day-dependent USP texts; hidden request-info form not
migrated; USP carousels frozen; mobile twin-content composition not replicated.
