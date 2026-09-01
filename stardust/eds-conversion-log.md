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
