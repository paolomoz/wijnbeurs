/**
 * steps — "In 4 stappen" icon columns (reconstructive;
 * schema: stardust/eds-schema/wijnabonnement.json § steps).
 * Section head (h2) is DEFAULT CONTENT before the block, styled in place.
 *
 * Authoring rows: one per step — cells: icon image | title | description
 */
export default async function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'steps-grid';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const pic = row.querySelector('picture, img');
    const texts = cells.filter((c) => !c.querySelector('picture, img') && c.textContent.trim());
    const [titleCell, descCell] = texts;
    const col = document.createElement('div');
    col.className = 'steps-col';
    if (pic) {
      const fig = document.createElement('figure');
      const iconWrap = document.createElement('div');
      iconWrap.className = 'icon-wrap';
      iconWrap.append((pic.closest('picture') || pic).cloneNode(true));
      fig.append(iconWrap);
      col.append(fig);
    }
    if (titleCell) {
      const h3 = document.createElement('h3');
      const inner = titleCell.querySelector('h1, h2, h3, h4') || titleCell;
      [...inner.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      col.append(h3);
    }
    if (descCell) {
      const p = document.createElement('p');
      p.className = 'steps-cap';
      p.textContent = descCell.textContent.trim();
      col.append(p);
    }
    grid.append(col);
  });
  const wrap = document.createElement('div');
  wrap.className = 'wrap steps-wrap';
  wrap.append(grid);
  block.replaceChildren(wrap);
}
