import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — wijnbeurs.nl chrome (template-slotted replica).
 * Geometry: sites/wijnbeurs-nl/stardust/prototypes/canon.css (lifted values).
 *
 * /nav fragment contract (3 sections):
 *   1. brand — logo link + two images (full logo, compact sticky logo)
 *   2. sections — TWO <ul>s of nav links (first = left group, second = right)
 *   3. tools — <ul> USP bar items (icon img optional, <em> = green accent)
 *
 * Sticky morph mirrors live: body.is-stuck past 300px scroll shows the
 * condensed fixed bar (75px desktop / 56px mobile); flow height is preserved
 * by the fixed header reservation in styles.css.
 */

const SVG = {
  ham: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 6h18M3 12h18M3 18h18" stroke="#555" stroke-width="2"/></svg>',
  search: '<svg class="search-ico" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="#555" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="#555" stroke-width="2"/></svg>',
  account: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#555" stroke-width="1.8"/><path d="M4.5 20c1.5-3.6 4.4-5.2 7.5-5.2s6 1.6 7.5 5.2" stroke="#555" stroke-width="1.8"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16l-1.5 12h-13L4 7Z" stroke="#555" stroke-width="1.8"/><path d="M8.5 10V5.8A3.4 3.4 0 0 1 12 2.5a3.4 3.4 0 0 1 3.5 3.3V10" stroke="#555" stroke-width="1.8"/></svg>',
};

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function buildUspBar(toolsSec, extraClass) {
  const list = toolsSec?.querySelector('ul');
  if (!list) return null;
  const bar = el('div', `usp-bar ${extraClass || ''}`);
  const ul = el('ul', 'usp-list');
  [...list.children].forEach((li) => {
    const item = el('li', 'usp-item');
    const text = el('span', 'usp-text');
    [...li.childNodes].forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && n.matches('picture, img')) item.append(n.cloneNode(true));
      else text.append(n.cloneNode(true));
    });
    item.append(text);
    ul.append(item);
  });
  bar.append(ul);
  return bar;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const [brandSec, linksSec, toolsSec] = [...fragment.querySelectorAll(':scope > .section')];

  const root = el('div', 'wb-header');

  // usp bar
  const usp = buildUspBar(toolsSec);
  if (usp) root.append(usp);

  // brand images: [0] full logo, [1] compact sticky logo
  const brandImgs = [...(brandSec?.querySelectorAll('picture, img') || [])]
    .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture'));
  const brandHref = brandSec?.querySelector('a')?.href || '/';

  // header main
  const main = el('div', 'header-main');
  const burger = el('button', 'nav-toggle', SVG.ham);
  burger.setAttribute('aria-label', 'Menu');
  const logo = el('a', 'header-logo');
  logo.href = brandHref;
  if (brandImgs[0]) logo.append(brandImgs[0].cloneNode(true));
  const search = el('div', 'header-search', `${SVG.search}<input class="input-text" type="text" placeholder="Zoek een wijn, land of gelegenheid">`);
  const right = el('div', 'header-right', `
    <a class="header-link" href="https://www.wijnbeurs.nl/customer/account/">${SVG.account}<span>Mijn account</span></a>
    <a class="header-link" href="https://www.wijnbeurs.nl/checkout/cart/">${SVG.cart}<span>Mijn winkelwagen</span></a>`);
  main.append(burger, logo, search, right);
  root.append(main);

  // nav bar: two authored lists → left/right groups
  const lists = [...(linksSec?.querySelectorAll('ul') || [])];
  const navBar = el('div', 'nav-bar');
  const navInner = el('div', 'nav-inner');
  const navRow = el('div', 'nav-row');
  const linkOf = (li) => li.querySelector(':scope > a, :scope > p > a');
  lists.forEach((list, i) => {
    const ul = el('ul', `nav-list ${i === 0 ? 'nav-left' : 'nav-right'}`);
    [...list.querySelectorAll(':scope > li')].forEach((li) => {
      const a = linkOf(li);
      if (!a) return;
      const item = el('li');
      const link = el('a', 'nav-link', `<span>${a.textContent.trim()}</span>`);
      link.href = a.href;
      item.append(link);
      ul.append(item);
    });
    navRow.append(ul);
  });
  navInner.append(navRow);
  navBar.append(navInner);
  root.append(navBar);

  // sticky condensed bar
  const sticky = el('div', 'sticky-bar');
  sticky.setAttribute('aria-hidden', 'true');
  const stickyInner = el('div', 'sticky-bar-inner');
  stickyInner.innerHTML = `<span class="s-ham">${SVG.ham}</span>`;
  const sLogo = el('a', 's-logo');
  sLogo.href = brandHref;
  if (brandImgs[1] || brandImgs[0]) sLogo.append((brandImgs[1] || brandImgs[0]).cloneNode(true));
  const sNav = el('nav', 's-nav');
  lists.forEach((list, i) => {
    if (i === 1) sNav.append(el('span', 's-gap'));
    [...list.querySelectorAll(':scope > li')].forEach((li) => {
      const a = linkOf(li);
      if (!a) return;
      const link = el('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      sNav.append(link);
    });
  });
  const sSearch = el('div', 's-search', `${SVG.search}<input type="text">`);
  const sIcons = el('div', 's-icons', SVG.account + SVG.cart);
  stickyInner.append(sLogo, sNav, sSearch, sIcons);
  sticky.append(stickyInner);
  root.append(sticky);

  block.replaceChildren(root);

  // sticky morph (lifted threshold: engages past the header block)
  const onScroll = () => {
    document.body.classList.toggle('is-stuck', window.scrollY > 300);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // fixed chat bubble (live: Dixa toggler — replicated as decorative chrome)
  if (!document.querySelector('.chat-toggler')) {
    const chat = el('div', 'chat-toggler', '<svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.4c-.5.4-1.3 0-1.3-.7V5.5Z" fill="#fff"/></svg>');
    chat.setAttribute('aria-hidden', 'true');
    document.body.append(chat);
  }
}
