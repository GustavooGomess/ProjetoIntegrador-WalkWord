(function () {
  'use strict';

  var PRICE_MIN = 120;
  var PRICE_MAX = 2100;
  var PRICE_GAP = 50;
  var ITEMS_PER_PAGE = 6;

  var SORT_MODES = [
    { id: 'relevance', label: 'ORDENAR: RELEVÂNCIA ▾' },
    { id: 'price-asc', label: 'ORDENAR: MENOR PREÇO ↑' },
    { id: 'price-desc', label: 'ORDENAR: MAIOR PREÇO ↓' },
    { id: 'name-asc', label: 'ORDENAR: NOME A–Z' },
  ];

  var grid = document.getElementById('product-grid');
  var paginationEl = document.getElementById('pagination');
  var countEl = document.getElementById('products-count');
  var priceLabel = document.getElementById('price-range-label');
  var sliderTrack = document.getElementById('price-slider');
  var thumbMin = document.getElementById('thumb-min');
  var thumbMax = document.getElementById('thumb-max');
  var sliderFill = document.getElementById('slider-fill');
  var sortBtn = document.getElementById('sort-btn');
  var clearBtn = document.getElementById('clear-filters');
  var subtitleEl = document.getElementById('catalog-subtitle');

  var priceLow = PRICE_MIN;
  var priceHigh = PRICE_MAX;
  var sortIndex = 0;
  var currentPage = 1;
  var dragTarget = null;
  var searchQuery = '';
  // null = sem filtro de condição (mostra todos)
  var activeCondition = null;

  /* ===== Helpers ===== */
  function getCards() {
    return Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
  }

  function formatMoney(n) {
    return 'R$ ' + n.toLocaleString('pt-BR');
  }

  function updatePriceLabel() {
    priceLabel.textContent = formatMoney(priceLow) + ' — ' + formatMoney(priceHigh);
  }

  function priceToRatio(v) {
    return (v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN);
  }

  function updateSliderVisuals() {
    var rL = priceToRatio(priceLow);
    var rR = priceToRatio(priceHigh);
    thumbMin.style.left = rL * 100 + '%';
    thumbMax.style.left = rR * 100 + '%';
    sliderFill.style.left = rL * 100 + '%';
    sliderFill.style.width = Math.max(0, rR - rL) * 100 + '%';
    updatePriceLabel();
  }

  function ratioFromClientX(clientX) {
    var rect = sliderTrack.getBoundingClientRect();
    var x = clientX - rect.left;
    return Math.min(1, Math.max(0, x / rect.width));
  }

  function ratioToPrice(r) {
    var raw = PRICE_MIN + r * (PRICE_MAX - PRICE_MIN);
    return Math.round(raw / 10) * 10;
  }

  function onThumbPointerDown(which, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    dragTarget = which;
  }

  function onTrackPointerDown(ev) {
    if (ev.target !== sliderTrack && ev.target !== sliderFill) return;
    var r = ratioFromClientX(ev.clientX);
    var v = ratioToPrice(r);
    var mid = (priceLow + priceHigh) / 2;
    if (v < mid) {
      priceLow = Math.min(v, priceHigh - PRICE_GAP);
    } else {
      priceHigh = Math.max(v, priceLow + PRICE_GAP);
    }
    updateSliderVisuals();
    applyFilters();
  }

  function onPointerMove(ev) {
    if (!dragTarget) return;
    var v = ratioToPrice(ratioFromClientX(ev.clientX));
    if (dragTarget === 'min') {
      priceLow = Math.min(Math.max(PRICE_MIN, v), priceHigh - PRICE_GAP);
    } else {
      priceHigh = Math.max(Math.min(PRICE_MAX, v), priceLow + PRICE_GAP);
    }
    updateSliderVisuals();
    applyFilters();
  }

  function onPointerUp() {
    dragTarget = null;
  }

  /* ===== Filter Reads ===== */
  function getCheckedValues(name) {
    return Array.prototype.map.call(
      document.querySelectorAll('input[name="' + name + '"]:checked'),
      function (inp) { return inp.value; }
    );
  }

  function getSelectedSize() {
    var btn = document.querySelector('.size-btn.active[data-size]');
    return btn ? btn.getAttribute('data-size') : null;
  }

  /* ===== Card Matching ===== */
  function cardMatches(card) {
    if (searchQuery) {
      var title = ((card.querySelector('.product-title') || {}).textContent || '').toLowerCase();
      var brand = (card.getAttribute('data-brand') || '').toLowerCase();
      var type = (card.getAttribute('data-type') || '').toLowerCase();
      var q = searchQuery.toLowerCase();
      if (title.indexOf(q) === -1 && brand.indexOf(q) === -1 && type.indexOf(q) === -1) return false;
    }

    var cats = getCheckedValues('category');
    var cat = card.getAttribute('data-category');
    if (cats.length > 0 && cats.indexOf(cat) === -1) return false;

    var types = getCheckedValues('type');
    if (types.length > 0) {
      var cardType = card.getAttribute('data-type') || '';
      if (types.indexOf(cardType) === -1) return false;
    }

    // FIX: condição só filtra se activeCondition não for null
    if (activeCondition && card.getAttribute('data-condition') !== activeCondition) return false;

    var p = parseInt(card.getAttribute('data-price'), 10);
    if (p < priceLow || p > priceHigh) return false;

    var size = getSelectedSize();
    if (size) {
      var sizes = (card.getAttribute('data-sizes') || '').split(',').map(function (s) { return s.trim(); });
      if (sizes.indexOf(size) === -1) return false;
    }

    var brands = getCheckedValues('brand');
    if (brands.length > 0) {
      var b = card.getAttribute('data-brand');
      if (brands.indexOf(b) === -1) return false;
    }

    return true;
  }

  /* ===== Sorting ===== */
  function sortComparator(a, b) {
    var mode = SORT_MODES[sortIndex].id;
    if (mode === 'relevance') {
      return parseInt(a.getAttribute('data-order'), 10) - parseInt(b.getAttribute('data-order'), 10);
    }
    if (mode === 'price-asc') {
      return parseInt(a.getAttribute('data-price'), 10) - parseInt(b.getAttribute('data-price'), 10);
    }
    if (mode === 'price-desc') {
      return parseInt(b.getAttribute('data-price'), 10) - parseInt(a.getAttribute('data-price'), 10);
    }
    var ta = (a.querySelector('.product-title') || {}).textContent || '';
    var tb = (b.querySelector('.product-title') || {}).textContent || '';
    return ta.localeCompare(tb, undefined, { sensitivity: 'base' });
  }

  function reorderGrid(filteredSorted) {
    var hidden = getCards().filter(function (c) { return filteredSorted.indexOf(c) === -1; });
    filteredSorted.forEach(function (c) { grid.appendChild(c); });
    hidden.forEach(function (c) { grid.appendChild(c); });
  }

  /* ===== Pagination ===== */
  function renderPagination(totalPages) {
    paginationEl.innerHTML = '';
    if (totalPages <= 1) return;

    function addBtn(opts) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = opts.className;
      b.textContent = opts.text;
      if (opts.label) b.setAttribute('aria-label', opts.label);
      if (opts.disabled) b.disabled = true;
      if (opts.active) b.classList.add('active');
      if (opts.onClick) b.addEventListener('click', opts.onClick);
      paginationEl.appendChild(b);
    }

    addBtn({
      className: 'page-arrow', text: '⟨', label: 'Página anterior', disabled: currentPage <= 1,
      onClick: function () { if (currentPage > 1) { currentPage--; applyFilters(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    });

    var maxButtons = 5;
    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (var p = start; p <= end; p++) {
      (function (page) {
        addBtn({
          className: 'page-num', text: String(page), active: page === currentPage,
          onClick: function () { currentPage = page; applyFilters(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        });
      })(p);
    }

    if (end < totalPages) {
      var dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '...';
      paginationEl.appendChild(dots);
      addBtn({
        className: 'page-num', text: String(totalPages), active: currentPage === totalPages,
        onClick: function () { currentPage = totalPages; applyFilters(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
    }

    addBtn({
      className: 'page-arrow', text: '⟩', label: 'Próxima página', disabled: currentPage >= totalPages,
      onClick: function () { if (currentPage < totalPages) { currentPage++; applyFilters(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    });
  }

  /* ===== Apply Filters ===== */
  function applyFilters(resetPage) {
    if (resetPage !== false) currentPage = 1;

    var cards = getCards();
    var filtered = cards.filter(cardMatches);
    filtered.sort(sortComparator);
    reorderGrid(filtered);

    var totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var pageSlice = filtered.slice(start, start + ITEMS_PER_PAGE);

    cards.forEach(function (c) {
      var inFiltered = filtered.indexOf(c) !== -1;
      var inPage = pageSlice.indexOf(c) !== -1;
      if (!inFiltered || !inPage) {
        c.classList.add('is-hidden');
        c.setAttribute('aria-hidden', 'true');
      } else {
        c.classList.remove('is-hidden');
        c.removeAttribute('aria-hidden');
      }
    });

    countEl.textContent = String(filtered.length);

    var cats = getCheckedValues('category');
    if (cats.length === 1) {
      var catMap = { footwear: 'CALÇADOS', shirts: 'CAMISAS', blazers: 'BLAZERS', outerwear: 'CASACOS', accessories: 'ACESSÓRIOS' };
      if (subtitleEl) subtitleEl.textContent = 'COLEÇÃO — ' + (catMap[cats[0]] || cats[0].toUpperCase());
    } else {
      if (subtitleEl) subtitleEl.textContent = 'COLEÇÃO CURADA';
    }

    renderPagination(totalPages);
  }

  /* ===== Bind Filters ===== */
  function bindFilters() {
    document.querySelectorAll('input[name="category"], input[name="brand"], input[name="type"]').forEach(function (el) {
      el.addEventListener('change', function () { applyFilters(); });
    });

    // Condição funciona como toggle — clique no mesmo desativa o filtro
    document.querySelectorAll('.cond-pill[data-condition]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cond = btn.getAttribute('data-condition');
        if (activeCondition === cond) {
          activeCondition = null;
          document.querySelectorAll('.cond-pill[data-condition]').forEach(function (b) { b.classList.remove('active'); });
        } else {
          activeCondition = cond;
          document.querySelectorAll('.cond-pill[data-condition]').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
        }
        applyFilters();
      });
    });

    document.querySelectorAll('.size-btn[data-size]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
        } else {
          document.querySelectorAll('.size-btn[data-size]').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
        }
        applyFilters();
      });
    });
  }

  /* ===== Clear All ===== */
  function clearAll() {
    document.querySelectorAll('input[name="category"]').forEach(function (inp) {
      inp.checked = false;
    });
    document.querySelectorAll('input[name="brand"], input[name="type"]').forEach(function (inp) {
      inp.checked = false;
    });
    // Limpar filtros de condição
    activeCondition = null;
    document.querySelectorAll('.cond-pill[data-condition]').forEach(function (b) {
      b.classList.remove('active');
    });
    priceLow = PRICE_MIN;
    priceHigh = PRICE_MAX;
    updateSliderVisuals();

    document.querySelectorAll('.size-btn[data-size]').forEach(function (b) { b.classList.remove('active'); });
    sortIndex = 0;
    sortBtn.textContent = SORT_MODES[0].label;

    searchQuery = '';
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
    }

    applyFilters();
  }

  /* ===== Sort & View ===== */
  function bindSortAndView() {
    sortBtn.addEventListener('click', function () {
      sortIndex = (sortIndex + 1) % SORT_MODES.length;
      sortBtn.textContent = SORT_MODES[sortIndex].label;
      applyFilters();
    });

    document.querySelectorAll('.view-btn[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.view-btn[data-view]').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        var view = btn.getAttribute('data-view');
        grid.classList.toggle('product-grid--list', view === 'list');
      });
    });

    clearBtn.addEventListener('click', clearAll);
  }

  /* ===== Slider ===== */
  function bindSlider() {
    thumbMin.addEventListener('pointerdown', function (e) { onThumbPointerDown('min', e); });
    thumbMax.addEventListener('pointerdown', function (e) { onThumbPointerDown('max', e); });
    sliderTrack.addEventListener('pointerdown', onTrackPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  /* ===== Atelier Overlay & Menu Drawer ===== */
  function bindHeaderOverlays() {
    var atelierOverlay = document.getElementById('atelier-overlay');
    var atelierCloseBtn = document.getElementById('atelier-close-btn');
    var menuDrawer = document.getElementById('menu-drawer');
    var menuDrawerClose = document.getElementById('menu-drawer-close');
    var drawerBackdrop = document.getElementById('drawer-backdrop');

    document.querySelectorAll('.nav-atelier').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (atelierOverlay) {
          atelierOverlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (atelierCloseBtn) {
      atelierCloseBtn.addEventListener('click', function () {
        atelierOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    if (atelierOverlay) {
      atelierOverlay.addEventListener('click', function (e) {
        if (e.target === atelierOverlay) {
          atelierOverlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    document.querySelectorAll('.nav-menu-link').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (menuDrawer) {
          menuDrawer.classList.add('open');
          if (drawerBackdrop) drawerBackdrop.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeDrawer() {
      if (menuDrawer) menuDrawer.classList.remove('open');
      if (drawerBackdrop) drawerBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (menuDrawerClose) menuDrawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  }

  /* ===== URL Param Filter ===== */
  function applyUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    if (cat) {
      document.querySelectorAll('input[name="category"]').forEach(function (inp) {
        inp.checked = (inp.value === cat);
      });
    }

    var search = params.get('search');
    if (search) {
      searchQuery = search;
      var searchInput = document.getElementById('search-input');
      var searchBarContainer = document.getElementById('search-bar-container');
      if (searchInput) {
        searchInput.value = search;
      }
      if (searchBarContainer) {
        searchBarContainer.classList.add('open');
      }
    }
  }

  window.filterProducts = function (query) {
    searchQuery = query || '';
    applyFilters();
  };



  // catalogo.js — bindFavButtons — SUBSTITUIR COMPLETAMENTE por isso:
  function bindFavButtons() {
    document.querySelectorAll('.card-fav-btn').forEach(function (btn) {
      var product = btn.getAttribute('data-product');

      // Sincroniza estado inicial
      if (WalkWord.favorites.isFavorite(product)) {
        btn.classList.add('is-fav');
        var icon = btn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-heart';
      }

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var name = btn.getAttribute('data-product');
        var wasAdded = WalkWord.favorites.toggle(name); // true = adicionou, false = removeu
        var icon = btn.querySelector('i');

        if (wasAdded) {
          btn.classList.add('is-fav');
          if (icon) icon.className = 'fa-solid fa-heart';
          WalkWord.showToast('Adicionado aos favoritos!', 'success');
        } else {
          btn.classList.remove('is-fav');
          if (icon) icon.className = 'fa-regular fa-heart';
          WalkWord.showToast('Removido dos favoritos.', 'warning');
        }
      });
    });
  }











  /* ===== Card Click → Details ===== */
  function bindCardClicks() {
    getCards().forEach(function (card, i) {
      card.setAttribute('data-order', String(i));
      card.style.cursor = 'pointer';

      card.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.card-fav-btn')) return;

        var mainImage = card.dataset.image || '';

        var productData = {
          title: (card.querySelector('.product-title') || {}).textContent || '',
          price: parseFloat(card.getAttribute('data-price') || '0'),
          brand: card.getAttribute('data-brand') || '',
          sizes: card.getAttribute('data-sizes') || '',
          type: card.getAttribute('data-type') || '',
          category: card.getAttribute('data-category') || '',
          image: mainImage,
          condition: card.getAttribute('data-condition') || ''
        };

        sessionStorage.setItem('walkwordSelectedProduct', JSON.stringify(productData));
        window.location.href = '../teladetalhes/page.html';
      });
    });
  }

  /* ===== Init ===== */
  function init() {
    applyUrlParams();
    updateSliderVisuals();
    bindCardClicks();
    bindFilters();
    bindSortAndView();
    bindSlider();
    bindHeaderOverlays();
    bindFavButtons();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
