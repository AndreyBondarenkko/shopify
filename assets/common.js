document.addEventListener("DOMContentLoaded", () => {
  const getUserUrl = window.location.href;
  findVclid = getUserUrl.split("vclid=");

  let getNoteCard = document.querySelector("#Details-CartDrawer .cart__note"),
    getBtnCheckoutCart = document.querySelector("#checkout"),
    getNoteDriwer = document.querySelector("#CartDrawer-Note"),
    getBtnCheckoutDriwer = document.querySelector("#CartDrawer-Checkout"),
    getCartItems = document.querySelector("table.cart-items"),
    getVclid;

  if (findVclid[1]) {
    getVclid = findVclid[1];
    /****** Add to local storege ******/
    localStorage.setItem("userVclid", getVclid);
  }

  console.log(localStorage.getItem("userVclid"));

  /******* Clear localstorege *******/
  if (getBtnCheckoutCart) {
    getBtnCheckoutCart.addEventListener("click", () => {
      console.log(`getBtnCheckoutCart - click`);
      localStorage.removeItem("userVclid");
    });
  }

  getBtnCheckoutDriwer.addEventListener("click", () => {
    console.log(`getBtnCheckoutDriwer - click`);
    localStorage.removeItem("userVclid");
  });

  let check = localStorage.getItem("userVclid");
  if (getNoteCard && localStorage.hasOwnProperty("userVclid")) {
    getNoteCard.querySelector("textarea").value = `Vclid: ${check}`;
  } else if (getNoteDriwer && localStorage.hasOwnProperty("userVclid")) {
    getNoteDriwer.value = `Vclid: ${check}`;
  }
});
