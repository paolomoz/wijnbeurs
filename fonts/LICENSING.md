# Font licensing — wijnbeurs

Brand faces load from the customer's own Adobe Fonts kits (no font files in
this repo):

| Family | Kit | Foundry | Status |
|---|---|---|---|
| degular-variable | use.typekit.net/why3wdc.css | OHno Type Co via Adobe Fonts | ⚠️ kit is domain-scoped |
| ivypresto-text | use.typekit.net/cbo7uar.css | IvyFoundry via Adobe Fonts | ⚠️ kit is domain-scoped |

Adobe Fonts kits serve only to domains registered on the kit. The kits are
e-luscious's own (same URLs the live wijnbeurs.nl loads); before a production
launch either add the delivery domain to the kit in Adobe Fonts, or license
and self-host the woff2 files.

**Remove path**: delete the two `@import` lines in `styles/fonts.css` — all
stacks fall back to `degular-fallback` (metric-matched Arial) and
`ivypresto-fallback` (metric-matched Times New Roman) with zero layout shift.
