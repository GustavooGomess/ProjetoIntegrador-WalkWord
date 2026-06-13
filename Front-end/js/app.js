/**
 * =====================================================
 *  WALKWORD — Módulo Central (app.js)
 * =====================================================
 *  Gerencia autenticação, carrinho e favoritos usando
 *  localStorage. Deve ser incluído em TODAS as páginas
 *  ANTES dos scripts específicos de cada página.
 *
 *  MODELO DE DADOS:
 *  Os dados de sessão (carrinho, favoritos, pedidos)
 *  são salvos DENTRO do registro de cada usuário no
 *  banco walkword_users_db, chaveados por e-mail.
 *  Assim cada usuário tem seus próprios dados, que
 *  persistem entre logins e nunca vazam para outros.
 * =====================================================
 */
var WalkWord = (function () {
  'use strict';

  /* ---------- STORAGE KEYS ---------- */
  var KEYS = {
    user:       'walkword_user',
    users:      'walkword_users_db',
    newsletter: 'walkword_newsletter',
  };

  /* ========== UTILIDADES ========== */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function writeJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /* -------------------------------------------------------
   *  Helpers: lê/grava dados de um usuário específico
   *  dentro do banco de usuários, chaveado pelo e-mail.
   * ----------------------------------------------------- */
  function _getCurrentEmail() {
    var user = readJSON(KEYS.user, null);
    return user && user.email ? user.email.trim().toLowerCase() : null;
  }

  function _getUserRecord(emailKey) {
    var users = readJSON(KEYS.users, []);
    return users.find(function (u) {
      return u.email.toLowerCase() === emailKey;
    }) || null;
  }

  function _saveUserRecord(emailKey, record) {
    var users = readJSON(KEYS.users, []);
    var idx = users.findIndex(function (u) {
      return u.email.toLowerCase() === emailKey;
    });
    if (idx !== -1) {
      users[idx] = record;
    } else {
      users.push(record);
    }
    writeJSON(KEYS.users, users);
  }

  /** Lê um campo de dados do usuário logado (cart, favorites, orders). */
  function _readUserData(field, fallback) {
    var emailKey = _getCurrentEmail();
    if (!emailKey) return fallback;
    var record = _getUserRecord(emailKey);
    if (!record) return fallback;
    return record[field] !== undefined ? record[field] : fallback;
  }

  /** Grava um campo de dados no registro do usuário logado. */
  function _writeUserData(field, value) {
    var emailKey = _getCurrentEmail();
    if (!emailKey) return;
    var users = readJSON(KEYS.users, []);
    var idx = users.findIndex(function (u) {
      return u.email.toLowerCase() === emailKey;
    });
    if (idx !== -1) {
      users[idx][field] = value;
      writeJSON(KEYS.users, users);
    }
  }

  /* ========== AUTH ========== */
  var auth = {
    /**
     * Login — valida e-mail e senha, restaura sessão do usuário.
     */
    login: function (email, password) {
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Insira um e-mail válido.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'A senha deve ter ao menos 6 caracteres.' };
      }

      var emailKey = email.trim().toLowerCase();
      var users = readJSON(KEYS.users, []);
      var matchedUser = users.find(function (u) {
        return u.email.toLowerCase() === emailKey;
      });

      var name;
      if (matchedUser) {
        name = matchedUser.name;
      } else {
        name = email.split('@')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        users.push({ name: name, email: email.trim(), password: password });
        writeJSON(KEYS.users, users);
      }

      var userData = { email: email.trim(), name: name, loginAt: Date.now() };
      writeJSON(KEYS.user, userData);
      return { success: true, message: 'Login realizado com sucesso!' };
    },

    register: function (name, email, password) {
      if (!name || name.trim().length < 2) {
        return { success: false, message: 'Insira seu nome completo.' };
      }
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Insira um e-mail válido.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'A senha deve ter ao menos 6 caracteres.' };
      }

      var emailKey = email.trim().toLowerCase();
      var users = readJSON(KEYS.users, []);
      var existingUserIdx = users.findIndex(function (u) {
        return u.email.toLowerCase() === emailKey;
      });

      if (existingUserIdx !== -1) {
        // Mantém dados existentes (cart, favorites, orders) ao re-registrar
        users[existingUserIdx].name     = name.trim();
        users[existingUserIdx].password = password;
      } else {
        users.push({ name: name.trim(), email: email.trim(), password: password });
      }
      writeJSON(KEYS.users, users);

      var userData = { email: email.trim(), name: name.trim(), loginAt: Date.now() };
      writeJSON(KEYS.user, userData);
      return { success: true, message: 'Conta criada com sucesso!' };
    },

    logout: function () {
      // Remove apenas a sessão ativa. Os dados (cart, favorites, orders)
      // ficam salvos dentro do registro do usuário no banco e serão
      // restaurados automaticamente no próximo login.
      localStorage.removeItem(KEYS.user);
    },

    isLoggedIn: function () {
      return !!localStorage.getItem(KEYS.user);
    },

    getUser: function () {
      var user = readJSON(KEYS.user, null);
      if (user && user.email) {
        var emailKey = user.email.toLowerCase();
        var users = readJSON(KEYS.users, []);
        var matchedUser = users.find(function (u) {
          return u.email.toLowerCase() === emailKey;
        });
        if (matchedUser && matchedUser.name && matchedUser.name !== user.name) {
          user.name = matchedUser.name;
          writeJSON(KEYS.user, user);
        } else if (user.name && user.name.includes('@')) {
          var cleanName = user.name.split('@')[0];
          cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          user.name = cleanName;
          writeJSON(KEYS.user, user);
        }
      }
      return user;
    },
  };

  /* ========== CART ========== */
  var cart = {
    _items: function () {
      return _readUserData('cart', []);
    },

    add: function (product) {
      var items = cart._items();
      items.push({
        name:    product.name  || 'Produto',
        price:   parseFloat(product.price) || 0,
        size:    product.size  || '',
        color:   product.color || '',
        image:   product.image || '',
        addedAt: Date.now(),
      });
      _writeUserData('cart', items);
      cart._sync();
    },

    remove: function (index) {
      var items = cart._items();
      if (index >= 0 && index < items.length) {
        items.splice(index, 1);
        _writeUserData('cart', items);
        cart._sync();
      }
    },

    getItems: function () {
      return cart._items();
    },

    getCount: function () {
      return cart._items().length;
    },

    getSubtotal: function () {
      return cart._items().reduce(function (sum, item) {
        return sum + item.price;
      }, 0);
    },

    clear: function () {
      _writeUserData('cart', []);
      cart._sync();
    },

    /** Sincroniza o badge #cart-count em todas as páginas */
    _sync: function () {
      var badge = document.getElementById('cart-count');
      if (badge) {
        badge.textContent = String(cart.getCount());
      }
    },
  };

  /* ========== FAVORITES ========== */
  var favorites = {
    _list: function () {
      return _readUserData('favorites', []);
    },

    toggle: function (productName) {
      var list = favorites._list();
      var idx = list.indexOf(productName);
      if (idx === -1) {
        list.push(productName);
      } else {
        list.splice(idx, 1);
      }
      _writeUserData('favorites', list);
      return idx === -1; // true = added, false = removed
    },

    isFavorite: function (productName) {
      return favorites._list().indexOf(productName) !== -1;
    },

    getAll: function () {
      return favorites._list();
    },
  };

  /* ========== ORDERS ========== */
  var orders = {
    save: function (orderData) {
      var all = _readUserData('orders', []);
      orderData.id   = 'WW-' + Math.floor(100000 + Math.random() * 900000);
      orderData.date = new Date().toISOString();
      all.push(orderData);
      _writeUserData('orders', all);
      return orderData;
    },

    getAll: function () {
      return _readUserData('orders', []);
    },
  };

  /* ========== NEWSLETTER ========== */
  var newsletter = {
    subscribe: function (email) {
      if (!email || !email.includes('@')) {
        return { success: false, message: 'E-mail inválido.' };
      }
      var subs = readJSON(KEYS.newsletter, []);
      if (subs.indexOf(email) !== -1) {
        return { success: false, message: 'Este e-mail já está inscrito.' };
      }
      subs.push(email);
      writeJSON(KEYS.newsletter, subs);
      return { success: true, message: 'Inscrição realizada com sucesso!' };
    },
  };

  /* ========== HEADER SYNC ========== */
  function syncHeader() {
    cart._sync();

    var menuLoginLink = document.getElementById('menu-login-link');
    if (menuLoginLink) {
      if (auth.isLoggedIn()) {
        var user = auth.getUser();
        menuLoginLink.textContent = user ? user.name : 'Meu Perfil';
        menuLoginLink.href = _resolveRelPath('perfil/perfil.html');
      } else {
        menuLoginLink.textContent = 'Entrar';
        menuLoginLink.href = _resolveRelPath('login/login.html');
      }
    }

    var userMenu = document.getElementById('user-menu');
    if (userMenu && auth.isLoggedIn()) {
      var existingLogout = document.getElementById('menu-logout-link');
      if (!existingLogout) {
        var logoutLink = document.createElement('a');
        logoutLink.id = 'menu-logout-link';
        logoutLink.href = '#';
        logoutLink.textContent = 'Sair';
        logoutLink.style.color = '#BE2B2B';
        logoutLink.addEventListener('click', function (e) {
          e.preventDefault();
          auth.logout();
          window.location.href = _resolveRelPath('login/login.html');
        });
        userMenu.appendChild(logoutLink);
      }
    }
  }

  function _resolveRelPath(target) {
    var path = window.location.pathname.toLowerCase();
    path = path.replace(/\\/g, '/');
    if (path.indexOf('/login/')        !== -1) return '../' + target;
    if (path.indexOf('/navegacao/')    !== -1) return '../' + target;
    if (path.indexOf('/telacatalogo/') !== -1) return '../' + target;
    if (path.indexOf('/teladetalhes/') !== -1) return '../' + target;
    if (path.indexOf('/pagamento')     !== -1) return '../' + target;
    if (path.indexOf('/perfil/')       !== -1) return '../' + target;
    if (path.indexOf('/privacidade/')  !== -1) return '../' + target;
    if (path.indexOf('/favoritos/')    !== -1) return '../' + target;
    return target;
  }

  function showToast(message, type) {
    var existing = document.querySelector('.ww-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'ww-toast';
    toast.textContent = message;

    var bgColor = '#1a1c1c';
    if (type === 'success') bgColor = '#2d6a4f';
    if (type === 'error')   bgColor = '#c1121f';
    if (type === 'warning') bgColor = '#e09f3e';

    toast.style.cssText =
      'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-20px);' +
      'background:' + bgColor + ';color:#fff;padding:12px 24px;border-radius:10px;' +
      'font-family:Inter,sans-serif;font-size:13px;font-weight:500;z-index:9999;' +
      'opacity:0;transition:all .35s cubic-bezier(.4,0,.2,1);' +
      'box-shadow:0 8px 32px rgba(0,0,0,.18);letter-spacing:.3px;';

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(function () { toast.remove(); }, 350);
    }, 2400);
  }

  /* ========== INIT ========== */
  function _init() {
    syncHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  /* ========== PUBLIC API ========== */
  return {
    auth:           auth,
    cart:           cart,
    favorites:      favorites,
    orders:         orders,
    newsletter:     newsletter,
    syncHeader:     syncHeader,
    showToast:      showToast,
    _resolveRelPath: _resolveRelPath,
  };
})();
