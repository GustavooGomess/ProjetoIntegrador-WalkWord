/* page.js — Product Detail with Smart Size Rendering */
'use strict';

/* ===== Load product from sessionStorage ===== */
var productData = null;
try {
  var raw = sessionStorage.getItem('walkwordSelectedProduct');
  if (raw) productData = JSON.parse(raw);
} catch(e) {}

// Default fallback product
if (!productData) {
  productData = {
    title: 'Structured Wool Blazer',
    price: 1800,
    brand: 'WALKWORD',
    sizes: 'P,M,G,GG',
    category: 'blazers',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
    condition: 'new'
  };
}

/* ===== Smart size resolver by category ===== */
function defaultSizesForCategory(category) {
  var cat = (category || '').toLowerCase();
  if (cat === 'footwear') return '38,39,40,41,42';
  if (cat === 'accessories') return 'U';
  return 'PP,P,M,G,GG';
}

/* ===== Format size label for display ===== */
function formatSizeLabel(size) {
  var s = size.trim();
  // Pure numeric → show only the number (no EU prefix)
  return s;
}

var mainProductImage = document.getElementById('main-product-image');
var addToCartBtn = document.getElementById('add-to-cart-btn');
var accordionHeaders = document.querySelectorAll('.accordion-header');
var productCards = document.querySelectorAll('.card_hero');
var selectedSize = '';

/* ===== Inject product data ===== */
function renderProduct() {
  if (!productData) return;

  var titleEl = document.querySelector('.info_div h1');
  if (titleEl) titleEl.textContent = productData.title || 'Produto';

  // Update price-row
  var priceMain = document.querySelector('.price-main');
  if (priceMain) priceMain.textContent = 'R$ ' + (productData.price || 0).toFixed(2).replace('.', ',');

  // Breadcrumb
  var bcCat = document.getElementById('breadcrumb-category');
  var bcProd = document.getElementById('breadcrumb-product');
  if (bcCat && productData.category) {
    var catMap = { footwear: 'Footwear', blazers: 'Blazers', shirts: 'Camisas', outerwear: 'Outerwear', accessories: 'Acessórios' };
    bcCat.textContent = catMap[productData.category] || productData.category;
    bcCat.href = '../telacatalogo/catalogo.html?cat=' + productData.category;
  }
  if (bcProd) bcProd.textContent = productData.title || 'Produto';

  // Legacy priceEl fallback (for add-to-cart price read)
  var priceEl = document.querySelector('.info_div h4');
  if (priceEl) priceEl.textContent = 'R$ ' + (productData.price || 0).toFixed(2).replace('.', ',');

  // Condition badges
  var condBadge = document.querySelector('.nav_semi');
  if (condBadge && productData.condition) {
    condBadge.textContent = productData.condition === 'new'
      ? 'NOVO — PEÇA ORIGINAL'
      : 'SEMINOVO — EXCELENTE ESTADO';
  }

  // Set main image
  var initialImg = productData.image || '';
  if (mainProductImage && initialImg) {
    mainProductImage.src = initialImg;
    mainProductImage.alt = productData.title || 'Produto';
  }

  renderSizes();
}

/* ===== Size Buttons ===== */
function renderSizes() {
  var sizeContainer = document.getElementById('size-options-container');
  if (!sizeContainer || !productData) return;
  sizeContainer.innerHTML = '';

  // Use product sizes if available; fallback based on category
  var rawSizes = productData.sizes && productData.sizes.trim()
    ? productData.sizes
    : defaultSizesForCategory(productData.category);

  var sizesArr = rawSizes.split(',')
    .map(function(s) { return s.trim(); })
    .filter(Boolean);

  // Special single-size (accessories = "U")
  if (sizesArr.length === 1 && sizesArr[0] === 'U') {
    var uLabel = document.createElement('span');
    uLabel.className = 'size-unique-label';
    uLabel.textContent = 'Tamanho único';
    sizeContainer.appendChild(uLabel);
    selectedSize = 'U';
    return;
  }

  sizesArr.forEach(function(size) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'size-btn';
    btn.textContent = formatSizeLabel(size);
    btn.setAttribute('data-size-value', size);
    btn.addEventListener('click', function() {
      sizeContainer.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      selectedSize = size;
    });
    sizeContainer.appendChild(btn);
  });
}

/* ===== Add to Cart ===== */
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', function() {
    if (!selectedSize) {
      addToCartBtn.value = 'Selecione um tamanho';
      addToCartBtn.classList.add('warning-state');
      addToCartBtn.style.background = '#b5202e';
      setTimeout(function() {
        addToCartBtn.value = 'Adicionar ao Carrinho';
        addToCartBtn.classList.remove('warning-state');
        addToCartBtn.style.background = '';
      }, 1400);
      return;
    }

    var titleEl = document.querySelector('.info_div h1');
    var priceEl = document.querySelector('.price-main');
    var priceStr = priceEl ? priceEl.textContent : '0';
    var price = parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    var displaySize = formatSizeLabel(selectedSize);

    if (window.WalkWord) {
      WalkWord.cart.add({
        name: titleEl ? titleEl.textContent : 'Produto',
        price: price,
        size: displaySize,
        image: mainProductImage ? mainProductImage.src : ''
      });
      WalkWord.showToast('Adicionado ao carrinho! (' + displaySize + ')', 'success');
    }

    addToCartBtn.value = '✓ Adicionado (' + displaySize + ')';
    addToCartBtn.classList.add('success-state');
    addToCartBtn.style.background = '#2d6a4f';
    setTimeout(function() {
      addToCartBtn.value = 'Adicionar ao Carrinho';
      addToCartBtn.classList.remove('success-state');
      addToCartBtn.style.background = '';
    }, 1800);
  });
}

/* ===== Love / Favorito ===== */
var loveBtn = document.querySelector('.love');
if (loveBtn) {
  loveBtn.style.cursor = 'pointer';
  loveBtn.addEventListener('click', function() {
    var titleEl = document.querySelector('.info_div h1');
    var title = titleEl ? titleEl.textContent : 'Produto';
    if (window.WalkWord) {
      var added = WalkWord.favorites.toggle(title);
      WalkWord.showToast(added ? 'Salvo na playlist de favoritos!' : 'Removido da playlist.', added ? 'success' : 'warning');
      var p = loveBtn.querySelector('p');
      if (p) p.textContent = added ? 'SALVO NA PLAYLIST' : 'SALVAR NA PLAYLIST';
    }
  });
}

/* ===== Accordion ===== */
accordionHeaders.forEach(function(header) {
  header.addEventListener('click', function() {
    var item = header.closest('.accordion-item');
    if (!item) return;
    item.classList.toggle('open');
    var icon = header.querySelector('.accordion-icon');
    if (icon) icon.textContent = item.classList.contains('open') ? '▲' : '▼';
  });
});

/* ===== Complete o Look cards — pass category for correct sizes ===== */
productCards.forEach(function(card) {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    var title = card.getAttribute('data-title') || (card.querySelector('h3') || {}).textContent || 'Produto';
    var priceAttr = card.getAttribute('data-price');
    var price = priceAttr ? parseFloat(priceAttr) : (parseFloat(((card.querySelector('p') || {}).textContent || '0').replace(/[^0-9.]/g, '')) || 0);
    var imgUrl = card.getAttribute('data-image') || (card.querySelector('img') ? card.querySelector('img').src : '');
    var category = card.getAttribute('data-category') || 'shirts';
    var sizes = card.getAttribute('data-sizes') || defaultSizesForCategory(category);

    sessionStorage.setItem('walkwordSelectedProduct', JSON.stringify({
      title: title,
      price: price,
      image: imgUrl,
      category: category,
      sizes: sizes,
      condition: 'new'
    }));
    window.location.href = 'page.html';
  });
});

/* ===== Search/filter for complete o look ===== */
function filterProducts(query) {
  productCards.forEach(function(card) {
    var title = ((card.querySelector('h3') || {}).textContent || '').toLowerCase();
    card.style.display = (!query || title.includes(query)) ? 'block' : 'none';
  });
}
window.filterProducts = filterProducts;

/* ===== Init ===== */
function initPageDetails() {
  if (productData) {
    renderProduct();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageDetails);
} else {
  initPageDetails();
}
