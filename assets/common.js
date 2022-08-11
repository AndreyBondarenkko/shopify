



document.addEventListener("DOMContentLoaded", () => {
  const getUserUrl = window.location.href;
        arrUrl = getUserUrl.split("vclid="),
        getBtnCartHeader = document.querySelector('.header .header__icon--cart'),
        cartDrawer = document.querySelector('#CartDrawer');

  if(arrUrl[1]){
    localStorage.setItem("userVclid", arrUrl[1]);
  }

  const fn = ()=>{
    const cartDrawerNote = document.querySelector('textarea#CartDrawer-Note');
          cartDrawerCheckout = cartDrawer.querySelector('#CartDrawer-Checkout'),
          detailsCartDrawer = document.querySelector('#Details-CartDrawer');

    if(localStorage.hasOwnProperty("userVclid")){
      cartDrawerNote.value = localStorage.getItem('userVclid');
    }

    cartDrawerCheckout.addEventListener('click', ()=>{

      if(localStorage.hasOwnProperty("userVclid")){
        const body = JSON.stringify({ note: localStorage.getItem('userVclid') });
        console.log(`${routes.cart_update_url}`);

        fetch(`${window.Shopify.routes.root}cart/update.js`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: body
        });
      }

    });

  }

  getBtnCartHeader.addEventListener('click', fn);








  // const test = fetch(window.Shopify.routes.root + 'cart/update.js')
  // .then(response => response.json())
  // .then(date => {
  //   date.note = 'This is a note about my order';
  //   console.log(date);
  //   return date;
  // })


  // let getNoteCard = document.querySelector("#Details-CartDrawer .cart__note"),
  //   getBtnCheckoutCart = document.querySelector("#checkout"),
  //   getBtnCartDriwer = document.querySelector("#cart-icon-bubble"),
  //   //getDriwer = document.querySelector("cart-drawer.drawer"),
  //   getNoteDriwer = document.querySelector("#CartDrawer-Note"),
  //   getBtnCheckoutDriwer = document.querySelector("#CartDrawer-Checkout"),
  //   //getCartItems = document.querySelector("table.cart-items"),
  //   getVclid;

  // if (findVclid[1]) {
  //   getVclid = findVclid[1];
  //   /****** Add to local storege ******/
  //   localStorage.setItem("userVclid", getVclid);
  // }

  // getBtnCartDriwer.addEventListener("click", revampNoties);

  // let check = localStorage.getItem("userVclid");
  // if (getNoteCard && localStorage.hasOwnProperty("userVclid")) {
  //   getNoteCard.querySelector("textarea").value = `Vclid: ${check}`;
  // } else if (getNoteDriwer && localStorage.hasOwnProperty("userVclid")) {
  //   getNoteDriwer.value = `Vclid: ${check}`;
  // }

  // /******* Clear localstorege *******/
  // if (getBtnCheckoutCart) {
  //   getBtnCheckoutCart.addEventListener("click", () => {
  //     localStorage.removeItem("userVclid");
  //   });
  // }

  // getBtnCheckoutDriwer.addEventListener("click", () => {
  //   localStorage.removeItem("userVclid");
  // });
});