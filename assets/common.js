document.addEventListener("DOMContentLoaded", () => {
  const getUserUrl = window.location.href;
  findVclid = getUserUrl.split("vclid=");

  let getNoteBlock = document.querySelector("#Details-CartDrawer .cart__note"),
    getVclid;

  if (findVclid[1]) {
    getVclid = findVclid[1];
    /****** Add to local storege ******/
    localStorage.setItem("userVclid", getVclid);
  }

  if (getNoteBlock && localStorage.getItem("userVclid")) {
    let check = localStorage.getItem("userVclid");
    getNoteBlock.querySelector("textarea").value = `Vclid: ${check}`;
    //localStorage.removeItem("userVclid");
  }
});
