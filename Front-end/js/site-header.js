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

  function runSearchFilter(query) {
    if (typeof window.filterProducts === 'function') {
      window.filterProducts(query);
    }
  }

  // updateFavoritesLabel removed

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

  searchInput &&
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        var query = searchInput.value.trim();
        var path = window.location.pathname.toLowerCase();
        var isCatalogPage = path.indexOf('catalogo.html') !== -1;
        if (!isCatalogPage) {
          event.preventDefault();
          if (typeof WalkWord !== 'undefined') {
            window.location.href = WalkWord._resolveRelPath('telacatalogo/catalogo.html?search=' + encodeURIComponent(query));
          } else {
            window.location.href = '../telacatalogo/catalogo.html?search=' + encodeURIComponent(query);
          }
        }
      }
    });

  // NOTE: cart-btn click is handled by cart-drawer.js (capture=true priority)
  // site-header.js does not attach a duplicate listener to avoid conflicts.


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
      if (typeof WalkWord !== 'undefined') {
        window.location.href = WalkWord._resolveRelPath('perfil/perfil.html');
      }
    });

  menuFavoritesLink &&
    menuFavoritesLink.addEventListener('click', function (event) {
      event.preventDefault();
      if (userMenu) userMenu.classList.remove('open');
      if (typeof WalkWord !== 'undefined') {
        window.location.href = WalkWord._resolveRelPath('favoritos/favoritos.html');
      } else {
        window.location.href = '../favoritos/favoritos.html';
      }
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

  // Standardized Drawer / Overlay Initialization logic
  function initOverlays() {
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
        if (atelierOverlay) {
          atelierOverlay.classList.remove('open');
          document.body.style.overflow = '';
        }
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
        if (menuDrawer) menuDrawer.classList.add('open');
        if (drawerBackdrop) drawerBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOverlays);
  } else {
    initOverlays();
  }
})();
