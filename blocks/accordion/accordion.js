/**
 * accordion — FAQ (Block Collection shape; reconstructive;
 * schema: stardust/eds-schema/wijnabonnement.json § faq).
 * Section head (h2) is DEFAULT CONTENT before the block.
 *
 * Authoring rows: one per Q/A — cells: question | answer.
 * Closed by default; toggles on click (live parity: display none/block).
 */
export default async function decorate(block) {
  const inner = document.createElement('div');
  inner.className = 'faq-inner';
  [...block.children].forEach((row) => {
    const [qCell, aCell] = [...row.children];
    if (!qCell) return;
    const item = document.createElement('div');
    item.className = 'faq-item';
    const q = document.createElement('div');
    q.className = 'faq-q';
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.setAttribute('aria-expanded', 'false');
    q.textContent = qCell.textContent.trim();
    const a = document.createElement('div');
    a.className = 'faq-a';
    if (aCell) [...aCell.childNodes].forEach((n) => a.append(n.cloneNode(true)));
    const toggle = () => {
      const open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
    };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    item.append(q, a);
    inner.append(item);
  });
  const wrap = document.createElement('div');
  wrap.className = 'wrap faq-wrap';
  wrap.append(inner);
  block.replaceChildren(wrap);
}
