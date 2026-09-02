/**
 * hero — wijnabonnement header band: full-bleed photo + white rounded card
 * (template-slotted; schema: stardust/eds-schema/wijnabonnement.json § hero).
 *
 * Authoring rows (classified by content, not index):
 *   - background photo (editorial, authorable)
 *   - <h1> page title
 *   - intro paragraph
 *   - CTA (<strong><a>, buttonized)
 *   - benefits lead-in paragraph (short, bold — e.g. "De voordelen")
 *   - <ul> benefit checks (rendered with green ✓, as live)
 */
function decorateCampaign(block) {
  // campaign variant — centered white card over full-bleed bg
  // (het-vatencollectief; schema § hero). First image = bg layer, second =
  // card logo; remaining cells render IN AUTHORED ORDER (copy, button rows,
  // fine print) so the composition matches the source.
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const band = document.createElement('div');
  band.className = 'hero-bg hero-bg-campaign';
  const card = document.createElement('div');
  card.className = 'hero-campaign-card';
  let imgSeen = 0;
  cells.forEach((cell) => {
    const m = cell.querySelector('picture, img');
    if (m && !cell.querySelector('a')) {
      imgSeen += 1;
      if (imgSeen === 1) {
        const layer = document.createElement('div');
        layer.className = 'hero-bg-layer';
        const img = (m.closest('picture') || m).cloneNode(true);
        const raw = img.matches('img') ? img : img.querySelector('img');
        if (raw) { raw.setAttribute('loading', 'eager'); raw.setAttribute('fetchpriority', 'high'); }
        layer.append(img);
        band.append(layer);
      } else {
        const fig = document.createElement('figure');
        fig.append((m.closest('picture') || m).cloneNode(true));
        card.append(fig);
      }
      return;
    }
    if (cell.querySelector('a.button, strong a, em a')) {
      // consecutive button rows join ONE flex group (live model: a single
      // wrapping row — 2 lines at 1440, 1 line at wide viewports)
      let rowEl = card.lastElementChild;
      if (!rowEl || !rowEl.classList.contains('hero-campaign-buttons')) {
        rowEl = document.createElement('div');
        rowEl.className = 'hero-campaign-buttons';
        card.append(rowEl);
      }
      const ps = [...cell.querySelectorAll('p')];
      ps.forEach((pp) => rowEl.append(pp.cloneNode(true)));
      if (!ps.length) [...cell.childNodes].forEach((n) => rowEl.append(n.cloneNode(true)));
      return;
    }
    if (!cell.textContent.trim()) return;
    const copy = document.createElement('div');
    copy.className = 'hero-campaign-copy';
    [...cell.children].forEach((n) => copy.append(n.cloneNode(true)));
    if (!cell.children.length) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      copy.append(p);
    }
    card.append(copy);
  });
  band.append(card);
  const wrap = document.createElement('div');
  wrap.className = 'hero-wrap';
  wrap.append(band);
  block.replaceChildren(wrap);
}

export default async function decorate(block) {
  if (block.classList.contains('campaign')) { decorateCampaign(block); return; }
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let bg = null;
  let title = null;
  let intro = null;
  let cta = null;
  let leadIn = null;
  let checks = null;

  cells.forEach((cell) => {
    const m = cell.querySelector('picture, img');
    if (m && !bg) { bg = m.closest('picture') || m; return; }
    const h = cell.querySelector('h1, h2');
    if (h) { title = h; return; }
    const list = cell.querySelector('ul, ol');
    if (list) { checks = list; return; }
    const a = cell.querySelector('a');
    if (a) { cta = a; return; }
    const t = cell.textContent.trim();
    if (!t) return;
    if (!intro && t.length > 60) { intro = cell; return; }
    if (!leadIn) leadIn = cell;
  });

  const band = document.createElement('div');
  band.className = 'hero-bg';
  if (bg) {
    const layer = document.createElement('div');
    layer.className = 'hero-bg-layer';
    const img = bg.cloneNode(true);
    const raw = img.matches('img') ? img : img.querySelector('img');
    if (raw) { raw.setAttribute('loading', 'eager'); raw.setAttribute('fetchpriority', 'high'); }
    layer.append(img);
    band.append(layer);
  }

  const card = document.createElement('div');
  card.className = 'hero-card';
  const top = document.createElement('div');
  top.className = 'hero-card-top';
  if (title) {
    const h1 = document.createElement('h1');
    [...title.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
    top.append(h1);
  }
  card.append(top);

  const cols = document.createElement('div');
  cols.className = 'hero-card-cols';
  const left = document.createElement('div');
  left.className = 'hero-col hero-col-left';
  if (intro) {
    const p = document.createElement('p');
    [...intro.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    left.append(p);
  }
  if (cta) {
    const row = document.createElement('p');
    row.className = 'button-wrapper hero-cta-row';
    const a = cta.cloneNode(true);
    if (!a.classList.contains('button')) a.classList.add('button', 'primary');
    row.append(a);
    left.append(row);
  }
  const right = document.createElement('div');
  right.className = 'hero-col hero-col-right';
  if (leadIn) {
    const p = document.createElement('p');
    p.className = 'hero-lead-in';
    const strong = document.createElement('strong');
    strong.textContent = leadIn.textContent.trim();
    p.append(strong);
    right.append(p);
  }
  if (checks) {
    const wrap = document.createElement('div');
    wrap.className = 'hero-checks';
    [...checks.querySelectorAll('li')].forEach((li) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.append('✓ ');
      const span = document.createElement('span');
      span.className = 'green-check';
      [...li.childNodes].forEach((n) => span.append(n.cloneNode(true)));
      strong.append(span);
      p.append(strong);
      wrap.append(p);
    });
    right.append(wrap);
  }
  cols.append(left, right);
  card.append(cols);
  band.append(card);

  const wrap = document.createElement('div');
  wrap.className = 'wrap hero-wrap';
  wrap.append(band);
  block.replaceChildren(wrap);
}
