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


/* ==========================
  Product Slider
========================== */
document.addEventListener('DOMContentLoaded', () => {
  const mainSlider = document.querySelector('#main-slider_init');
  const thumbsSlider = document.querySelector('#thumbs-slider_init');
  const variantGroup = document.querySelector('.variant-group-color');
  const mainSliderGroup = {};
  const thumbsSliderGroup = {}

  window.productThumbsInit = new Swiper(thumbsSlider, {
    slidesPerView: 5,
  });

  window.productSliderInit = new Swiper(mainSlider, {
    spaceBetween: 10,
    thumbs: {
      swiper: window.productThumbsInit,
    }
  });

  const createVariantObj = () => {
    variantGroup.querySelectorAll('.fieldset-item').forEach(variantItem => {
      mainSliderGroup[variantItem.dataset.value.trim()] = [];
      thumbsSliderGroup[variantItem.dataset.value.trim()] = [];
    });
  }

  const filterVariantImage = (slider, obj) => {
    slider.forEach(slide => {
      const imageAlt = slide.querySelector('img').getAttribute('alt').split(',');

      if (imageAlt.length < 1) return;

      imageAlt.forEach(item => {
        const alt = item.toLocaleLowerCase().trim();
        if (obj.hasOwnProperty(alt)) obj[alt].push(slide);
        else for (let key in obj) obj[key].push(slide);
      });
    });
  }

  const replaceSlider = (variantChecked) => {
    const mainSliderItemsWrap = mainSlider.querySelector('.swiper-wrapper');
    const thumbsSliderItemsWrap = thumbsSlider.querySelector('.swiper-wrapper');

    mainSliderItemsWrap.textContent = '';
    window.productSliderInit.removeAllSlides();

    thumbsSliderItemsWrap.textContent = '';
    window.productThumbsInit.removeAllSlides();

    mainSliderGroup[variantChecked].forEach(slide => mainSliderItemsWrap.appendChild(slide));
    thumbsSliderGroup[variantChecked].forEach(slide => thumbsSliderItemsWrap.appendChild(slide));

    const mainSliderItems = Array.from(mainSlider.querySelectorAll('#main-slider_init .swiper-slide'));
    let mainSliderTo = 0;

    for (let k = 0; k < mainSliderItems.length; k++) {
      const array = mainSliderItems[k].querySelector('img').getAttribute('alt').split(',');
      const result = array.findIndex(alt => alt.toLocaleLowerCase().trim() === variantChecked.toLocaleLowerCase().trim());

      if (result !== -1) {
        mainSliderTo = k;
        break;
      }
    }

    window.productSliderInit.update();
    window.productSliderInit.slideTo(mainSliderTo !== -1 ? mainSliderTo : 0);
    window.productSliderInit.navigation.init();

    window.productThumbsInit.update();
    window.productThumbsInit.slideTo(mainSliderTo !== -1 ? mainSliderTo : 0);
    window.productThumbsInit.navigation.init();
  }

  const onFilterSlicer = () => {
    console.log('click');
    variantGroup.addEventListener('click', ({ target }) => {
      if (target.closest('.fieldset-item') && !target.classList.contains('.item-checked')) {
        const varianChecked = target.closest('.fieldset-item');
        document.querySelector('.fieldset-item.item-checked').classList.remove('item-checked');
        varianChecked.classList.add('item-checked');

        replaceSlider(varianChecked.dataset.value)
      }
    });
  }

  const initFilterVariant = () => {
    if (!variantGroup) return;

    const mainSliderItems = mainSlider.querySelectorAll('#main-slider_init .swiper-slide');
    const thumbsSliderItems = thumbsSlider.querySelectorAll('#thumbs-slider_init .swiper-slide');
    const variantChecked = variantGroup.querySelector('.fieldset-item.item-checked');

    createVariantObj();
    filterVariantImage(mainSliderItems, mainSliderGroup);
    filterVariantImage(thumbsSliderItems, thumbsSliderGroup);
    onFilterSlicer();

    replaceSlider(variantChecked.dataset.value);
  }

  initFilterVariant();
});