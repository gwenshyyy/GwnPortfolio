/* =====================================================
   Works page
   1. Shuffle + category filters
   2. Click a work: it grows in its own place, with a 
      "view larger" button, and its title and description below
   3. View larger: the image full screen
   ===================================================== */

const grid = document.querySelector('.grid') || document.querySelector('.gallery');
const cards = document.querySelectorAll('.card');
const filterButtons = document.querySelectorAll('.filter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let openWork = null;   // the work that is currently expanded: { card, panel }


/* ---------- 1. Shuffle + filters ---------- */

// Shuffle: put the cards in a random order
function shuffleCards() {
  if (!grid) return;
  const list = Array.from(grid.children);
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  list.forEach((card) => grid.appendChild(card));
}

// Shuffle once when the page loads (it starts on "All")
shuffleCards();

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    collapseWork();   // close an open work before reshuffling or hiding cards

    filterButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    const wanted = button.dataset.filter;

    // reshuffle every time "All" is picked
    if (wanted === 'all') shuffleCards();

    cards.forEach((card) => {
      card.hidden = !(wanted === 'all' || card.dataset.category === wanted);
    });
  });
});

const wantedFilter = new URLSearchParams(location.search).get('filter');
if (wantedFilter) {
  const match = document.querySelector(`.filter[data-filter="${wantedFilter}"]`);
  if (match) match.click();
}

// Puts the text in, turning linkText into a clickable link
function fillDescription(el, text, link, linkText) {
  el.textContent = '';
  const start = link && linkText ? text.indexOf(linkText) : -1;

  // No link set, or the words weren't found: plain text
  if (start === -1) {
    el.textContent = text;
    return;
  }

  const a = document.createElement('a');
  a.href = link;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = linkText;

  el.append(
    text.slice(0, start),
    a,
    text.slice(start + linkText.length)
  );
}

/* ---------- 2. Expand a work in its own place ---------- */

function expandWork(card) {
  collapseWork();   // only one work is open at a time

  const art = card.querySelector('.art');
  const text = (card.dataset.desc || '').trim();
  const hasDescription = text !== '' && !/^describe the/i.test(text);   // hides the "Describe the piece." placeholders

  const panel = document.createElement('article');
  panel.className = 'work-open minimized-view';
  panel.innerHTML = `
    <div class="work-open-media">
      <img class="work-open-img" alt="" style="cursor: pointer;">
      <button class="work-open-zoom" type="button" aria-label="View larger">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
      </button>
    </div>
    <div class="work-open-info">
      <span class="work-open-category"></span>
      <h2 class="work-open-title"></h2>
      <p class="work-open-desc"></p>
    </div>
  `;

  // fill it with this work's details
  const image = panel.querySelector('.work-open-img');
  image.src = art.currentSrc || art.src;
  image.alt = art.alt;
  if (art.naturalWidth) {            // reserves the right space before the image paints
    image.width = art.naturalWidth;
    image.height = art.naturalHeight;
  }

  panel.querySelector('.work-open-category').textContent = card.dataset.category;
  panel.querySelector('.work-open-title').textContent = card.querySelector('.card-info h3').textContent.trim();

  const description = panel.querySelector('.work-open-desc');
  fillDescription(
    description,
    hasDescription ? text : '',
    card.dataset.link,
    card.dataset.linkText
  );
description.hidden = !hasDescription;

  // Bind the collapse/hide event directly to clicking the expanded image
  image.addEventListener('click', () => collapseWork({ scroll: true }));
  
  panel.querySelector('.work-open-zoom').addEventListener('click', (e) => {
    e.stopPropagation(); // Stops the image click listener from firing when clicking zoom button
    openLightbox(image.src, image.alt);
  });

  // Capture current layout bounds safely before modifying structures
  const first = card.getBoundingClientRect();
  
  // Temporarily disable global browser smooth scrolling engine values
  const htmlEl = document.documentElement;
  const originalScrollBehavior = htmlEl.style.scrollBehavior;
  htmlEl.style.scrollBehavior = 'auto';

  card.hidden = true;
  card.before(panel);
  openWork = { card, panel };

  window.requestAnimationFrame(() => {
    const last = panel.getBoundingClientRect();

    // Scale expanding animation layer
    if (!reduceMotion.matches && panel.animate) {
      panel.style.transformOrigin = '0 0';
      panel.animate(
        [
          {
            transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width})`,
            opacity: 0.5
          },
          { transform: 'none', opacity: 1 }
        ],
        { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
      );
    }

    // Scroll cleanly using exact, isolated offset computations
    const navOffset = 100; // Frosted navbar padding clearance offset
    const targetY = window.scrollY + last.top - navOffset;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });

    // Re-enable original scroll preferences safely
    setTimeout(() => {
      htmlEl.style.scrollBehavior = originalScrollBehavior;
    }, 350);
  });
}

function collapseWork({ scroll = false } = {}) {
  if (!openWork) return;

  const { card, panel } = openWork;
  openWork = null;
  panel.remove();
  card.hidden = false;

  if (scroll) {
    const htmlEl = document.documentElement;
    const originalScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    window.requestAnimationFrame(() => {
      const cardRect = card.getBoundingClientRect();
      const targetY = window.scrollY + cardRect.top - (window.innerHeight / 2) + (cardRect.height / 2);

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });

      setTimeout(() => {
        htmlEl.style.scrollBehavior = originalScrollBehavior;
        card.focus({ preventScroll: true });
      }, 350);
    });
  }
}

cards.forEach((card) => {
  card.addEventListener('click', () => expandWork(card));
});


/* ---------- 3. View larger ---------- */

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.hidden = true;
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
  <img alt="">
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('img');

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute('src');
  document.body.style.overflow = '';
}

// click anywhere to close
lightbox.addEventListener('click', closeLightbox);

// Escape closes the full-screen image first, then the open work
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  if (!lightbox.hidden) closeLightbox();
  else collapseWork({ scroll: true });
});



