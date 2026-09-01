/**
 * plans — subscription cards on the cream band (reconstructive;
 * schema: stardust/eds-schema/wijnabonnement.json § subs).
 * Section head (h2) is DEFAULT CONTENT before the block.
 *
 * Authoring rows: one per plan, ONE cell holding flat siblings:
 *   [optional <p><em>ribbon label</em></p> → featured variant (maroon frame + ribbon)]
 *   <h3> plan name · intro <p> · <ul> checks · CTA (<strong><a>, buttonized)
 */
export default async function decorate(block) {
  const ribbonRow = document.createElement('div');
  ribbonRow.className = 'subs-ribbon-row';
  const cards = document.createElement('div');
  cards.className = 'subs-cards';

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const nodes = [...cell.children];

    const card = document.createElement('div');
    card.className = 'subs-card';
    let ribbonLabel = null;

    nodes.forEach((n) => {
      if (n.matches('p') && n.querySelector('em') && n.textContent.trim().length < 40 && !n.querySelector('a')) {
        ribbonLabel = n.textContent.trim();
        return;
      }
      if (n.matches('h1, h2, h3, h4')) {
        const h3 = document.createElement('h3');
        [...n.childNodes].forEach((c) => h3.append(c.cloneNode(true)));
        card.append(h3);
        return;
      }
      if (n.matches('ul, ol')) {
        const checksWrap = document.createElement('div');
        checksWrap.className = 'subs-checks';
        [...n.querySelectorAll('li')].forEach((li) => {
          const p = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = '✓';
          p.append(strong, ' ');
          [...li.childNodes].forEach((c) => p.append(c.cloneNode(true)));
          checksWrap.append(p);
        });
        card.append(checksWrap);
        return;
      }
      if (n.querySelector('a')) {
        const ctaRow = document.createElement('p');
        ctaRow.className = 'button-wrapper subs-cta';
        const a = n.querySelector('a').cloneNode(true);
        if (!a.classList.contains('button')) a.classList.add('button', 'primary');
        ctaRow.append(a);
        card.append(ctaRow);
        return;
      }
      if (n.textContent.trim()) {
        const desc = document.createElement('div');
        desc.className = 'card-desc';
        const p = document.createElement('p');
        [...n.childNodes].forEach((c) => p.append(c.cloneNode(true)));
        desc.append(p);
        card.append(desc);
      }
    });

    const slot = document.createElement('div');
    slot.className = 'subs-slot';
    if (ribbonLabel) {
      card.classList.add('subs-card--fav');
      const ribbon = document.createElement('div');
      ribbon.className = 'subs-ribbon';
      ribbon.innerHTML = `<p>${ribbonLabel}</p>`;
      slot.append(ribbon);
    }
    slot.append(card);
    cards.append(slot);
  });

  const inner = document.createElement('div');
  inner.className = 'subs-inner';
  inner.append(cards);
  const wrap = document.createElement('div');
  wrap.className = 'wrap subs-wrap';
  wrap.append(inner);
  block.replaceChildren(wrap);
}
