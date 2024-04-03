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
  let cartCurrentPrice = +window.cart["cart-price"];
  const threshold = +window.free_gift_settings.threshold;
  const productGIFT = window.free_gift_settings.product;
  const productGiftPrice = +window.free_gift_settings.price;

  const giftProduct = (hundleClick) => {
    console.log('add or remove gift product')
    const hasProduct = cartProducts.some(product => product.variant_id === productGIFT);

    console.log('hasProduct', hasProduct);
    console.log('minus', (priceBeforeChenges - minusPrice).toFixed(2));


    if (hundleClick === 'minus' && hasProduct == true && (priceBeforeChenges - minusPrice).toFixed(2) < threshold) {
      console.log('minus :');
      updateCart(productGIFT, 0, 'update')
    }

    if (hundleClick === 'plus' && hasProduct == false && (cartCurrentPrice + plusPrice).toFixed(2) > threshold) {
      console.log('plus :');
      updateCart(productGIFT, 1, 'add')
    }

    if (hundleClick === 'remove' && hasProduct == true && (cartCurrentPrice - removePrice).toFixed(2) < threshold) {
      console.log('remove')
      updateCart(productGIFT, 0, 'update')
    }
  }

  const refreshGiftPrice = (hundleClick) => {
    console.log('refreshGiftPrice');
    let difference = 0;
    let percent_bought = 100;

    if (cartCurrentPrice < threshold) {
      difference = (threshold - cartCurrentPrice).toFixed(2);
      percent_bought = Math.floor((cartCurrentPrice * 100) / threshold).toFixed(0);
    }

    cartDrawer.querySelector('.gift-price').innerHTML = `$${difference}`;
    cartDrawer.querySelector('.line-active').style.width = `${percent_bought}%`;

    giftProduct(hundleClick);
  }

  /* reload visual data  */
  const getSectionInnerHTML = (data) => {
    console.log('refresh cart layout')
    cartProductsLayout.innerHTML = new DOMParser()
      .parseFromString(data, 'text/html')
      .querySelector('#product-items').innerHTML;

    cartPriceLayout.innerHTML = new DOMParser()
      .parseFromString(data, 'text/html')
      .querySelector('#cart-totals').innerHTML;
  }

  /* Fetch */
  const updateCart = (id, quantity, action, hundleClick = null, price = 0) => {
    console.log('action:', action);

    const data = {
      "updates": {},
      "items": [],
      sections: ["cart-drawer-custom"],
      sections_url: window.location.pathname
    };

    if (action !== 'add' && action === 'update' && action !== 'change') {
      data['updates'][id] = quantity
      console.log('fetch event: update.js')
    }

    if (action === 'add' && action !== 'update' && action !== 'change') {
      data['items'].push({ 'id': id, 'quantity': quantity })
      console.log('fetch event: add.js')
    }

    if (action !== 'add' && action !== 'update' && action === 'change') {
      data['id'] = id;
      data['quantity'] = quantity;
      console.log('fetch event: change.js')
    }

    console.log(data)

    fetch(`${window.Shopify.routes.root}cart/${action}.js`, { ...fetchConfig(), body: JSON.stringify(data) })
      .then(response => response.json())
      .then(response => {
        cartDrawer.classList.toggle('cart-is-empty', response.items.length === 0);

        console.log('1')

        getSectionInnerHTML(response.sections["cart-drawer-custom"]);

        if (hundleClick !== null) {
          hundleClick === 'minus' && hundleClick !== 'remove' ? minusPrice = price : plusPrice = price;
          hundleClick === 'remove' && hundleClick !== 'minus' && hundleClick !== 'plus'
            ? removePrice = price : '';

          priceBeforeChenges = cartCurrentPrice;
          cartCurrentPrice = Number(Shopify.formatMoney(response.total_price));
          cartProducts = response.items;

          console.log('2')

          if (response.items.length >= 1 || threshold !== 0 || window.free_gift_settings.action) {
            console.log('3')
            refreshGiftPrice(hundleClick);
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /* remove product function */
  const cartRemove = (product, hundleClick) => {
    const ID = product.getAttribute('data-variant-id');
    const price = +product.querySelector('.product-price').getAttribute('data-price-total');
    updateCart(ID, 0, 'update', hundleClick, price);
  }

  /* change quantity function */
  const cartQuantity = (product, hundleClick) => {
    const ID = product.getAttribute('data-variant-id');
    const price = +product.querySelector('.product-price').getAttribute('data-price-single');
    const quantityValue = +product.querySelector('.quantity .quantity__input').value;

    updateCart(ID, quantityValue, 'change', hundleClick, price);
  }

  /* onLoad function */
  (() => {
    const hasProduct = cartProducts.some(product => product.variant_id === productGIFT);

    // if (hasProduct) {
    //const math = +window.free_gift_settings.price > cartCurrentPrice
    //  ? +window.free_gift_settings.price - cartCurrentPrice : cartCurrentPrice - +window.free_gift_settings.price;
    // }

    if (cartCurrentPrice < threshold && hasProduct) {
      console.log('onLoad: update')
      updateCart(productGIFT, 0, 'update');
    }

    if (cartCurrentPrice > threshold && !hasProduct) {
      console.log('onLoad: add')
      updateCart(productGIFT, 1, 'add');
    }

    console.log('onLoad function')
  })();

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

});

