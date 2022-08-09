(function () {
    'use strict';

    /******** STICKY PRODUCT ********/
    const productSticky = document.querySelector('.sticky-product'),
          productMainBtns = document.querySelector('#MainContent .product-form__buttons');


    window.addEventListener('scroll', ()=>{
        if(window.pageYOffset > window.innerHeight){
            console.log('true');
            productSticky.classList.add('show')
        }else{
            console.log('false');
            productSticky.classList.remove('show')
        }
    });


})();
