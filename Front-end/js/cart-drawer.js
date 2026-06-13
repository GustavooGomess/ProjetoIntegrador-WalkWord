(function () {
  'use strict';

  function openCartDrawer() {
    var drawer = document.getElementById('cart-drawer');
    var backdrop = document.getElementById('cart-backdrop');
    if (drawer) {
      renderCartDrawer();
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      var userMenu = document.getElementById('user-menu');
      var searchBar = document.getElementById('search-bar-container');
      if (userMenu) userMenu.classList.remove('open');
      if (searchBar) searchBar.classList.remove('open');
    }
  }

  function closeCartDrawer() {
    var drawer = document.getElementById('cart-drawer');
    var backdrop = document.getElementById('cart-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCartDrawer() {
    if (typeof WalkWord === 'undefined') return;
    var itemsContainer = document.getElementById('cart-drawer-items');
    var footer = document.getElementById('cart-drawer-footer');
    var emptyState = document.getElementById('cart-drawer-empty');
    var totalEl = document.getElementById('cart-drawer-total');
    if (!itemsContainer) return;
    var items = WalkWord.cart.getItems();
    itemsContainer.innerHTML = '';
    if (items.length === 0) {
      if (footer) footer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }
    if (footer) footer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    items.forEach(function (item, idx) {
      var div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML =
        '<div class="cart-item-img" style="background-image:url(\'' + (item.image || '') + '\')"></div>' +
        '<div class="cart-item-info">' +
        '<p class="cart-item-name">' + (item.name || 'Produto') + '</p>' +
        '<span class="cart-item-meta">Tam: ' + (item.size || '-') + (item.color ? ' · ' + item.color : '') + '</span>' +
        '<strong class="cart-item-price">R$ ' + (item.price || 0).toFixed(2).replace('.', ',') + '</strong>' +
        '</div>' +
        '<button class="cart-item-remove" data-idx="' + idx + '" aria-label="Remover item">&#x2715;</button>';
      itemsContainer.appendChild(div);
    });
    itemsContainer.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var i = parseInt(btn.getAttribute('data-idx'), 10);
        WalkWord.cart.remove(i);
        WalkWord.showToast('Item removido do carrinho.', 'warning');
        renderCartDrawer();
      });
    });
    var subtotal = WalkWord.cart.getSubtotal();
    if (totalEl) totalEl.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
  }

  function bindCartBtn() {
    var cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        var drawer = document.getElementById('cart-drawer');
        if (!drawer) {
          if (typeof WalkWord !== 'undefined' && WalkWord.cart.getCount() > 0) {
            window.location.href = WalkWord._resolveRelPath('Pagamentos/pagamento.html');
          } else if (typeof WalkWord !== 'undefined') {
            WalkWord.showToast('Seu carrinho está vazio. Explore o catálogo!', 'warning');
          }
          return;
        }
        if (drawer.classList.contains('open')) {
          closeCartDrawer();
        } else {
          openCartDrawer();
        }
      }, true);
    }
  }

  function bindCloseBtn() {
    var closeBtn = document.getElementById('cart-drawer-close');
    var backdrop = document.getElementById('cart-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (backdrop) backdrop.addEventListener('click', closeCartDrawer);
  }

  /* ========== INIT ========== */
  function init() {
    bindCartBtn();
    bindCloseBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();