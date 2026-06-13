/**
 * =====================================================
 *  WALKWORD — Favoritos (favoritos.js)
 * =====================================================
 *  Lê os favoritos do WalkWord.favorites e renderiza
 *  os cards. Permite remover da lista e adicionar ao
 *  carrinho diretamente.
 * =====================================================
 */
(function () {
  'use strict';

  // Catálogo de produtos com dados reais (espelha o catalogo.html)
  var PRODUCT_CATALOG = [
    { name: 'Soft Loafer in Nappa', brand: 'THE ROW', price: 700, category: 'footwear', type: 'loafer', sizes: '38,39,40,41', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
    { name: 'Classic Canvas Low-top', brand: 'JIL SANDER', price: 420, category: 'footwear', type: 'sneaker', sizes: '39,40,41,42', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pebbled Leather Desert Boot', brand: 'LEMAIRE', price: 850, category: 'footwear', type: 'boot', sizes: '38,39,40,41,42', image: '../telacatalogo/img/pebbled_leather_desert_boot.png' },
    { name: 'Structured Chelsea Boot', brand: 'WALKWORD', price: 1200, category: 'footwear', type: 'boot', sizes: '37,38,39,40,41', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { name: 'XT-6 Advanced Technical', brand: 'SALOMON S/LAB', price: 380, category: 'footwear', type: 'sneaker', sizes: '39,40,41,42,43', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Oversized Organic Tee', brand: 'WALKWORD', price: 280, category: 'shirts', type: 'shirt', sizes: 'PP,P,M,G,GG', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80' },
    { name: 'Poplin Social Shirt', brand: 'TOTEME', price: 460, category: 'shirts', type: 'social-shirt', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Classic Button-Down Oxford', brand: 'THE ROW', price: 580, category: 'shirts', type: 'social-shirt', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Silk Crepe Blouse', brand: 'LEMAIRE', price: 680, category: 'shirts', type: 'shirt', sizes: 'PP,P,M,G', image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=600&q=80' },
    { name: 'Knit Polo Shirt', brand: 'TOTEME', price: 340, category: 'shirts', type: 'shirt', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80' },
    { name: 'Structured Wool Blazer', brand: 'WALKWORD', price: 1800, category: 'blazers', type: 'blazer', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Deconstructed Linen Blazer', brand: 'LEMAIRE', price: 920, category: 'blazers', type: 'blazer', sizes: 'P,M,G', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Oversized Cocoon Blazer', brand: 'THE ROW', price: 1450, category: 'blazers', type: 'blazer', sizes: 'PP,P,M,G,GG', image: '../telacatalogo/img/oversized_cocoon_blazer.png' },
    { name: 'Cropped Linen Blazer', brand: 'JIL SANDER', price: 1250, category: 'blazers', type: 'blazer', sizes: 'PP,P,M,G', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Trench Coat Atemporal', brand: 'WALKWORD', price: 1600, category: 'outerwear', type: 'coat', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' },
    { name: 'Double-Breasted Overcoat', brand: 'TOTEME', price: 750, category: 'outerwear', type: 'coat', sizes: 'P,M,G', image: 'https://images.unsplash.com/photo-1584184924103-e310d9dc82fc?auto=format&fit=crop&w=600&q=80' },
    { name: 'Technical Parka', brand: 'SALOMON S/LAB', price: 890, category: 'outerwear', type: 'coat', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80' },
    { name: 'Versa Tote Bag', brand: 'WALKWORD', price: 620, category: 'accessories', type: 'bag', sizes: 'U', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80' },
    { name: 'Stone Fit Leather Belt', brand: 'WALKWORD', price: 240, category: 'accessories', type: 'belt', sizes: 'P,M,G', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Wool Cashmere Scarf', brand: 'TOTEME', price: 320, category: 'accessories', type: 'bag', sizes: 'U', image: 'https://images.unsplash.com/photo-1520635360276-79f3dbd809f6?auto=format&fit=crop&w=600&q=80' },
    { name: 'Acetate D-Frame Sunglasses', brand: 'LEMAIRE', price: 290, category: 'accessories', type: 'bag', sizes: 'U', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' },
    // Novos produtos extras
    { name: 'Square Toe Mule', brand: 'TOTEME', price: 890, category: 'footwear', type: 'loafer', sizes: '37,38,39,40,41', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80' },
    { name: 'Heritage Ankle Boot', brand: 'WALKWORD', price: 1350, category: 'footwear', type: 'boot', sizes: '38,39,40,41,42', image: '../telacatalogo/img/heritage_ankle_boot.png' },
    { name: 'Suede Derby Shoe', brand: 'LEMAIRE', price: 950, category: 'footwear', type: 'boot', sizes: '38,39,40,41,42', image: '../telacatalogo/img/suede_derby_shoe.png' },
    { name: 'Washed Linen Shirt', brand: 'WALKWORD', price: 320, category: 'shirts', type: 'shirt', sizes: 'PP,P,M,G,GG', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Striped Cotton Oxford', brand: 'LEMAIRE', price: 520, category: 'shirts', type: 'social-shirt', sizes: 'P,M,G,GG', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ribbed Modal Tank', brand: 'TOTEME', price: 145, category: 'shirts', type: 'shirt', sizes: 'PP,P,M,G', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Double-Face Wool Blazer', brand: 'TOTEME', price: 1680, category: 'blazers', type: 'blazer', sizes: 'PP,P,M,G,GG', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sculptural Overcoat', brand: 'WALKWORD', price: 2100, category: 'outerwear', type: 'coat', sizes: 'P,M,G,GG', image: '../telacatalogo/img/sculptural_overcoat.png' },
    { name: 'Quilted Utility Jacket', brand: 'JIL SANDER', price: 980, category: 'outerwear', type: 'coat', sizes: 'P,M,G,GG', image: '../telacatalogo/img/quilted_utility_jacket.png' },
    { name: 'Mini Saddle Bag', brand: 'THE ROW', price: 480, category: 'accessories', type: 'bag', sizes: 'U', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Printed Silk Scarf', brand: 'LEMAIRE', price: 190, category: 'accessories', type: 'belt', sizes: 'U', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80' },
    { name: 'Canvas Backpack', brand: 'JIL SANDER', price: 260, category: 'accessories', type: 'bag', sizes: 'U', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' }
  ];

  var grid = document.getElementById('fav-grid');
  var emptyEl = document.getElementById('fav-empty');
  var inspireEl = document.getElementById('fav-inspire');
  var countBadge = document.getElementById('fav-count-badge');

  function formatPrice(n) {
    return 'R$ ' + Number(n).toLocaleString('pt-BR');
  }

  function findProduct(name) {
    return PRODUCT_CATALOG.find(function (p) {
      return p.name === name;
    }) || null;
  }

  function getCategoryLabel(cat) {
    var map = { footwear: 'Footwear', shirts: 'Camisa', blazers: 'Blazer', outerwear: 'Casaco', accessories: 'Acessório' };
    return map[cat] || cat;
  }

  function renderFavorites() {
    if (!window.WalkWord) return;
    var favNames = WalkWord.favorites.getAll();
    
    grid.innerHTML = '';
    
    var count = 0;
    favNames.forEach(function (name) {
      var product = findProduct(name);
      if (!product) return;
      count++;

      var card = document.createElement('article');
      card.className = 'fav-card';
      card.setAttribute('data-name', name);

      card.innerHTML =
        '<div class="fav-card-image" style="background-image:url(\'' + product.image + '\')">' +
          '<div class="fav-card-overlay">' +
            '<div class="fav-card-actions">' +
              '<button class="fav-btn-cart" data-name="' + name + '">Adicionar ao Carrinho</button>' +
              '<button class="fav-btn-remove" data-name="' + name + '" aria-label="Remover dos favoritos"><i class="fa-solid fa-heart-crack"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="fav-card-brand">' + product.brand + '</div>' +
        '<div class="fav-card-title">' + product.name + '</div>' +
        '<div class="fav-card-price">' + formatPrice(product.price) + '</div>' +
        '<div class="fav-card-meta">' + getCategoryLabel(product.category) + '</div>';

      // Click no card → vai para detalhes
      card.addEventListener('click', function (e) {
        if (e.target.closest('.fav-btn-cart') || e.target.closest('.fav-btn-remove')) return;
        var productData = {
          title: product.name,
          price: product.price,
          brand: product.brand,
          sizes: product.sizes,
          category: product.category,
          image: product.image,
          condition: 'new'
        };
        sessionStorage.setItem('walkwordSelectedProduct', JSON.stringify(productData));
        window.location.href = '../teladetalhes/page.html';
      });

      // Adicionar ao carrinho
      card.querySelector('.fav-btn-cart').addEventListener('click', function (e) {
        e.stopPropagation();
        WalkWord.cart.add({
          name: product.name,
          price: product.price,
          image: product.image,
          size: product.sizes.split(',')[0]
        });
        WalkWord.showToast(product.name + ' adicionado ao carrinho!', 'success');
      });

      // Remover dos favoritos
      card.querySelector('.fav-btn-remove').addEventListener('click', function (e) {
        e.stopPropagation();
        WalkWord.favorites.toggle(name);
        WalkWord.showToast('Removido dos favoritos.', 'warning');
        renderFavorites();
      });

      grid.appendChild(card);
    });

    // Atualiza badge
    countBadge.textContent = count + (count === 1 ? ' peça' : ' peças');

    // Exibe vazio ou grid
    if (count === 0) {
      grid.style.display = 'none';
      emptyEl.style.display = 'flex';
      if (inspireEl) inspireEl.style.display = 'none';
    } else {
      grid.style.display = 'grid';
      emptyEl.style.display = 'none';
      if (inspireEl) inspireEl.style.display = 'block';
    }
  }

  // Aguarda app.js carregar
  function init() {
    if (typeof WalkWord !== 'undefined') {
      renderFavorites();
    } else {
      setTimeout(init, 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
