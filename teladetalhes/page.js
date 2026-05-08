const sizeButtons = document.querySelectorAll(".size-btn");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const accordionHeaders = document.querySelectorAll(".accordion-header");
const thumbImages = document.querySelectorAll(".thumb-image");
const mainProductImage = document.getElementById("main-product-image");
const cartCount = document.getElementById("cart-count");
const productCards = document.querySelectorAll(".card_hero");

let selectedSize = "";
let cartItems = 0;

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sizeButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    selectedSize = button.value;
  });
});

addToCartBtn?.addEventListener("click", () => {
  if (!selectedSize) {
    addToCartBtn.value = "SELECIONE UM TAMANHO";
    addToCartBtn.classList.add("warning-state");
    setTimeout(() => {
      addToCartBtn.value = "ADICIONAR AO CARRINHO";
      addToCartBtn.classList.remove("warning-state");
    }, 1400);
    return;
  }

  addToCartBtn.value = `ADICIONADO (${selectedSize})`;
  addToCartBtn.classList.add("success-state");
  cartItems += 1;
  if (cartCount) {
    cartCount.textContent = String(cartItems);
  }

  setTimeout(() => {
    addToCartBtn.value = "ADICIONAR AO CARRINHO";
    addToCartBtn.classList.remove("success-state");
  }, 1600);
});

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.closest(".accordion-item");
    if (!item) return;
    item.classList.toggle("open");
  });
});

thumbImages.forEach((image) => {
  image.addEventListener("click", () => {
    const activeThumb = document.querySelector(".thumb-image.is-active");
    const activeThumbCard = document.querySelector(".columns_div div.is-active-thumb");
    activeThumb?.classList.remove("is-active");
    activeThumbCard?.classList.remove("is-active-thumb");
    image.classList.add("is-active");
    image.parentElement?.classList.add("is-active-thumb");
    if (mainProductImage) {
      mainProductImage.src = image.src;
      mainProductImage.alt = image.alt.replace("Miniatura", "Imagem principal");
    }
  });
});

if (thumbImages[0]) {
  thumbImages[0].classList.add("is-active");
  thumbImages[0].parentElement?.classList.add("is-active-thumb");
}

function filterProducts(query) {
  productCards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.toLowerCase() || "";
    const matches = title.includes(query);
    card.style.display = matches || query === "" ? "block" : "none";
  });
}

window.filterProducts = filterProducts;
