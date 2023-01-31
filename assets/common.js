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

/* ========================================
  Inpur range
======================================== */
// function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
//   const [from, to] = getParsed(fromInput, toInput);
//   fillSlider(fromInput, toInput, "#C6C6C6", "#25daa5", controlSlider);
//   if (from > to) {
//     fromSlider.value = to;
//     fromInput.value = to;
//   } else {
//     fromSlider.value = from;
//   }
// }

// function controlToInput(toSlider, fromInput, toInput, controlSlider) {
//   const [from, to] = getParsed(fromInput, toInput);
//   fillSlider(fromInput, toInput, "#C6C6C6", "#25daa5", controlSlider);
//   setToggleAccessible(toInput);
//   if (from <= to) {
//     toSlider.value = to;
//     toInput.value = to;
//   } else {
//     toInput.value = from;
//   }
// }

// function controlFromSlider(fromSlider, toSlider, fromInput) {
//   const [from, to] = getParsed(fromSlider, toSlider);
//   fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
//   if (from > to) {
//     fromSlider.value = to;
//     fromInput.value = to;
//   } else {
//     fromInput.value = from;
//   }
// }

// function controlToSlider(fromSlider, toSlider, toInput) {
//   const [from, to] = getParsed(fromSlider, toSlider);
//   fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
//   setToggleAccessible(toSlider);
//   if (from <= to) {
//     toSlider.value = to;
//     toInput.value = to;
//   } else {
//     toInput.value = from;
//     toSlider.value = from;
//   }
// }

// function getParsed(currentFrom, currentTo) {
//   const from = parseInt(currentFrom.value, 10);
//   const to = parseInt(currentTo.value, 10);
//   return [from, to];
// }

// function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
//   const rangeDistance = to.max - to.min;
//   const fromPosition = from.value - to.min;
//   const toPosition = to.value - to.min;
//   controlSlider.style.background = `linear-gradient(
//     to right,
//     ${sliderColor} 0%,
//     ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
//     ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
//     ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
//     ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
//     ${sliderColor} 100%)`;
// }

// function setToggleAccessible(currentTarget) {
//   const toSlider = document.querySelector("#toSlider");
//   if (Number(currentTarget.value) <= 0) {
//     toSlider.style.zIndex = 2;
//   } else {
//     toSlider.style.zIndex = 0;
//   }
// }

// const fromSlider = document.querySelector("#fromSlider");
// const toSlider = document.querySelector("#toSlider");
// const fromInput = document.querySelector("#fromInput");
// const toInput = document.querySelector("#toInput");
// fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
// setToggleAccessible(toSlider);

// fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
// toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
// fromInput.oninput = () =>
//   controlFromInput(fromSlider, fromInput, toInput, toSlider);
// toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
