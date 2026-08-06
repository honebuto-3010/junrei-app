document.querySelector("#menu")
.addEventListener("click", () => {

  document.querySelectorAll(".menubar")
  .forEach(bar => bar.classList.toggle("close"));

  document.querySelector(".menu-links")
  .classList.toggle("open");
});
