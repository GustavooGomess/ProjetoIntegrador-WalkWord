/**
 * =====================================================
 *  WALKWORD — Privacidade Page (privacidade.js)
 * =====================================================
 *  Scroll spy, sidebar navigation, scroll suave,
 *  animação de entrada nos blocos.
 * =====================================================
 */
(function () {
  'use strict';

  var sidebarLinks = document.querySelectorAll('aside a');
  var blocks = document.querySelectorAll('.block');

  /* ---------- Scroll Spy ---------- */
  function updateScrollSpy() {
    var scrollPos = window.scrollY + 180;

    blocks.forEach(function (block, index) {
      var rect = block.getBoundingClientRect();
      var offsetTop = rect.top + window.scrollY;
      var offsetBottom = offsetTop + block.offsetHeight;

      if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
        sidebarLinks.forEach(function (link) {
          link.classList.remove('active');
        });
        if (sidebarLinks[index]) {
          sidebarLinks[index].classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy);

  /* ---------- Sidebar Click → Smooth Scroll ---------- */
  sidebarLinks.forEach(function (link, index) {
    link.style.cursor = 'pointer';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (blocks[index]) {
        blocks[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Block Reveal Animation ---------- */
  blocks.forEach(function (block) {
    block.style.opacity = '0';
    block.style.transform = 'translateY(20px)';
    block.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  function revealBlocks() {
    blocks.forEach(function (block) {
      var rect = block.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && !block.classList.contains('ww-revealed')) {
        block.classList.add('ww-revealed');
        block.style.opacity = '1';
        block.style.transform = 'translateY(0)';
      }
    });
  }

  window.addEventListener('scroll', revealBlocks);
  setTimeout(revealBlocks, 150);

  /* ---------- Footer Links ---------- */
  var footerLinks = document.querySelectorAll('footer a');
  footerLinks.forEach(function (link) {
    var text = (link.textContent || '').trim();
    if (text === 'New Arrivals' || text === 'Essentials') {
      link.href = '../telacatalogo/catalogo.html';
      link.style.cursor = 'pointer';
    } else if (text === 'Privacy Policy') {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
})();
