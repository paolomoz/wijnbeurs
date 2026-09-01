/**
 * tabs — model-selection tabs (Block Collection shape; reconstructive;
 * schema: stardust/eds-schema/het-vatencollectief.json § tabs).
 *
 * Authoring rows: one per tab — cells: [tab label | tab content].
 * Content cell = repeating model cards segmented on h4 boundaries:
 *   <h4> model name · <img> tile · chips <p> (em-separated) · attr lines
 *   ("Druivenras - x", "Levering - x", "Prijs - x") · optional list <ul>.
 * First tab open; nav switches panels (live jQuery-UI tabs parity).
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('ul');
  nav.className = 'tabs-nav';
  nav.setAttribute('role', 'tablist');
  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  rows.forEach((row, i) => {
    const [labelCell, contentCell] = [...row.children];
    if (!labelCell) return;
    const li = document.createElement('li');
    li.setAttribute('role', 'tab');
    if (i === 0) li.classList.add('active');
    const btn = document.createElement('a');
    btn.href = '#';
    btn.className = 'tab-link';
    btn.textContent = labelCell.textContent.trim();
    btn.addEventListener('click', (e) => e.preventDefault());
    li.append(btn);
    nav.append(li);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    if (i !== 0) panel.style.display = 'none';
    const grid = document.createElement('div');
    grid.className = 'tabs-cards';

    // segment content by h4 boundaries (heading opens a card)
    let card = null;
    const cards = [];
    const nodes = contentCell ? [...contentCell.children] : [];
    nodes.forEach((n) => {
      if (n.matches('h1, h2, h3, h4')) {
        card = document.createElement('div');
        card.className = 'model-card';
        const h = document.createElement('h4');
        [...n.childNodes].forEach((c) => h.append(c.cloneNode(true)));
        card.append(h);
        cards.push(card);
        return;
      }
      if (!card) return;
      const media = n.matches('picture, img') ? n : n.querySelector('picture, img');
      if (media && !n.querySelector('em')) {
        const fig = document.createElement('figure');
        fig.append((media.closest('picture') || media).cloneNode(true));
        // heading renders above the image on live: keep order image-after-title
        card.append(fig);
        return;
      }
      const t = n.textContent.trim();
      if (!t) return;
      if (n.querySelector('em')) {
        const chips = document.createElement('p');
        chips.className = 'model-chips';
        [...n.childNodes].forEach((c) => chips.append(c.cloneNode(true)));
        card.append(chips);
        return;
      }
      if (/^(Druivenras|Levering|Prijs)\s*-/.test(t)) {
        let dl = card.querySelector('.model-attrs');
        if (!dl) {
          const wrap = document.createElement('div');
          wrap.className = 'model-attrs-wrap';
          const title = document.createElement('p');
          title.className = 'model-attrs-title';
          title.textContent = 'Smaakprofiel';
          const attrs = document.createElement('div');
          attrs.className = 'model-attrs';
          wrap.append(title, attrs);
          card.append(wrap);
          dl = attrs;
        }
        const [k, ...rest] = t.split('-');
        const cell = document.createElement('div');
        cell.className = 'model-attr';
        cell.innerHTML = `<strong>${k.trim()}</strong><span>${rest.join('-').trim()}</span>`;
        dl.append(cell);
        return;
      }
      if (n.matches('ul, ol')) {
        const ul = n.cloneNode(true);
        ul.className = 'model-list';
        card.append(ul);
        return;
      }
      const pText = document.createElement('p');
      [...n.childNodes].forEach((c) => pText.append(c.cloneNode(true)));
      card.append(pText);
    });
    // trailing buttonized CTA belongs to the PANEL (right-aligned), not a card
    (() => {
      const last = cards[cards.length - 1];
      if (!last) return;
      const cta = last.querySelector('p .button, p a.button');
      if (cta) {
        const pp = cta.closest('p');
        const row = document.createElement('div');
        row.className = 'tabs-cta';
        row.append(pp);
        panel.append(row);
      }
    })();
    ([]).forEach(() => {
    });
    cards.forEach((c) => grid.append(c));
    panel.append(grid);
    panels.append(panel);
  });

  block.replaceChildren(nav, panels);

  nav.querySelectorAll('li').forEach((li, i) => {
    li.addEventListener('click', () => {
      nav.querySelectorAll('li').forEach((x) => x.classList.remove('active'));
      li.classList.add('active');
      panels.querySelectorAll('.tabs-panel').forEach((pn, j) => {
        pn.style.display = i === j ? 'block' : 'none';
      });
    });
  });
}
