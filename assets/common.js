



document.addEventListener("DOMContentLoaded", () => {
  const getUserUrl = window.location.href;
        arrUrl = getUserUrl.split("vclid="),
        getBtnCartHeader = document.querySelector('.header .header__icon--cart'),
        cartDrawer = document.querySelector('#CartDrawer');

  if(arrUrl[1]){
    localStorage.setItem("userVclid", arrUrl[1]);
  }

  const fn = ()=>{
    const CartDrawerNote = document.querySelector('textarea#CartDrawer-Note');
          CartDrawerCheckout = cartDrawer.querySelector('#CartDrawer-Checkout'),
          DetailsCartDrawer = document.querySelector('#Details-CartDrawer');

    if(localStorage.hasOwnProperty("userVclid")){
      console.log('localStorage !== null');
      CartDrawerNote.value = `VсLID: ${localStorage.getItem("userVclid")}`;

      const test = fetch(window.Shopify.routes.root + 'cart.js')
            .then(response => response.json())
            .then(date => {
              date.note = `VсLID: ${localStorage.getItem("userVclid")}`;
              return date;
            })
    }
    
    DetailsCartDrawer.querySelector('summary').addEventListener('click', ()=>{ì
      
      const test = fetch(window.Shopify.routes.root + 'cart/update.js')
                  .then(response => response.json())
                  .then(date => {
                    date.note = 'This is a note about my order';
                    console.log(date);
                    return date;
                  })
    })
  }

  getBtnCartHeader.addEventListener('click', fn);










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