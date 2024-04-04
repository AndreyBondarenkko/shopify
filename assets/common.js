/* ==========================
  Cart
========================== */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const cartDrawer = document.querySelector('#cart-drawer');
  const cartPriceLayout = cartDrawer.querySelector('#cart-totals');
  const cartProductsLayout = cartDrawer.querySelector('#product-items');

  const isOpenCart = document.querySelector('#is-open-cart');
  const isCloseCart = cartDrawer.querySelector('.cart-close');
  const isOutCart = document.querySelector('.cart-drawer-overflow');

  isOpenCart.addEventListener('click', () => body.classList.add('cart-opened'));
  isCloseCart.addEventListener('click', () => body.classList.remove('cart-opened'));
  isOutCart.addEventListener('click', () => body.classList.remove('cart-opened'));

  /* ==== Gift ==== */
  let plusPrice = 0;
  let minusPrice = 0;
  let removePrice = 0;
  let priceBeforeChenges = 0;
  let cartProducts = window.cart["cart-items"];
  let cartTotalPrice = +window.cart["cart-price"];
  const threshold = +window.free_gift_settings.threshold;
  const productGIFT = window.free_gift_settings.product;

  const giftProduct = (hundleClick) => {
    const hasProduct = cartProducts.some(product => product.variant_id === productGIFT);

    if (hundleClick === 'minus' && hasProduct == true && (priceBeforeChenges - minusPrice).toFixed(2) < threshold) {
      updateCart(productGIFT, 0, 'update')
    }

    if (hundleClick === 'plus' && hasProduct == false && (priceBeforeChenges + plusPrice).toFixed(2) > threshold) {
      updateCart(productGIFT, 1, 'add')
    }

    if (hundleClick === 'remove' && hasProduct == true && (cartTotalPrice - removePrice).toFixed(2) < threshold) {
      updateCart(productGIFT, 0, 'update')
    }
  }

  const updateGiftPrice = (hundleClick) => {
    const hasProduct = cartProducts.some(product => product.variant_id === productGIFT);
    let giftPriceDifference = 0;
    let percentBought = 100;

    if (cartTotalPrice < threshold && !hasProduct) {
      giftPriceDifference = (threshold - cartTotalPrice).toFixed(2);
      percentBought = Math.floor((cartTotalPrice * 100) / threshold).toFixed(0);
    }

    cartDrawer.querySelector('.gift-price').innerHTML = `$${giftPriceDifference}`;
    cartDrawer.querySelector('.line-active').style.width = `${percentBought}%`;

    giftProduct(hundleClick);
  }

  /* reload visual data  */
  const getSectionInnerHTML = (data) => {
    cartProductsLayout.innerHTML = new DOMParser()
      .parseFromString(data, 'text/html')
      .querySelector('#product-items').innerHTML;

    cartPriceLayout.innerHTML = new DOMParser()
      .parseFromString(data, 'text/html')
      .querySelector('#cart-totals').innerHTML;
  }

  /* Fetch */
  const updateCart = (id, quantity, action, hundleClick = false, price = 0) => {
    const data = {
      "updates": {},
      "items": [],
      sections: ["cart-drawer-custom"],
      sections_url: window.location.pathname
    };

    if (action !== 'add' && action === 'update' && action !== 'change') {
      data['updates'][id] = quantity
    }

    if (action === 'add' && action !== 'update' && action !== 'change') {
      data['items'].push({ 'id': id, 'quantity': quantity })
    }

    if (action !== 'add' && action !== 'update' && action === 'change') {
      data['id'] = id;
      data['quantity'] = quantity;
    }

    fetch(`${window.Shopify.routes.root}cart/${action}.js`, { ...fetchConfig(), body: JSON.stringify(data) })
      .then(response => response.json())
      .then(response => {
        cartDrawer.classList.toggle('cart-is-empty', response.items.length === 0);

        getSectionInnerHTML(response.sections["cart-drawer-custom"]);

        if (hundleClick && !window.free_gift_settings.action) return;

        hundleClick === 'minus' && hundleClick !== 'remove' ? minusPrice = price : plusPrice = price;
        hundleClick === 'remove' && hundleClick !== 'minus' && hundleClick !== 'plus'
          ? removePrice = price : '';

        priceBeforeChenges = cartTotalPrice;
        cartTotalPrice = Number(Shopify.formatMoney(response.total_price));
        cartProducts = response.items;

        if (response.items.length < 1) return;
        updateGiftPrice(hundleClick);
      })

      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /* remove product function */
  const cartRemove = (product, hundleClick) => {
    const ID = product.getAttribute('data-product-key');
    const price = +product.querySelector('.product-price').getAttribute('data-price-total');
    updateCart(ID, 0, 'update', hundleClick, price);
  }

  /* change quantity function */
  const cartQuantity = (product, hundleClick) => {
    const ID = product.getAttribute('data-product-key');
    const price = +product.querySelector('.product-price').getAttribute('data-price-single');
    const quantityValue = +product.querySelector('.quantity .quantity__input').value;

    updateCart(ID, quantityValue, 'change', hundleClick, price);
  }

  /* onClick Elements function */
  cartDrawer.addEventListener('click', ({ target }) => {
    let product;

    if (target.closest('.cart-product')) {
      product = target.closest('.cart-product')
    }

    if (target.classList.contains('button-remove') || target.classList.contains('quantity__button')) {
      plusPrice = 0;
      minusPrice = 0;
      priceBeforeChenges = 0;
    }

    if (target.classList.contains('button-remove')) {
      cartRemove(product, target.getAttribute('name'));
    }

    if (target.classList.contains('quantity__button')) {
      cartProductsLayout.style.pointerEvents = 'none';

      setTimeout(() => cartProductsLayout.style.pointerEvents = 'all', 500);
      cartQuantity(product, target.getAttribute('name'));
    }
  });

  /* onLoad function */
  (() => {
    if (window.free_gift_settings.action) {
      const hasProduct = cartProducts.some(product => product.variant_id === productGIFT);

      if (cartTotalPrice < threshold && hasProduct) {
        updateCart(productGIFT, 0, 'update');
      }

      if (cartTotalPrice > threshold && !hasProduct) {
        updateCart(productGIFT, 1, 'add');
      }
    }
  })();

});

