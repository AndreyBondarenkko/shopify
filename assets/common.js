document.addEventListener("DOMContentLoaded", () => {
  const getUserUrl = window.location.href;
  findVclid = getUserUrl.split("vclid=");

  let getNoteCard = document.querySelector("#Details-CartDrawer .cart__note"),
    getNoteDriwer = document.querySelector("#CartDrawer-Note"),
    getVclid;

  if (findVclid[1]) {
    getVclid = findVclid[1];
    /****** Add to local storege ******/
    localStorage.setItem("userVclid", getVclid);
  }

  console.log(localStorage.hasOwnProperty("userVclid"));

  if (getNoteCard && localStorage.hasOwnProperty("userVclid")) {
    let check = localStorage.getItem("userVclid");
    getNoteCard.querySelector("textarea").value = `Vclid: ${check}`;
    localStorage.removeItem("userVclid");
  }

  console.log(localStorage.hasOwnProperty("userVclid"));
});
