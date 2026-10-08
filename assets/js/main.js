(function () {
  'use strict';

  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('siteNav');
  var menuLabel = menuBtn.querySelector('.menu-label');

  /* ---------- Mobile menu ---------- */

  function setMenu(open, returnFocus) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('is-open', open);
    if (!open && returnFocus) menuBtn.focus();
  }

  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });

  // Close the mobile menu if the window grows past the mobile breakpoint.
  var desktop = window.matchMedia('(min-width: 981px)');
  desktop.addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  /* ---------- Condensed header on scroll ---------- */

  if ('IntersectionObserver' in window) {
    var sentinel = document.querySelector('.header-sentinel');
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-condensed', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Highlight the nav link for the section in view ---------- */

  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  var hero = document.getElementById('top');
  if (hero) sections.unshift(hero); // the hero clears the highlight

  if ('IntersectionObserver' in window) {
    // A thin band across the middle of the viewport decides which section is "current".
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Gentle fade-in as sections enter ---------- */

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
