// Wild Focus gallery — filter + lightbox, zero dependencies.
(function () {
  const grid = document.getElementById('grid');
  const items = Array.from(grid.querySelectorAll('.item'));
  const filters = document.querySelectorAll('.filters button');

  // ---- category filter ----
  let current = 'all';
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    current = btn.dataset.filter;
    items.forEach(it => {
      const show = current === 'all' || it.dataset.cat === current;
      it.classList.toggle('hide', !show);
    });
  }));

  // visible items, in DOM order — drives prev/next
  const visible = () => items.filter(it => !it.classList.contains('hide'));

  // ---- lightbox ----
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCount = lb.querySelector('.lb-count');
  let idx = 0, list = [];

  function open(startItem) {
    list = visible();
    idx = list.indexOf(startItem);
    show();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function show() {
    const it = list[idx];
    if (!it) return;
    lbImg.src = it.querySelector('img').dataset.full;
    lbImg.alt = it.querySelector('img').alt;
    lbCount.textContent = (idx + 1) + ' / ' + list.length;
  }
  function step(d) { idx = (idx + d + list.length) % list.length; show(); }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  items.forEach(it => it.addEventListener('click', () => open(it)));
  lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); step(1); });
  lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
})();
