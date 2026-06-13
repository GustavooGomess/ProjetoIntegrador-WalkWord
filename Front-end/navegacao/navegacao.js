/**
 * =====================================================
 *  WALKWORD — Navegação / Home Page (navegacao.js)
 * =====================================================
 *  Scroll reveal, newsletter, produtos clicáveis,
 *  saudação ao usuário logado, seletor de cor.
 * =====================================================
 */
(function () {
  'use strict';

  /* ---------- Greeting ---------- */
  var heroTitle = document.getElementById('dynamic-welcome') || document.querySelector('.hero h2');
  if (heroTitle && typeof WalkWord !== 'undefined' && WalkWord.auth.isLoggedIn()) {
    var user = WalkWord.auth.getUser();
  }

  /* ---------- Explore Button / Products Cursor ---------- */
  var productCards = document.querySelectorAll('.product');
  productCards.forEach(function (card) {
    card.style.cursor = 'pointer';
  });



  /* ---------- Wishlist Toggle ---------- */
  var wishlistBtn = document.getElementById('featured-wishlist-btn');
  if (wishlistBtn) {
    var active = false;
    wishlistBtn.addEventListener('click', function () {
      active = !active;
      var icon = wishlistBtn.querySelector('i');
      if (active) {
        icon.className = 'fa-solid fa-heart';
        wishlistBtn.style.borderColor = '#e84545';
        wishlistBtn.style.color = '#e84545';
        if (window.WalkWord) WalkWord.showToast('Adicionado aos favoritos!', 'success');
      } else {
        icon.className = 'fa-regular fa-heart';
        wishlistBtn.style.borderColor = '';
        wishlistBtn.style.color = '';
      }
    });
  }

  /* ---------- Newsletter ---------- */
  var newsletterForm = document.querySelector('.newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      if (!input) return;

      var result = WalkWord.newsletter.subscribe(input.value.trim());
      if (result.success) {
        WalkWord.showToast(result.message, 'success');
        input.value = '';
      } else {
        WalkWord.showToast(result.message, 'error');
      }
    });
  }

  /* ---------- Scroll Reveal ---------- */
  var revealSections = document.querySelectorAll('.grid-three, .manifesto, .community, .newsletter, .featured-drop, .image-showcase');

  function revealOnScroll() {
    revealSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var visible = rect.top < window.innerHeight * 0.85;
      if (visible && !section.classList.contains('ww-revealed')) {
        section.classList.add('ww-revealed');
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }
    });
  }

  // Set initial state
  revealSections.forEach(function (section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
  });

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once on load
  setTimeout(revealOnScroll, 100);
})();
