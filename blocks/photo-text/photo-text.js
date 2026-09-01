/**
 * photo-text — "Kies voor gemak" photo band with overlay copy
 * (template-slotted; schema: stardust/eds-schema/wijnabonnement.json § quote).
 *
 * Authoring rows: background photo (editorial) | <h2> title | paragraph
 */
export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let bg = null;
  let title = null;
  let body = null;
  cells.forEach((cell) => {
    const m = cell.querySelector('picture, img');
    if (m && !bg) { bg = m.closest('picture') || m; return; }
    const h = cell.querySelector('h1, h2, h3');
    if (h) { title = h; return; }
    if (cell.textContent.trim() && !body) body = cell;
  });

  const band = document.createElement('div');
  band.className = 'quote-bg';
  if (bg) {
    const layer = document.createElement('div');
    layer.className = 'quote-bg-layer';
    layer.append(bg.cloneNode(true));
    band.append(layer);
  }
  const col = document.createElement('div');
  col.className = 'quote-col';
  if (title) {
    const h2 = document.createElement('h2');
    [...title.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    col.append(h2);
  }
  if (body) {
    const p = document.createElement('p');
    p.className = 'quote-text';
    [...body.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    col.append(p);
  }
  band.append(col);
  const wrap = document.createElement('div');
  wrap.className = 'wrap quote-wrap';
  wrap.append(band);
  block.replaceChildren(wrap);
}
