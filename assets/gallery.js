// Wild Focus gallery — filter + lightbox, zero dependencies.
(function () {
  const grid = document.getElementById('grid');
  const items = Array.from(grid.querySelectorAll('.item'));
  const filters = document.querySelectorAll('.filters button');

  // ---- masonry: derive each tile's grid row-span from its rendered height ----
  const GRID_ROW = 8, GRID_GAP = 14;
  function sizeItem(it) {
    if (it.classList.contains('hide')) { it.style.gridRowEnd = ''; return; }
    const img = it.querySelector('img');
    let h = img.getBoundingClientRect().height;
    if (!h && img.getAttribute('width')) h = it.clientWidth * (+img.getAttribute('height')) / (+img.getAttribute('width'));
    if (!h) return;
    it.style.gridRowEnd = 'span ' + Math.max(1, Math.round((h + GRID_GAP) / (GRID_ROW + GRID_GAP)));
  }
  function layoutMasonry() { items.forEach(sizeItem); }
  let rAF = null;
  window.addEventListener('resize', function () {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(layoutMasonry);
  });
  items.forEach(it => {
    const img = it.querySelector('img');
    if (!img.complete) img.addEventListener('load', () => sizeItem(it));
  });

  // ---- category filter ----
  const activeBtn = document.querySelector('.filters button.active') || filters[0];
  let current = activeBtn ? activeBtn.dataset.filter : 'wildlife';
  function applyFilter(cat) {
    items.forEach(it => it.classList.toggle('hide', !(cat === 'all' || it.dataset.cat === cat)));
  }
  applyFilter(current); // apply the default category on load
  layoutMasonry();
  filters.forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;   // same tab — ignore
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    current = btn.dataset.filter;
    grid.classList.add('switching');                 // fade grid out
    setTimeout(function () {
      applyFilter(current);                          // swap category while hidden
      layoutMasonry();                               // re-pack for the new set
      requestAnimationFrame(function () { grid.classList.remove('switching'); }); // fade back in
    }, 190);
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
