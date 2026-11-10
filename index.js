// Illustration viewer: opens an image on the same page
const box = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
let group = [];     // the images the viewer can move between
let current = 0;

// Show image i of the current group
function show(i) {
  current = (i + group.length) % group.length;   // wraps around at the ends
  const item = group[current];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  lbCaption.textContent = item.caption;

  // hide the arrows when there is only one image
  const many = group.length > 1;
  lbPrev.style.display = many ? '' : 'none';
  lbNext.style.display = many ? '' : 'none';

  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';       // stops the page scrolling behind it
}

function closeBox() {
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Chapters: the arrows only move within that chapter's own row
document.querySelectorAll('.chapter').forEach(ch => {
  ch.addEventListener('click', e => {
    e.preventDefault();
    const row = Array.from(ch.closest('.chapter-row').querySelectorAll('.chapter'));
    group = row.map(c => ({
      src: c.href,
      alt: c.querySelector('img').alt,
      caption: [
      c.querySelector('.chapter-name'),
      c.querySelector('.chapter-piece')
].map(el => el ? el.textContent : '').filter(Boolean).join(': ')
    }));
    show(row.indexOf(ch));
  });
});

// Single images (like the Halwa poster): no arrows, just the one image
document.querySelectorAll('.zoomable').forEach(img => {
  img.addEventListener('click', () => {
    group = [{ src: img.src, alt: img.alt, caption: img.dataset.caption || img.alt }];
    show(0);
  });
});

document.getElementById('lb-close').addEventListener('click', closeBox);
lbPrev.addEventListener('click', () => show(current - 1));
lbNext.addEventListener('click', () => show(current + 1));
box.addEventListener('click', e => { if (e.target === box) closeBox(); });

document.addEventListener('keydown', e => {
  if (!box.classList.contains('open')) return;
  if (e.key === 'Escape') closeBox();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// Arrow buttons for the chapter rows
(function () {
  document.querySelectorAll('.chapter-row').forEach(row => {
    // wrap the row and add two buttons
    const wrap = document.createElement('div');
    wrap.className = 'row-wrap';
    row.parentNode.insertBefore(wrap, row);
    wrap.appendChild(row);

    const prev = document.createElement('button');
    prev.className = 'row-arrow row-prev';
    prev.setAttribute('aria-label', 'Scroll left');
    prev.innerHTML = '&#8249;';

    const next = document.createElement('button');
    next.className = 'row-arrow row-next';
    next.setAttribute('aria-label', 'Scroll right');
    next.innerHTML = '&#8250;';

    wrap.append(prev, next);

    // scroll about one screenful of the row per click
    prev.addEventListener('click', () => row.scrollBy({ left: -row.clientWidth * 0.8 }));
    next.addEventListener('click', () => row.scrollBy({ left: row.clientWidth * 0.8 }));

    // show each arrow only when there is more to scroll that way,
    // and keep them level with the middle of the images
    function update() {
      const max = row.scrollWidth - row.clientWidth;
      prev.hidden = row.scrollLeft < 2;
      next.hidden = row.scrollLeft > max - 2;

      const img = row.querySelector('img');
      if (img && img.offsetHeight) {
        const top = img.offsetTop + img.offsetHeight / 2;
        prev.style.top = next.style.top = top + 'px';
      }
    }

    row.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    row.querySelectorAll('img').forEach(img => img.addEventListener('load', update));
    update();
  });
})();