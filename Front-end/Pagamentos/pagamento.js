/**
 * =====================================================
 *  WALKWORD — Pagamento (pagamento.js)
 * =====================================================
 *  Gerencia o checkout: listagem do carrinho,
 *  seleção de método de pagamento, validação e
 *  finalização do pedido.
 * =====================================================
 */
(function () {
  'use strict';

  /* ===== CEP MASK (sem jQuery) ===== */
  var cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').slice(0, 8);
      if (v.length > 5) {
        v = v.slice(0, 5) + '-' + v.slice(5);
      }
      this.value = v;
    });
  }

  /* ===== ViaCEP — Preenchimento automático de endereço ===== */
  if (cepInput) {
    cepInput.addEventListener('blur', function () {
      var cep = this.value.replace(/\D/g, '');
      if (cep.length !== 8) return;

      fetch('https://viacep.com.br/ws/' + cep + '/json/')
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.erro) {
            WalkWord.showToast('CEP não encontrado.', 'error');
            return;
          }
          var enderecoInput = document.getElementById('endereco');
          var cidadeInput = document.getElementById('cidade');
          if (enderecoInput) enderecoInput.value = data.logradouro + ', ' + data.bairro;
          if (cidadeInput) cidadeInput.value = data.localidade + ' — ' + data.uf;
          WalkWord.showToast('Endereço preenchido automaticamente!', 'success');
        })
        .catch(function () {
          WalkWord.showToast('Erro ao buscar CEP. Verifique sua conexão.', 'error');
        });
    });
  }

  /* ===== Telefone MASK ===== */
  var phoneInput = document.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
      } else if (v.length > 6) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 6) + '-' + v.slice(6);
      } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      }
      this.value = v;
    });
  }

  /* ===== Progress Steps ===== */
  var steps = document.querySelectorAll('.step');
  var progressFill = document.querySelector('.progress-fill');

  steps.forEach(function (step, index) {
    step.addEventListener('click', function () {
      steps.forEach(function (s) { s.classList.remove('active'); });
      step.classList.add('active');
      var percent = ((index + 1) / steps.length) * 100;
      if (progressFill) progressFill.style.width = percent + '%';
    });
  });

  /* ===== Auth Check ===== */
  if (typeof WalkWord === 'undefined') {
    setTimeout(function () { window.location.reload(); }, 300);
    return;
  }

  if (!WalkWord.auth.isLoggedIn()) {
    WalkWord.showToast('Faça login para continuar com o pagamento.', 'warning');
    setTimeout(function () {
      window.location.href = '../login/login.html';
    }, 1500);
    return;
  }

  /* ===== Cart Items ===== */
  var completeBtn = document.getElementById('complete-order-btn');
  var items = WalkWord.cart.getItems();

  if (items.length === 0) {
    WalkWord.showToast('Seu carrinho está vazio!', 'warning');
    if (completeBtn) completeBtn.disabled = true;
  }

  var orderItemsContainer = document.getElementById('order-items-container');
  if (orderItemsContainer) {
    orderItemsContainer.innerHTML = '';
    items.forEach(function (item) {
      var roupaDiv = document.createElement('div');
      roupaDiv.className = 'roupa';

      var img = document.createElement('img');
      img.src = item.image || './img/sobretudo.png';
      img.alt = item.name || 'Produto';
      img.loading = 'lazy';

      var detalhesDiv = document.createElement('div');
      detalhesDiv.className = 'detalhes';

      var pTitle = document.createElement('p');
      pTitle.textContent = item.name || 'Produto';

      var spanProps = document.createElement('span');
      spanProps.textContent = 'Standard / ' + (item.size || 'U');

      var priceDiv = document.createElement('div');
      priceDiv.className = 'price';
      priceDiv.textContent = 'R$ ' + (item.price || 0).toFixed(2).replace('.', ',');

      detalhesDiv.appendChild(pTitle);
      detalhesDiv.appendChild(spanProps);
      detalhesDiv.appendChild(priceDiv);

      roupaDiv.appendChild(img);
      roupaDiv.appendChild(detalhesDiv);
      orderItemsContainer.appendChild(roupaDiv);
    });
  }

  /* ===== Totals ===== */
  var subtotal = WalkWord.cart.getSubtotal();
  var tax = subtotal * 0.05;
  var total = subtotal + tax;

  var subtotalEl = document.getElementById('pay-subtotal');
  var taxEl = document.getElementById('pay-tax');
  var totalEl = document.getElementById('pay-total');

  if (subtotalEl) subtotalEl.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
  if (taxEl) taxEl.textContent = 'R$ ' + tax.toFixed(2).replace('.', ',');
  if (totalEl) totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

  /* ===== Payment Card Selection ===== */
  var payCards = document.querySelectorAll('.card');
  payCards.forEach(function (card) {
    card.addEventListener('click', function () {
      payCards.forEach(function (c) {
        c.style.borderColor = 'transparent';
        var iconDot = c.querySelector('.fa-circle-dot');
        if (iconDot) {
          iconDot.classList.remove('fa-circle-dot');
          iconDot.classList.add('fa-circle');
        }
      });
      card.style.borderColor = '#6A5E33';
      var iconCircle = card.querySelector('.fa-circle');
      if (iconCircle) {
        iconCircle.classList.remove('fa-circle');
        iconCircle.classList.add('fa-circle-dot');
      }
    });
  });

  /* ===== Complete Order ===== */
  if (completeBtn) {
    completeBtn.addEventListener('click', function () {
      var inputs = document.querySelectorAll('.info input');
      var valid = true;
      inputs.forEach(function (inp) {
        if (!inp.value.trim()) {
          inp.style.borderColor = '#c1121f';
          inp.style.outline = '1px solid #c1121f';
          valid = false;
        } else {
          inp.style.borderColor = '';
          inp.style.outline = '';
        }
      });

      if (!valid) {
        WalkWord.showToast('Preencha todos os campos de entrega.', 'error');
        return;
      }

      completeBtn.textContent = 'PROCESSANDO...';
      completeBtn.disabled = true;

      setTimeout(function () {
        WalkWord.orders.save({
          total: total,
          itemCount: items.length,
          items: items
        });
        WalkWord.cart.clear();
        WalkWord.showToast('Pedido concluído com sucesso!', 'success');

        setTimeout(function () {
          window.location.href = '../perfil/perfil.html';
        }, 1500);
      }, 1500);
    });
  }
})();
