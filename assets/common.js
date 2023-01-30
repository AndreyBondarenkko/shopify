document.addEventListener("DOMContentLoaded", () => {
  const getUserUrl = window.location.href;
  (arrUrl = getUserUrl.split("vclid=")),
    (getCartBtnGroup = document.querySelector(".product-form__buttons"));

  if (arrUrl[1]) {
    localStorage.setItem("userVclid", arrUrl[1]);
  }

  const fn = () => {
    const cartDrawerNote = document.querySelector("textarea#CartDrawer-Note");
    (cartDrawerCheckout = cartDrawer.querySelector("#CartDrawer-Checkout")),
      (detailsCartDrawer = document.querySelector("#Details-CartDrawer"));

    if (localStorage.hasOwnProperty("userVclid")) {
      cartDrawerNote.value = localStorage.getItem("userVclid");
    }

    cartDrawerCheckout.addEventListener("click", () => {
      console.log(123);

      if (localStorage.hasOwnProperty("userVclid")) {
        const body = JSON.stringify({
          note: localStorage.getItem("userVclid"),
        });
        console.log(`${routes.cart_update_url}`);

        fetch(`${window.Shopify.routes.root}cart/update.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: body,
        });
      }
    });
  };

  getBtnCartHeader.addEventListener("click", fn);
});
