(function () {
  'use strict';

  var searchToggleBtn = document.getElementById('search-toggle-btn');
  var searchBarContainer = document.getElementById('search-bar-container');
  var searchInput = document.getElementById('search-input');
  var cartBtn = document.getElementById('cart-btn');
  var cartCount = document.getElementById('cart-count');
  var userBtn = document.getElementById('user-btn');
  var userMenu = document.getElementById('user-menu');
  var menuOrdersLink = document.getElementById('menu-orders-link');
  var menuFavoritesLink = document.getElementById('menu-favorites-link');

  function productNameForFavorites() {
    var fromBody = document.body && document.body.getAttribute('data-product-name');
    if (fromBody && fromBody.trim()) return fromBody.trim();
    var details = document.querySelector('.info_div h1');
    if (details && details.textContent) return details.textContent.trim();
    return 'Produto';
  }

  var productName = productNameForFavorites();
  var favorites = JSON.parse(localStorage.getItem('walkwordFavorites') || '[]');

  function runSearchFilter(query) {
    if (typeof window.filterProducts === 'function') {
      window.filterProducts(query);
    }
  }

  function updateFavoritesLabel() {
    if (!menuFavoritesLink) return;
    var isFavorite = favorites.indexOf(productName) !== -1;
    menuFavoritesLink.textContent = isFavorite ? 'Favoritos (salvo)' : 'Favoritos';
  }

  function showHeaderFeedback(message) {
    var existingFeedback = document.querySelector('.header-feedback');
    if (existingFeedback) existingFeedback.remove();

    var feedback = document.createElement('div');
    feedback.className = 'header-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(function () {
      feedback.classList.add('visible');
    }, 20);
    setTimeout(function () {
      feedback.classList.remove('visible');
      setTimeout(function () {
        feedback.remove();
      }, 250);
    }, 1800);
  }

  updateFavoritesLabel();

  searchToggleBtn &&
    searchToggleBtn.addEventListener('click', function () {
      if (!searchBarContainer) return;
      searchBarContainer.classList.toggle('open');
      if (userMenu) userMenu.classList.remove('open');
      if (searchBarContainer.classList.contains('open')) {
        searchInput && searchInput.focus();
      } else if (searchInput) {
        searchInput.value = '';
        runSearchFilter('');
      }
    });

  searchInput &&
    searchInput.addEventListener('input', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      runSearchFilter(target.value.trim().toLowerCase());
    });

  cartBtn &&
    cartBtn.addEventListener('click', function () {
      if (userMenu) userMenu.classList.remove('open');
      if (searchBarContainer) searchBarContainer.classList.remove('open');
      if (searchInput) searchInput.value = '';
      runSearchFilter('');

      var addToCartBtn = document.getElementById('add-to-cart-btn');
      if (addToCartBtn) {
        addToCartBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addToCartBtn.classList.add('cart-highlight');
        setTimeout(function () {
          addToCartBtn.classList.remove('cart-highlight');
        }, 1100);
      }
    });

  userBtn &&
    userBtn.addEventListener('click', function () {
      if (!userMenu) return;
      userMenu.classList.toggle('open');
      if (searchBarContainer) searchBarContainer.classList.remove('open');
    });

  menuOrdersLink &&
    menuOrdersLink.addEventListener('click', function (event) {
      event.preventDefault();
      if (userMenu) userMenu.classList.remove('open');
      showHeaderFeedback('Area de pedidos em desenvolvimento.');
      var other = document.querySelector('.other_products');
      if (other) other.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

  menuFavoritesLink &&
    menuFavoritesLink.addEventListener('click', function (event) {
      event.preventDefault();
      var alreadyFavorite = favorites.indexOf(productName) !== -1;
      favorites = alreadyFavorite
        ? favorites.filter(function (item) {
            return item !== productName;
          })
        : favorites.concat([productName]);
      localStorage.setItem('walkwordFavorites', JSON.stringify(favorites));
      updateFavoritesLabel();
      if (userMenu) userMenu.classList.remove('open');
      showHeaderFeedback(
        alreadyFavorite
          ? 'Produto removido dos favoritos.'
          : 'Produto adicionado aos favoritos.'
      );
    });

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Node)) return;
    var clickedOutsideUserMenu =
      userMenu &&
      !userMenu.contains(target) &&
      userBtn &&
      !userBtn.contains(target);
    if (clickedOutsideUserMenu) {
      userMenu.classList.remove('open');
    }
  });

  window.walkwordHeader = {
    getCartCountEl: function () {
      return cartCount;
    },
    setCartCount: function (n) {
      if (cartCount) cartCount.textContent = String(n);
    },
  };
})();
