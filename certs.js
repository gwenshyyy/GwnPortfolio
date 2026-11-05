// Edit this list. One line per certificate, oldest to newest.
const certificates = [
  { file: 'sKTrainingCompletion.jpg',  title: 'Certificate of Training Completion – SK Mandatory Training Program', date: 'Feb 15, 2023', source: 'SK Federation / DILG Ozamiz City' },
  { file: 'progressiveJournalist.jpg', title: 'Progressive Student Journalist Award – 1st Sem, AY 2024-2025',       date: 'Dec 18, 2024', source: 'LSU TINGOG Campus Press' },
  { file: 'secondHonors.jpg',          title: 'Second Honors – 2nd Sem, AY 2023-2024',                              date: 'Mar 26, 2025', source: 'La Salle University – Ozamiz' },
  { file: 'resourceSpeaker.jpg',       title: 'Certificate of Recognition – Resource Speaker, Editorial Cartooning', date: 'May 30, 2025', source: 'DepEd District 5 / Journalism Summer Training Camp' },
  { file: 'certforRecog.jpg',          title: 'Certificate of Recognition – Member, AY 2024-2025',                  date: 'Jul 19, 2025', source: 'LSU TINGOG Campus Press' },
  { file: 'freedomDefender.jpg',       title: 'Student Press Freedom Defender Award – AY 2024-2025',                date: 'Jul 19, 2025', source: 'LSU TINGOG Campus Press' },
  { file: 'graphicDesign3rd.jpg',      title: '3rd Place, Graphic Design – PAGHASA 2026 Seminar-Workshop',          date: 'Feb 16, 2026', source: 'LSU TINGOG Campus Press' },
  { file: 'certofRecognition.jpg',     title: 'Certificate of Recognition – Member, AY 2025-2026',                  date: 'Jun 12, 2026', source: 'LSU TINGOG Campus Press' },
  { file: 'certParti.jpg',             title: 'Certificate of Appreciation – Art Editor, AY 2025-2026',             date: 'Jun 12, 2026', source: 'LSU TINGOG Campus Press' },
  { file: 'creativeEditorMerit.jpg',   title: 'Creative Editor Merit Award – 2nd Sem, AY 2025-2026',                date: 'Jun 12, 2026', source: 'LSU TINGOG Campus Press' },
  { file: 'pressFreedomDefender.jpg',  title: 'Student Press Freedom Defender Award – AY 2025-2026',                date: 'Jun 12, 2026', source: 'LSU TINGOG Campus Press' },
  { file: 'pressMentorship.jpg',       title: 'Student Press Mentorship Award – 2nd Sem, AY 2025-2026',             date: 'Jun 12, 2026', source: 'LSU TINGOG Campus Press' }
];

const certGrid = document.getElementById('cert-grid');

if (certGrid) {

  // Build the cards
  certificates.forEach(function (c, i) {
    const src = 'Images/Certificates/' + c.file;
    const number = String(i + 1).padStart(2, '0');

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'cert-card';
    card.innerHTML =
      '<div class="cert-media"><img class="cert-img" loading="lazy" alt=""></div>' +
      '<div class="cert-body">' +
        '<div class="cert-meta"><span class="cert-date"></span><span class="cert-no">NO. ' + number + '</span></div>' +
        '<h3 class="cert-title"></h3>' +
        '<p class="cert-source"></p>' +
        '<div class="cert-preview"><span>Preview certificate</span>' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M14 10l6-6M15 4h5v5"/></svg>' +
        '</div>' +
      '</div>';

    const img = card.querySelector('.cert-img');
    img.alt = c.title;
    img.addEventListener('load', function () { img.classList.add('loaded'); });
    img.addEventListener('error', function () { img.classList.add('loaded'); });
    img.src = src;

    card.querySelector('.cert-date').textContent = c.date;
    card.querySelector('.cert-title').textContent = c.title;
    card.querySelector('.cert-source').textContent = c.source;

    card.addEventListener('click', function () { openCert(src, c.title); });
    certGrid.appendChild(card);
  });

  // Preview: full-screen image (uses the .lightbox style you already have)
  const certBox = document.createElement('div');
  certBox.className = 'lightbox';
  certBox.hidden = true;
  certBox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(certBox);

  const certBoxImg = certBox.querySelector('img');

  function openCert(src, alt) {
    certBoxImg.src = src;
    certBoxImg.alt = alt;
    certBox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCert() {
    certBox.hidden = true;
    certBoxImg.removeAttribute('src');
    document.body.style.overflow = '';
  }

  certBox.addEventListener('click', closeCert);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !certBox.hidden) closeCert();
  });
}