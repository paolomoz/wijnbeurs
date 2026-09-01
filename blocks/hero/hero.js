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
export default async function decorate(block) {
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
