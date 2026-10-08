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
  var desktop = window.matchMedia('(min-width: 1101px)');
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

  /* ---------- Schedule: archive games already played, mark the next one ---------- */

  var gameList = document.getElementById('gameList');
  var earlier = document.getElementById('gamesEarlier');
  if (gameList && earlier) {
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];
    var now = new Date();
    var today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    var played = [];
    var next = null;

    Array.prototype.forEach.call(gameList.querySelectorAll('.game[data-date]'), function (row) {
      var parts = row.getAttribute('data-date').split('-').map(Number);
      var stamp = parts[0] * 10000 + parts[1] * 100 + parts[2];
      if (stamp < today) {
        row.hidden = true;
        played.push(MONTHS[parts[1] - 1] + ' ' + parts[2] + ' vs. ' + row.querySelector('h3').textContent);
      } else if (!next) {
        next = row;
      }
    });

    if (!next) gameList.hidden = true; // season over: only the "earlier" line remains
    if (next) {
      next.classList.add('is-next');
      var label = document.createElement('span');
      label.className = 'game-next';
      label.textContent = 'Next home game';
      next.querySelector('.game-info').prepend(label);
    }
    if (played.length) {
      earlier.innerHTML = '<strong>Earlier this season:</strong> ';
      earlier.appendChild(document.createTextNode(played.join(' · ')));
      earlier.hidden = false;
    }
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
