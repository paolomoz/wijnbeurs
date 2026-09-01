import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — wijnbeurs.nl chrome (template-slotted replica).
 *
 * /footer fragment contract (sections, in order):
 *   1. USP bar — <ul> (icon img optional, <em> = green accent)
 *   2..6. link columns — <h3><a>Title</a></h3> + <ul> links
 *   7. payment icons — <ul> of images
 *   8. social links — <ul> of image links
 *   9. legal menu — <ul> of links
 *   10. recaptcha note — <p> (mobile-only on live)
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const take = (i) => sections[i] || null;

  const root = document.createElement('div');
  root.className = 'wb-footer';

  // 1. usp bar (white variant)
  const usp = take(0)?.querySelector('ul');
  if (usp) {
    const bar = document.createElement('div');
    bar.className = 'footer-usp';
    const ul = document.createElement('ul');
    ul.className = 'usp-list';
    [...usp.children].forEach((li) => {
      const item = document.createElement('li');
      item.className = 'usp-item';
      const text = document.createElement('span');
      text.className = 'usp-text';
      [...li.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE && n.matches('picture, img')) item.append(n.cloneNode(true));
        else text.append(n.cloneNode(true));
      });
      item.append(text);
      ul.append(item);
    });
    bar.append(ul);
    root.append(bar);
  }

  // 2..6. dark menu columns
  const dark = document.createElement('div');
  dark.className = 'footer-dark';
  const menus = document.createElement('div');
  menus.className = 'footer-menus';
  const inner = document.createElement('div');
  inner.className = 'footer-menus-inner';
  for (let i = 1; i <= 5; i += 1) {
    const sec = take(i);
    if (!sec) break;
    const col = document.createElement('div');
    col.className = 'footer-col';
    const heading = sec.querySelector('h1, h2, h3, h4');
    if (heading) {
      const title = document.createElement('div');
      title.className = 'footer-title';
      [...heading.childNodes].forEach((n) => title.append(n.cloneNode(true)));
      col.append(title);
    }
    const list = sec.querySelector('ul');
    if (list) {
      const ul = list.cloneNode(true);
      ul.className = 'footer-links';
      col.append(ul);
    }
    inner.append(col);
  }
  menus.append(inner);
  dark.append(menus);
  root.append(dark);

  // 7..10. bottom strip
  const bottomWrap = document.createElement('div');
  bottomWrap.className = 'footer-bottom-wrap';
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const addList = (idx, cls) => {
    const list = take(idx)?.querySelector('ul');
    if (!list) return;
    const div = document.createElement('div');
    div.className = cls;
    div.append(list.cloneNode(true));
    bottom.append(div);
  };
  addList(6, 'footer-pay');
  addList(7, 'footer-social');
  addList(8, 'footer-legal');
  const note = take(9)?.querySelector('p');
  if (note) {
    const p = document.createElement('p');
    p.className = 'recaptcha-note';
    [...note.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    bottom.append(p);
  }
  bottomWrap.append(bottom);
  root.append(bottomWrap);

  // mobile accordion (live tap-to-expand parity)
  root.querySelectorAll('.footer-col .footer-title').forEach((t) => {
    t.addEventListener('click', (e) => {
      if (window.innerWidth > 767) return;
      e.preventDefault();
      t.closest('.footer-col').classList.toggle('open');
    });
  });

  block.replaceChildren(root);
}
