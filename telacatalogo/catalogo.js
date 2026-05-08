(function () {
  'use strict';

  var PRICE_MIN = 120;
  var PRICE_MAX = 850;
  var PRICE_GAP = 25;
  var ITEMS_PER_PAGE = 3;

  var SORT_MODES = [
    { id: 'relevance', label: 'SORT: RELEVANCE ▾' },
    { id: 'price-asc', label: 'SORT: PRICE ↑' },
    { id: 'price-desc', label: 'SORT: PRICE ↓' },
    { id: 'name-asc', label: 'SORT: NAME A–Z' },
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

  var priceLow = PRICE_MIN;
  var priceHigh = PRICE_MAX;
  var sortIndex = 0;
  var currentPage = 1;
  var dragTarget = null;

  function getCards() {
    return Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
  }

  function formatMoney(n) {
    return '$' + n;
  }

  function updatePriceLabel() {
    priceLabel.textContent =
      formatMoney(priceLow) + ' — ' + formatMoney(priceHigh);
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
    return Math.round(raw / 5) * 5;
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

  function getCheckedValues(name) {
    return Array.prototype.map.call(
      document.querySelectorAll('input[name="' + name + '"]:checked'),
      function (inp) {
        return inp.value;
      }
    );
  }

  function getSelectedCondition() {
    var active = document.querySelector('.pill.active[data-condition]');
    return active ? active.getAttribute('data-condition') : null;
  }

  function getSelectedSize() {
    var btn = document.querySelector('.size-btn.active[data-size]');
    return btn ? btn.getAttribute('data-size') : null;
  }

  function getActiveColors() {
    return Array.prototype.map.call(
      document.querySelectorAll('.color-swatch.active[data-color]'),
      function (el) {
        return el.getAttribute('data-color');
      }
    );
  }

  function cardMatches(card) {
    var cats = getCheckedValues('category');
    var cat = card.getAttribute('data-category');
    if (cats.length > 0 && cats.indexOf(cat) === -1) return false;

    var cond = getSelectedCondition();
    if (cond && card.getAttribute('data-condition') !== cond) return false;

    var p = parseInt(card.getAttribute('data-price'), 10);
    if (p < priceLow || p > priceHigh) return false;

    var colors = getActiveColors();
    if (colors.length > 0) {
      var cardColors = (card.getAttribute('data-colors') || '')
        .split(',')
        .map(function (c) {
          return c.trim();
        });
      var hit = colors.some(function (c) {
        return cardColors.indexOf(c) !== -1;
      });
      if (!hit) return false;
    }

    var size = getSelectedSize();
    if (size) {
      var sizes = (card.getAttribute('data-sizes') || '')
        .split(',')
        .map(function (s) {
          return s.trim();
        });
      if (sizes.indexOf(size) === -1) return false;
    }

    var brands = getCheckedValues('brand');
    if (brands.length > 0) {
      var b = card.getAttribute('data-brand');
      if (brands.indexOf(b) === -1) return false;
    }

    return true;
  }

  function sortComparator(a, b) {
    var mode = SORT_MODES[sortIndex].id;
    if (mode === 'relevance') {
      return (
        parseInt(a.getAttribute('data-order'), 10) -
        parseInt(b.getAttribute('data-order'), 10)
      );
    }
    if (mode === 'price-asc') {
      return (
        parseInt(a.getAttribute('data-price'), 10) -
        parseInt(b.getAttribute('data-price'), 10)
      );
    }
    if (mode === 'price-desc') {
      return (
        parseInt(b.getAttribute('data-price'), 10) -
        parseInt(a.getAttribute('data-price'), 10)
      );
    }
    var ta = (a.querySelector('.product-title') || {}).textContent || '';
    var tb = (b.querySelector('.product-title') || {}).textContent || '';
    return ta.localeCompare(tb, undefined, { sensitivity: 'base' });
  }

  function reorderGrid(filteredSorted) {
    var hidden = getCards().filter(function (c) {
      return filteredSorted.indexOf(c) === -1;
    });
    filteredSorted.forEach(function (c) {
      grid.appendChild(c);
    });
    hidden.forEach(function (c) {
      grid.appendChild(c);
    });
  }

  function renderPagination(totalPages) {
    paginationEl.innerHTML = '';
    if (totalPages < 1) totalPages = 1;

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
      className: 'page-arrow',
      text: '⟨',
      label: 'Previous page',
      disabled: currentPage <= 1,
      onClick: function () {
        if (currentPage > 1) {
          currentPage--;
          applyFilters(false);
        }
      },
    });

    var maxButtons = 5;
    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (var p = start; p <= end; p++) {
      (function (page) {
        addBtn({
          className: 'page-num',
          text: String(page),
          active: page === currentPage,
          onClick: function () {
            currentPage = page;
            applyFilters(false);
          },
        });
      })(p);
    }

    if (end < totalPages) {
      var dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '...';
      paginationEl.appendChild(dots);
      addBtn({
        className: 'page-num',
        text: String(totalPages),
        active: currentPage === totalPages,
        onClick: function () {
          currentPage = totalPages;
          applyFilters(false);
        },
      });
    }

    addBtn({
      className: 'page-arrow',
      text: '⟩',
      label: 'Next page',
      disabled: currentPage >= totalPages,
      onClick: function () {
        if (currentPage < totalPages) {
          currentPage++;
          applyFilters(false);
        }
      },
    });
  }

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
      if (filtered.indexOf(c) === -1) {
        c.classList.add('is-hidden');
        c.setAttribute('aria-hidden', 'true');
      } else if (pageSlice.indexOf(c) === -1) {
        c.classList.add('is-hidden');
        c.setAttribute('aria-hidden', 'true');
      } else {
        c.classList.remove('is-hidden');
        c.removeAttribute('aria-hidden');
      }
    });

    countEl.textContent = String(filtered.length);
    renderPagination(totalPages);
  }

  function bindFilters() {
    document.querySelectorAll('input[name="category"], input[name="brand"]').forEach(function (el) {
      el.addEventListener('change', function () {
        applyFilters();
      });
    });

    document.querySelectorAll('.pill[data-condition]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pill[data-condition]').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        applyFilters();
      });
    });

    document.querySelectorAll('.color-swatch[data-color]').forEach(function (sw) {
      sw.addEventListener('click', function () {
        sw.classList.toggle('active');
        applyFilters();
      });
    });

    document.querySelectorAll('.size-btn[data-size]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.size-btn[data-size]').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        applyFilters();
      });
    });
  }

  function clearAll() {
    document.querySelectorAll('input[name="category"]').forEach(function (inp) {
      inp.checked = inp.value === 'footwear';
    });
    document.querySelectorAll('input[name="brand"]').forEach(function (inp) {
      inp.checked = false;
    });

    document.querySelectorAll('.pill[data-condition]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-condition') === 'new');
    });

    priceLow = PRICE_MIN;
    priceHigh = PRICE_MAX;
    updateSliderVisuals();

    document.querySelectorAll('.color-swatch[data-color]').forEach(function (s) {
      s.classList.remove('active');
    });

    document.querySelectorAll('.size-btn[data-size]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-size') === '39');
    });

    sortIndex = 0;
    sortBtn.textContent = SORT_MODES[0].label;

    applyFilters();
  }

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

  function bindSlider() {
    thumbMin.addEventListener('pointerdown', function (e) {
      onThumbPointerDown('min', e);
    });
    thumbMax.addEventListener('pointerdown', function (e) {
      onThumbPointerDown('max', e);
    });
    sliderTrack.addEventListener('pointerdown', onTrackPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function init() {
    getCards().forEach(function (card, i) {
      card.setAttribute('data-order', String(i));
    });
    updateSliderVisuals();
    bindFilters();
    bindSortAndView();
    bindSlider();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }})