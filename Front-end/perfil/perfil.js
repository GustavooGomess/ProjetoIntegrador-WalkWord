/**
 * =====================================================
 *  WALKWORD — Perfil Page (perfil.js)
 * =====================================================
 *  Verificação de login, nome dinâmico, sign out,
 *  sidebar navigation, exibição de pedidos.
 * =====================================================
 */
(function () {
  'use strict';

  /* ---------- Auth Check ---------- */
  if (!WalkWord.auth.isLoggedIn()) {
    WalkWord.showToast('Faça login para acessar seu perfil.', 'warning');
    setTimeout(function () {
      window.location.href = '../login/login.html';
    }, 600);
    return;
  }

  var user = WalkWord.auth.getUser();

  /* ---------- Dynamic Name ---------- */
  var welcomeTitle = document.querySelector('.text2 h1');
  if (welcomeTitle && user) {
    welcomeTitle.textContent = 'Welcome back, ' + user.name + '!';
  }

  /* ---------- Orders Rendering ---------- */
  var ordersContainer = document.getElementById('dynamic-orders-container');
  var orders = WalkWord.orders.getAll();

  if (ordersContainer) {
    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p style="color: #7D7974; font-size: 14px; margin-top: 20px;">Você ainda não possui pedidos recentes.</p>';
    } else {
      var latestOrder = orders[orders.length - 1]; // Get the most recent order
      var orderHTML = '';
      
      latestOrder.items.forEach(function(item) {
        var orderNum = 'WW-' + Math.floor(100000 + Math.random() * 900000);
        var imgSrc = item.image || './img/sueter.png';
        var itemName = item.name || 'Produto';
        var itemSize = item.size || 'U';
        var itemColor = item.color || 'Standard';
        var itemPrice = 'R$ ' + (item.price || 0).toFixed(2).replace('.', ',');

        orderHTML += '<div class="over" style="margin-bottom: 20px;">' +
          '<img src="' + imgSrc + '" alt="' + itemName + '" loading="lazy">' +
          '<div class="roupa">' +
            '<div class="text4">' +
              '<span>ORDER #' + orderNum + '</span>' +
              '<h2>' + itemName + '</h2>' +
              '<span>Size: ' + itemSize + ' | Color: ' + itemColor + '</span>' +
              '<div class="stepper">' +
                '<div class="step active"><div class="circle"></div><p>CONFIRMED</p></div>' +
                '<div class="step"><div class="circle"></div><p>CRAFTED</p></div>' +
                '<div class="step"><div class="circle"></div><p>IN TRANSIT</p></div>' +
                '<div class="step"><div class="circle"></div><p>DELIVERED</p></div>' +
              '</div>' +
            '</div>' +
            '<div class="text5">' +
              '<h2>' + itemPrice + '</h2>' +
              '<span>Est. delivery in 5 days</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      });
      ordersContainer.innerHTML = orderHTML;
    }
  }

  /* ---------- Sign Out ---------- */
  var signOutLink = document.querySelector('.sign a');
  if (signOutLink) {
    signOutLink.addEventListener('click', function (e) {
      e.preventDefault();
      WalkWord.auth.logout();
      WalkWord.showToast('Você saiu da sua conta.', 'success');
      setTimeout(function () {
        window.location.href = '../login/login.html';
      }, 800);
    });
  }

  /* ---------- Privacy Link ---------- */
  var privacyBtn = document.getElementById('privacy-btn');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = '../privacidade/privacidade.html';
    });
  }

  /* ---------- Sidebar Navigation ---------- */
  var sidebarLinks = document.querySelectorAll('.sel a');
  var sections = {
    'Orders': '.link2',
    'Personal Data': '.text2',
    'Address': '.text6',
    'Payment': '.text6',
    'Settings': '.text6',
  };

  sidebarLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Highlight active
      document.querySelectorAll('.sel').forEach(function (s) {
        s.classList.remove('active');
      });
      link.closest('.sel').classList.add('active');

      // Extract section name from link text
      var text = link.textContent.trim();
      var targetSelector = null;

      Object.keys(sections).forEach(function (key) {
        if (text.indexOf(key) !== -1) {
          targetSelector = sections[key];
        }
      });

      if (targetSelector) {
        var target = document.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (text.indexOf('Privacy') !== -1) {
        window.location.href = '../privacidade/privacidade.html';
      } else {
        WalkWord.showToast('Seção "' + text + '" em desenvolvimento.', 'warning');
      }
    });
  });

  /* ---------- View All History ---------- */
  var viewAllLink = document.querySelector('.active a');
  if (viewAllLink) {
    viewAllLink.addEventListener('click', function (e) {
      e.preventDefault();
      var orders = WalkWord.orders.getAll();
      if (orders.length === 0) {
        WalkWord.showToast('Nenhum pedido encontrado.', 'warning');
      } else {
        WalkWord.showToast(orders.length + ' pedido(s) no histórico.', 'success');
      }
    });
  }

  /* ---------- Track Origin Story ---------- */
  var trackLink = document.querySelector('.trace a');
  if (trackLink) {
    trackLink.addEventListener('click', function (e) {
      e.preventDefault();
      WalkWord.showToast('Rastreamento de origem em desenvolvimento.', 'warning');
    });
  }

  /* ---------- Footer Links ---------- */
  var footerLinks = document.querySelectorAll('footer .footer-col a');
  footerLinks.forEach(function (link) {
    var text = link.textContent.trim().toUpperCase();
    if (text === 'PRIVACY POLICY') {
      link.href = '../privacidade/privacidade.html';
    } else if (text === 'TRACEABILITY' || text === 'SHIPPING & RETURNS') {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        WalkWord.showToast('Página em desenvolvimento.', 'warning');
      });
    }
  });
})();
