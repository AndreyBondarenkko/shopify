/* ==========================
  Cart
========================== */
document.addEventListener('DOMContentLoaded', () => {
  /* ==========================
    Common Variables
  ========================== */
  const HTML = document.querySelector('html');
  const BODY = document.querySelector('body');


  /* ==========================
    Cart
  ========================== */
  const cartDrawer = document.querySelector('#cart-drawer');
  const cartPriceLayout = cartDrawer.querySelector('#cart-totals');
  const cartProductsLayout = cartDrawer.querySelector('#product-items');

  const isOpenCart = document.querySelector('#is-open-cart');
  const isCloseCart = cartDrawer.querySelector('.cart-close');
  const isOutCart = document.querySelector('.cart-drawer-overflow');

  isOpenCart.addEventListener('click', () => BODY.classList.add('cart-opened'));
  isCloseCart.addEventListener('click', () => BODY.classList.remove('cart-opened'));
  isOutCart.addEventListener('click', () => BODY.classList.remove('cart-opened'));

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

    fetch(`${window.Shopify.routes.root}cart/${action}.js`, { ...fetchConfig(), BODY: JSON.stringify(data) })
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

  /* ==========================
    Product Slider
  ========================== */
  if (BODY.classList.contains('page-product')) {
    const mainSlider = document.querySelector('#main-slider_init');
    const thumbsSlider = document.querySelector('#thumbs-slider_init');
    const variantsWrapper = document.querySelectorAll('#variants-group .variant-group');
    const imageDefault = document.querySelector('.single-product-item.product-media-wrap').getAttribute('data-default-image');

    const mainSwiperItems = [];
    const thumbsSwiperItems = [];
    const variantsCheckedArray = [];

    window.productThumbsInit = new Swiper(thumbsSlider, {
      slidesPerView: 3,
      breakpoints: {
        768: {
          slidesPerView: 5,
        }
      }
    });

    window.productSliderInit = new Swiper(mainSlider, {
      spaceBetween: 10,
      thumbs: {
        swiper: window.productThumbsInit,
      }
    });

    const createDefaultSlide = (mainSlide = false) => {
      const createDiv = document.createElement('div');
      createDiv.classList.add('swiper-slide');

      const createImg = document.createElement('img');
      createImg.setAttribute('src', imageDefault)

      if (mainSlide) {
        createDiv.append(createImg)
      }

      else {
        const createImageWrap = document.createElement('div');
        createImageWrap.classList.add('swiper-slide-media');
        createImageWrap.append(createImg)
        createDiv.append(createImageWrap);
      }

      return createDiv;
    }

    const handleVariantFilter = (target) => {
      const parent = target.closest('.variant-group')
      parent.querySelector('.fieldset-item.item-checked')?.classList.remove('item-checked');
      target.closest('.fieldset-item').classList.add('item-checked');

      variantsCheckedArray.splice(0, variantsCheckedArray.length);
      variantsWrapper.forEach(variant => {
        const checked = variant.querySelector('.fieldset-item.item-checked');
        variantsCheckedArray.push(checked);
      });
    }

    const onLoadVariantFilter = () => {
      variantsWrapper.forEach(variant => {
        const checked = variant.querySelector('.fieldset-item.item-checked');
        variantsCheckedArray.push(checked);
      });
    }

    const filterSlides = (sliderArray) => {
      return sliderArray.filter(slide => {
        const alt = slide.querySelector('img').getAttribute('alt');
        const variantIndicators = alt.includes('&&');

        if (!variantIndicators) return false;

        const imageIndicator = alt
          .split('&&')
          .join(' ')
          .split(',')
          .map(item => item.toLowerCase().trim());

        //slide.querySelector('img').setAttribute('alt', alt.split('&&')[0]);

        return variantsCheckedArray.every(checkedItem =>
          imageIndicator.includes(checkedItem.dataset.value.toLowerCase().trim())
        );
      });
    };

    const rerenderGallery = (sliderLength, galleryMain, galleryThumbs) => {
      const mainSliderItemsWrap = mainSlider.querySelector('.swiper-wrapper');
      const thumbsSliderItemsWrap = thumbsSlider.querySelector('.swiper-wrapper');

      mainSliderItemsWrap.innerHTML = '';
      window.productSliderInit.removeAllSlides();

      thumbsSliderItemsWrap.innerHTML = '';
      window.productThumbsInit.removeAllSlides();

      if (sliderLength === 0) {
        mainSliderItemsWrap.append(createDefaultSlide(true));
        thumbsSliderItemsWrap.append(createDefaultSlide());
      }

      if (sliderLength !== 0) {
        galleryMain.forEach(slide => mainSliderItemsWrap.append(slide));
        galleryThumbs.forEach(slide => thumbsSliderItemsWrap.append(slide));

        window.productSliderInit.update();
        window.productSliderInit.slideTo(0);
        window.productSliderInit.navigation.init();

        window.productThumbsInit.update();
        window.productThumbsInit.slideTo(0);
        window.productThumbsInit.navigation.init();
      }
    }

    const initializeOnLoad = () => {
      onLoadVariantFilter();

      const galleryMain = filterSlides(mainSwiperItems);
      const galleryThumbs = filterSlides(thumbsSwiperItems);
      const sliderLength = galleryMain.length;

      console.log(galleryMain);

      rerenderGallery(sliderLength, galleryMain, galleryThumbs)
    }

    const initializeVariantFilter = () => {
      if (variantsWrapper.length < 1 && mainSlider.querySelectorAll('.swiper-slide').length !== 0) return;

      Array.from(mainSlider.querySelectorAll('.swiper-slide')).forEach(slide => mainSwiperItems.push(slide));
      Array.from(thumbsSlider.querySelectorAll('.swiper-slide')).forEach(slide => thumbsSwiperItems.push(slide));

      document.querySelector('#variants-group').addEventListener('click', ({ target }) => {
        if (target.closest('.fieldset-item') && !target.classList.contains('.item-checked')) {
          handleVariantFilter(target);
          const galleryMain = filterSlides(mainSwiperItems);
          const galleryThumbs = filterSlides(thumbsSwiperItems);
          const sliderLength = galleryMain.length;

          rerenderGallery(sliderLength, galleryMain, galleryThumbs)
        }
      });

      //OnLoad 
      initializeOnLoad();
    }

    initializeVariantFilter()
  }

  /* ==========================
    можна переробити під SKY
  ========================== */
  // const filterVariantImage = (slider, obj) => {
  //   slider.forEach(slide => {
  //     const imageAlt = slide.querySelector('img').getAttribute('alt').split(',');

  //     if (imageAlt.length < 1) return;

  //     imageAlt.forEach(item => {
  //       const alt = item.toLocaleLowerCase().trim();
  //       if (obj.hasOwnProperty(alt)) obj[alt].push(slide);
  //       else for (let key in obj) obj[key].push(slide);
  //     });
  //   });
  // }

  // const replaceSlider = (variantChecked) => {
  //   const mainSliderItemsWrap = mainSlider.querySelector('.swiper-wrapper');
  //   const thumbsSliderItemsWrap = thumbsSlider.querySelector('.swiper-wrapper');

  //   mainSliderItemsWrap.textContent = '';
  //   window.productSliderInit.removeAllSlides();

  //   thumbsSliderItemsWrap.textContent = '';
  //   window.productThumbsInit.removeAllSlides();

  //   mainSliderGroup[variantChecked].forEach(slide => mainSliderItemsWrap.appendChild(slide));
  //   thumbsSliderGroup[variantChecked].forEach(slide => thumbsSliderItemsWrap.appendChild(slide));

  //   const mainSliderItems = Array.from(mainSlider.querySelectorAll('#main-slider_init .swiper-slide'));
  //   let mainSliderTo = 0;

  //   for (let k = 0; k < mainSliderItems.length; k++) {
  //     const array = mainSliderItems[k].querySelector('img').getAttribute('alt').split(',');
  //     const result = array.findIndex(alt => alt.toLocaleLowerCase().trim() === variantChecked.toLocaleLowerCase().trim());

  //     if (result !== -1) {
  //       mainSliderTo = k;
  //       break;
  //     }
  //   }

  //   window.productSliderInit.update();
  //   window.productSliderInit.slideTo(mainSliderTo !== -1 ? mainSliderTo : 0);
  //   window.productSliderInit.navigation.init();

  //   window.productThumbsInit.update();
  //   window.productThumbsInit.slideTo(mainSliderTo !== -1 ? mainSliderTo : 0);
  //   window.productThumbsInit.navigation.init();
  // }

  // const initFilterVariant = () => {
  //   if (!variantGroup) return;

  //   const mainSliderItems = mainSlider.querySelectorAll('#main-slider_init .swiper-slide');
  //   const thumbsSliderItems = thumbsSlider.querySelectorAll('#thumbs-slider_init .swiper-slide');
  //   const variantChecked = variantGroup.querySelector('.fieldset-item.item-checked');

  //   createVariantObj();
  //   filterVariantImage(mainSliderItems, mainSliderGroup);
  //   filterVariantImage(thumbsSliderItems, thumbsSliderGroup);
  //   onFilterSlicer();

  //   replaceSlider(variantChecked.dataset.value);
  // }

  // initFilterVariant();
});