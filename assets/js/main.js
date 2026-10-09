/* ==========================================================================
   The Sol Devils — page behaviour
   1. Setup                  5. Schedule: archive played games, mark the next one
   2. Mobile menu            6. Keep separators off line ends
   3. Condensed header       7. Photo strip on phones; footer year
   4. Highlight the nav link 8. Gentle fade-in (last, see below)
   No dependencies. Everything degrades gracefully: without this file the page is
   fully visible, the links show as a plain row on phones, and the schedule simply
   shows every row. If one part fails (say, a mistyped schedule row), the error is
   logged and the rest of the page still works and stays visible.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Setup ---------- */

  var root = document.documentElement;
  var hasIO = 'IntersectionObserver' in window;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Runs one part of the script; if it throws, the error is logged and the rest carries on.
  function safely(part) {
    try { part(); } catch (err) { if (window.console) console.error(err); }
  }

  var header = document.getElementById('header');
  var nav = document.getElementById('siteNav');
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];

  /* ---------- 2. Mobile menu (below 1024px) ----------
     If this part fails, the fallback in index.html shows the links as a plain row instead. */

  safely(function () {
    var headerBar = header.querySelector('.header-bar');
    var menuBtn = document.getElementById('menuBtn');
    var menuLabel = menuBtn.querySelector('.menu-label');
    var scrim = document.getElementById('menuScrim');
    // Everything outside the header is made inert while the sheet is open, so screen readers and the
    // keyboard stay inside it (the Tab trap below covers browsers without "inert").
    var outside = [document.querySelector('.utility'), document.getElementById('main'), document.querySelector('.footer')];
    var supportsInert = 'inert' in HTMLElement.prototype;
    var scrollAtOpen = 0;

    function isOpen() { return menuBtn.getAttribute('aria-expanded') === 'true'; }

    // The sheet opens directly beneath the visible header bar, wherever the page is scrolled.
    function placeMenu() {
      root.style.setProperty('--menu-top', Math.max(0, Math.round(headerBar.getBoundingClientRect().bottom)) + 'px');
    }

    // close.focus: return focus to the Menu button (Escape, scrim, the button itself)
    // close.restore: put the page back exactly where it was (not when a link was chosen)
    function setMenu(open, close) {
      close = close || {};
      if (open) {
        placeMenu();
        scrollAtOpen = window.scrollY;
        // the width of a classic scrollbar (0 where scrollbars overlay the page), kept as padding while locked
        root.style.setProperty('--scrollbar-w', Math.max(0, window.innerWidth - root.clientWidth) + 'px');
      }
      menuBtn.setAttribute('aria-expanded', String(open));
      menuLabel.textContent = open ? 'Close' : 'Menu';
      nav.classList.toggle('is-open', open);
      root.classList.toggle('menu-open', open); // scroll lock lives on <html> only
      if (supportsInert) outside.forEach(function (el) { if (el) el.inert = open; });
      if (!open) {
        // preventScroll: focusing the sticky button must never move the page
        if (close.focus) menuBtn.focus({ preventScroll: true });
        if (close.restore && Math.abs(window.scrollY - scrollAtOpen) > 1) window.scrollTo(0, scrollAtOpen);
      }
    }

    menuBtn.addEventListener('click', function () {
      if (isOpen()) setMenu(false, { restore: true });
      else setMenu(true);
    });

    // Choosing any link in the header (a menu link, the crest "back to top") closes the sheet without
    // restoring the old position, so the page goes where the visitor asked. Member Login opens in a new tab,
    // so this page stays where it was and focus goes back to the Menu button, ready for the visitor's return.
    header.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!isOpen() || !link) return;
      setMenu(false, link.target === '_blank' ? { focus: true, restore: true } : {});
    });

    // A tap on the scrim, or anywhere outside the header, closes it where it was.
    scrim.addEventListener('click', function () { setMenu(false, { focus: true, restore: true }); });
    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) setMenu(false, { restore: true });
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); setMenu(false, { focus: true, restore: true }); return; }
      // Keep keyboard focus inside the open menu: the button, then each link, then back round.
      if (e.key === 'Tab') {
        var items = [menuBtn].concat(navLinks);
        var first = items[0];
        var last = items[items.length - 1];
        var inside = items.indexOf(document.activeElement) !== -1;
        if (!inside) { e.preventDefault(); first.focus({ preventScroll: true }); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus({ preventScroll: true }); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus({ preventScroll: true }); }
      }
    });

    window.addEventListener('resize', function () { if (isOpen()) placeMenu(); });
    headerBar.addEventListener('transitionend', function () { if (isOpen()) placeMenu(); });

    // Close the sheet if the window grows to desktop width, where the full navigation shows.
    var desktop = window.matchMedia('(min-width: 1024px)');
    var onDesktop = function (e) { if (e.matches && isOpen()) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
    else if (desktop.addListener) desktop.addListener(onDesktop);

    // The menu is wired: the CSS may now treat the nav as a closed sheet (see styles.css, "Without JavaScript").
    root.classList.add('js', 'js-menu');
  });

  /* ---------- 3. Condensed header once the page scrolls ---------- */

  safely(function () {
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        header.classList.toggle('is-condensed', !entries[0].isIntersecting);
      }).observe(document.querySelector('.header-sentinel'));
    }
  });

  /* ---------- 4. Highlight the nav link for the section in view ----------
     Every section is observed, including ones with no nav link (the hero, Photos, Sponsorship), and the
     footer too, so the highlight clears there instead of lingering on the previous link. */

  safely(function () {
    var anchorLinks = navLinks.filter(function (a) { return a.getAttribute('href').charAt(0) === '#'; });
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id], body > footer'));

    function setCurrent(id) {
      anchorLinks.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }

    if (hasIO) {
      // A thin band across the middle of the viewport decides which section is current.
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) setCurrent(entry.target.id || ''); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { sectionObserver.observe(s); });
    }
  });

  /* ---------- 5. Schedule ----------
     Rows whose data-date has passed are hidden and listed under "Earlier this season"; the first
     remaining game is marked as the next home game (it stays marked through its own game day). After the
     last game the card shows the season's results, and the heading/standfirst words marked in index.html
     switch to their season-over form. Each upcoming row's heading also carries its full date for screen
     readers ("Hawai‘i, October 10, next home game"), so moving by heading gives the whole fixture. */

  var stackable = [];   // elements that stack their items rather than wrap them (see 6)
  var resultLists = []; // results lists whose rows all share one shape (see 6)
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

  safely(function () {
    var schedule = document.getElementById('schedule');
    var gameList = document.getElementById('gameList');
    var earlier = document.getElementById('gamesEarlier');
    var card = document.getElementById('fixtureCard');
    if (!gameList || !earlier) return;

    var now = new Date();
    var today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    var played = [];
    var next = null;
    var nextSpoken = null;

    Array.prototype.forEach.call(gameList.querySelectorAll('.game[data-date]'), function (row) {
      var parts = row.getAttribute('data-date').split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return;   // a mistyped date: leave the row as written
      var stamp = parts[0] * 10000 + parts[1] * 100 + parts[2];
      var longDate = MONTHS[parts[1] - 1] + ' ' + parts[2];
      var name = row.querySelector('h3') || row.querySelector('.game-info');
      var time = row.querySelector('.game-time');

      if (stamp < today) {
        row.hidden = true;
        played.push({ date: longDate, name: name ? name.textContent.trim() : '' });
        return;
      }
      if (!next) next = row;

      // the full date, spoken with the opponent (the short printed date is then hidden from screen readers)
      if (name && name.tagName === 'H3') {
        var spoken = document.createElement('span');
        spoken.className = 'sr-only';
        spoken.textContent = ', ' + longDate;
        name.appendChild(spoken);
        var printed = row.querySelector('.game-date');
        if (printed) printed.setAttribute('aria-hidden', 'true');
        if (row === next) nextSpoken = spoken;
      }

      // An upcoming game can't be "Final" (a leftover from last season's rows): show it as not yet announced.
      if (time && /^\s*final\s*$/i.test(time.textContent)) time.textContent = 'Time TBA';
      // Kickoffs still to be announced are set quietly, so confirmed times stand out.
      if (time && /tba/i.test(time.textContent)) time.classList.add('is-tba');

      // Subtitles such as "Hall of Fame Game · Wear gold": keep each phrase whole.
      var sub = row.querySelector('.game-info p');
      var phrases = sub ? sub.textContent.split('·').map(function (t) { return t.trim(); }).filter(Boolean) : [];
      if (phrases.length > 1) {
        sub.textContent = '';
        phrases.forEach(function (text, i) {
          if (i) {
            var sep = document.createElement('span');
            sep.className = 'ph-sep';
            sep.textContent = ' · ';
            sub.appendChild(sep);
          }
          var ph = document.createElement('span');
          ph.className = 'ph';
          ph.textContent = text;
          sub.appendChild(ph);
        });
        stackable.push(sub);
      }
    });

    if (next) {
      next.classList.add('is-next');
      var label = document.createElement('span');
      label.className = 'game-next';
      label.setAttribute('aria-hidden', 'true');   // announced with the heading instead (see above)
      label.innerHTML = '<svg aria-hidden="true" focusable="false"><use href="#sun"/></svg>Next home game';
      var info = next.querySelector('.game-info');
      if (info) info.insertBefore(label, info.firstChild);
      if (nextSpoken) nextSpoken.textContent += ', next home game';
    } else {
      // Season over: results only, and the section's words change to their season-over form.
      gameList.hidden = true;
      if (card) card.classList.add('is-season-over');
      if (schedule) {
        schedule.classList.add('is-season-over');
        Array.prototype.forEach.call(schedule.querySelectorAll('[data-season-over]'), function (el) {
          el.textContent = el.getAttribute('data-season-over');
        });
      }
    }

    if (played.length) {
      earlier.textContent = '';
      var title = document.createElement('p');
      title.className = 'earlier-title';
      title.textContent = 'Earlier this season';
      var colon = document.createElement('span');
      colon.className = 'sr-only';
      colon.textContent = ':';
      title.appendChild(colon);

      var list = document.createElement('ul');
      list.className = 'played-list';
      list.setAttribute('role', 'list');
      played.forEach(function (game) {
        // e.g. "September 5 vs. Morgan State" (no line break is allowed after "vs.")
        var item = document.createElement('li');
        item.className = 'played';
        var date = document.createElement('span');
        date.className = 'played-date';
        date.textContent = game.date;
        item.appendChild(date);
        if (game.name) {
          var opp = document.createElement('span');
          opp.className = 'played-opp';
          opp.textContent = 'vs. ' + game.name;
          item.appendChild(document.createTextNode(' '));
          item.appendChild(opp);
        }
        list.appendChild(item);
      });

      // Three or more games (or the whole season): a results list, columns read down in date order.
      // One or two: a single centred line.
      if (!next || played.length >= 3) {
        earlier.classList.add('is-results');
        list.style.setProperty('--rows', Math.ceil(played.length / 2));
        resultLists.push(list);
      } else {
        stackable.push(list);
      }
      earlier.appendChild(title);
      earlier.appendChild(list);
      earlier.hidden = false;
    }
  });

  /* ---------- 6. Separators never start or end a line ----------
     A line such as "September 5 vs. Morgan State · October 3 vs. Baylor" stays on one line when it fits;
     if its items would wrap, each item gets a line of its own (and the separators are hidden).
     In a results list, if any row's opponent would drop under its date, every row does, so the list
     keeps one shape. */

  function restack() {
    stackable.forEach(function (el) {
      el.classList.remove('is-stacked');
      var items = el.querySelectorAll('.ph, .played');
      if (items.length > 1 && items[items.length - 1].offsetTop > items[0].offsetTop + 2) el.classList.add('is-stacked');
    });
    resultLists.forEach(function (list) {
      list.classList.remove('rows-stacked');
      var wraps = Array.prototype.some.call(list.querySelectorAll('.played'), function (row) {
        var opp = row.querySelector('.played-opp');
        var date = row.querySelector('.played-date');
        return opp && date && opp.offsetTop > date.offsetTop + 2;
      });
      if (wraps) list.classList.add('rows-stacked');
    });
  }
  var restackQueued = false;
  function queueRestack() {
    if (restackQueued) return;
    restackQueued = true;
    window.requestAnimationFrame(function () { restackQueued = false; safely(restack); });
  }
  if (stackable.length || resultLists.length) {
    safely(restack);
    window.addEventListener('resize', queueRestack);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueRestack);
  }

  /* ---------- 7. Photo strip on phones; footer year ----------
     Below 600px the Club Memories prints become a sideways strip. While it scrolls, it is a labelled region
     that keyboard users can focus and scroll with the arrow keys; at other widths it is a plain grid. */

  safely(function () {
    var strip = document.querySelector('.gallery');
    if (!strip) return;
    var syncStrip = function () {
      if (strip.scrollWidth > strip.clientWidth + 1) {
        strip.setAttribute('tabindex', '0');
        strip.setAttribute('role', 'region');
        strip.setAttribute('aria-label', 'Club photographs');
      } else {
        strip.removeAttribute('tabindex');
        strip.removeAttribute('role');
        strip.removeAttribute('aria-label');
      }
    };
    syncStrip();
    window.addEventListener('resize', syncStrip);
  });

  safely(function () {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  });

  /* ---------- 8. Gentle fade-in as sections enter ----------
     Last, on purpose: .reveal elements may only start hidden (html.reveal-ready, see styles.css, Motion)
     once the observer that reveals them exists, so no error anywhere above can leave the page blank.
     Visitors who prefer reduced motion see everything at once. */

  safely(function () {
    if (!hasIO || reduceMotion) return;
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
      // a wrapper laid out with display: contents (the wide-screen photo grid) has no box to observe
      if (getComputedStyle(el).display === 'contents') el.classList.add('is-visible');
      else revealObserver.observe(el);
    });
    root.classList.add('reveal-ready');
  });
})();
