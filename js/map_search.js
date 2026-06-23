// js/map_search.js — HTST Pipeline Map typeahead search control
// Depends on: window.nsipMarkers (populated by nsip_layer.js)
//             window.solarData   (populated by map.html render loop)
// Called via: initMapSearch(map) after layers are ready

(function () {
  'use strict';

  var _map   = null;
  var _index = [];
  var _activeIdx = -1;

  function buildIndex() {
    _index = [];
    var nsip = window.nsipMarkers || [];
    nsip.forEach(function (m) {
      _index.push({
        name:   m.name   || 'NSIP Project',
        lat:    m.lat,
        lng:    m.lng,
        colour: m.colour || '#3498DB',
        type:   'nsip',
        marker: m.marker || null
      });
    });
    var repd = window.solarData || window.repdData || [];
    repd.forEach(function (s) {
      var name = s.name || s.site_name || s.SiteName || '';
      if (!name) return;
      var lat  = s.lat  || s.latitude  || null;
      var lng  = s.lng  || s.longitude || null;
      if (!lat || !lng) return;
      _index.push({
        name:   name,
        lat:    parseFloat(lat),
        lng:    parseFloat(lng),
        colour: s._colour || '#5B8DEF',
        type:   'repd',
        marker: s.marker  || null
      });
    });
  }

  function query(q) {
    if (!q || q.length < 2) return { nsip: [], repd: [] };
    var ql = q.toLowerCase();
    var nsip = [], repd = [];
    _index.forEach(function (item) {
      if (item.name.toLowerCase().indexOf(ql) !== -1) {
        if (item.type === 'nsip')  nsip.push(item);
        else if (repd.length < 8) repd.push(item);
      }
    });
    return { nsip: nsip, repd: repd };
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlight(text, q) {
    if (!q) return escHtml(text);
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
    return escHtml(text).replace(re, '<strong>$1</strong>');
  }

  function renderDropdown(results, q, listEl) {
    listEl.innerHTML = '';
    var allItems = [];
    function addSection(label, items) {
      if (!items.length) return;
      var div = document.createElement('li');
      div.className = 'msc-divider';
      div.textContent = label;
      listEl.appendChild(div);
      items.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'msc-item';
        li.innerHTML = '<span class="msc-dot" style="background:' + item.colour + ';"></span>' +
          '<span class="msc-label">' + highlight(item.name, q) + '</span>' +
          '<span class="msc-type">' + (item.type === 'nsip' ? 'NSIP' : 'REPD') + '</span>';
        li.addEventListener('mousedown', function (e) {
          e.preventDefault();
          selectItem(item);
        });
        listEl.appendChild(li);
        allItems.push({ el: li, item: item });
      });
    }
    addSection('\u25b6 NSIP Projects', results.nsip);
    addSection('\u25b6 REPD Sites',    results.repd);
    listEl._allItems = allItems;
    return allItems;
  }

  function selectItem(item) {
    if (!_map) return;
    _map.flyTo([item.lat, item.lng], 13, { duration: 1.2 });
    if (item.marker) {
      setTimeout(function () {
        if (item.marker.openPopup) item.marker.openPopup();
      }, 1400);
    }
  }

  function setActive(allItems, idx) {
    allItems.forEach(function (r, i) {
      r.el.classList.toggle('active', i === idx);
    });
    _activeIdx = idx;
  }

  function initMapSearch(map) {
    _map = map;
    setTimeout(buildIndex, 1200);
    var Control = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        var container = L.DomUtil.create('div', 'map-search-control leaflet-bar');
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.innerHTML =
          '<div class="msc-wrapper">' +
            '<div class="msc-input-row">' +
              '<span class="msc-icon">&#128269;</span>' +
              '<input class="msc-input" type="text" placeholder="Search sites\u2026" autocomplete="off" spellcheck="false">' +
              '<button class="msc-clear" title="Clear">&#10005;</button>' +
            '</div>' +
            '<ul class="msc-dropdown"></ul>' +
          '</div>';
        var input    = container.querySelector('.msc-input');
        var clearBtn = container.querySelector('.msc-clear');
        var dropdown = container.querySelector('.msc-dropdown');
        input.addEventListener('input', function () {
          var q = input.value.trim();
          clearBtn.style.display = q ? 'flex' : 'none';
          _activeIdx = -1;
          if (q.length < 2) { dropdown.style.display = 'none'; return; }
          if (_index.length === 0) buildIndex();
          var results = query(q);
          var total   = results.nsip.length + results.repd.length;
          if (total === 0) { dropdown.style.display = 'none'; return; }
          renderDropdown(results, q, dropdown);
          dropdown.style.display = 'block';
        });
        input.addEventListener('keydown', function (e) {
          var allItems = dropdown._allItems || [];
          if (!allItems.length) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive(allItems, Math.min(_activeIdx + 1, allItems.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(allItems, Math.max(_activeIdx - 1, 0));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (_activeIdx >= 0 && allItems[_activeIdx]) {
              selectItem(allItems[_activeIdx].item);
              input.value = allItems[_activeIdx].item.name;
              dropdown.style.display = 'none';
              clearBtn.style.display = 'flex';
            }
          } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
            _activeIdx = -1;
          }
        });
        clearBtn.addEventListener('click', function () {
          input.value = '';
          clearBtn.style.display = 'none';
          dropdown.style.display = 'none';
          _activeIdx = -1;
          input.focus();
        });
        document.addEventListener('click', function (e) {
          if (!container.contains(e.target)) {
            dropdown.style.display = 'none';
            _activeIdx = -1;
          }
        });
        return container;
      }
    });
    new Control().addTo(map);
    console.log('[HTST] Map search control initialised');
  }

  window.initMapSearch = initMapSearch;

}());
