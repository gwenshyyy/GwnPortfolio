const grid = document.querySelector('.grid');
const cards = document.querySelectorAll('.grid .card');
const filters = document.querySelectorAll('.filter');
const modal = document.getElementById('modal');

// Shuffle: put the cards in a random order
function shuffleCards() {
  const list = Array.from(grid.children);
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  list.forEach(card => grid.appendChild(card));
}

// Shuffle once when the page loads (it starts on "All")
shuffleCards();

// Filter buttons: show only cards that match the clicked category
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const chosen = btn.dataset.filter;

    // Reshuffle every time "All" is picked
    if (chosen === 'all') shuffleCards();

    cards.forEach(card => {
      card.hidden = !(chosen === 'all' || card.dataset.category === chosen);
    });
  });
});

// Click a card: fill the popup with that card's info, then show it
cards.forEach(card => {
  card.addEventListener('click', () => {
    const art = document.getElementById('modal-art');
    art.innerHTML = '';
    art.appendChild(card.querySelector('.art').cloneNode(true));

    document.getElementById('modal-title').textContent = card.dataset.title;
    document.getElementById('modal-category').textContent = card.dataset.category;
    document.getElementById('modal-desc').textContent = card.dataset.desc;

    modal.classList.add('open');
  });
});

// Close the popup: X button, click outside the box, or Escape key
function closeModal() { modal.classList.remove('open'); }
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });