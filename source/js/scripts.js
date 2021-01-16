const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');

const mapPicture = document.querySelector(".map__picture");
const mapInteractive = document.querySelector(".map__interactive");

// map without js
mapInteractive.classList.remove("display-hide");
mapPicture.classList.add("display-hide");

// nav open and closed
nav.classList.remove('nav--nojs');

navToggle.addEventListener('click', function() {
  if (nav.classList.contains('nav--closed')) {
    nav.classList.remove('nav--closed');
    nav.classList.add('nav--opened');
  } else {
    nav.classList.add('nav--closed');
    nav.classList.remove('nav--opened');
  }
});
