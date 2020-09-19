(function () {
  const content = document.querySelector(".kw-capsule__content");
  content.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("smile")) {
      e.target.style.transition = "0.5s";
      e.target.style.transform = `scale(1.2) rotate(3deg)`;
    }
  });
  content.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("smile")) {
      e.target.style.transform = "scale(1)";
    }
  });
})();
