/*********************************
 * Accordion
 ********************************/
const getFaqItems = document.querySelector(".grid-faq");

getFaqItems.addEventListener("click", function ({ target }) {
  const getFaqItemActive = document.querySelector(".items-faq.active"),
    getFaqWrapper = target.closest(".items-faq"),
    getFaqDescription = getFaqWrapper.querySelector(".faq-answer"),
    getFaqDescriptionContent = getFaqDescription.querySelector(".faq-content");

  if (target.closest(".faq-question")) {
    if (getFaqWrapper.classList.contains("active")) {
      getFaqWrapper.classList.remove("active");
      getFaqDescription.style.height = 0 + "px";
    } else {
      if (getFaqItemActive) {
        getFaqItemActive.classList.remove("active");
        getFaqItemActive.querySelector(".faq-answer").style.height = 0 + "px";
      }
      getFaqWrapper.classList.add("active");
      getFaqDescription.style.height =
        getFaqDescriptionContent.scrollHeight + 35 + "px";
    }
  }
});
