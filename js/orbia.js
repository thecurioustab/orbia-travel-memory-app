/* ORBIA prototype: screens and interactions */
var PLACES = [
  { id: 'manali', name: 'Manali', region: 'Himachal Pradesh', x: 121, y: 220, month: 'Jan 2026', tones: ['#7F9C8A', '#93AE9B', '#6C8877'], captions: ['Snow on the Solang road', 'Old Manali cafe, morning'] },
  { id: 'jaipur', name: 'Jaipur', region: 'Rajasthan', x: 110, y: 300, month: 'Mar 2026', tones: ['#D59A6A', '#C9875A', '#E0AE82'], captions: ['Hawa Mahal at golden hour', 'Amber Fort steps'] },
  { id: 'udaipur', name: 'Udaipur', region: 'Rajasthan', x: 70, y: 331, month: 'Mar 2026', tones: ['#C9876F', '#B9765F', '#D69B85'], captions: ['Lake Pichola from the ghat', 'City Palace courtyard'] },
  { id: 'hampi', name: 'Hampi', region: 'Karnataka', x: 113, y: 460, month: 'Feb 2026', tones: ['#A89270', '#BBA582', '#958060'], captions: ['Boulders at sunrise', 'Virupaksha temple'] },
  { id: 'goa', name: 'Goa', region: 'Goa', x: 76, y: 455, month: 'Dec 2025', tones: ['#5E9AA3', '#4F8A93', '#74ACB4'], captions: ['Sunglasses up under the palms', 'Tender coconut on the way to the beach', 'Golden hour over the cove', 'Cliffside huts before the rain'], photos: 4 },
  { id: 'pondy', name: 'Pondicherry', region: 'Puducherry', x: 162, y: 507, month: 'Oct 2026', tones: ['#B88A9E', '#A7798D', '#C99CB0'], captions: ['Promenade at dawn', 'Yellow walls, White Town'] },
  { id: 'kochi', name: 'Kochi', region: 'Kerala', x: 114, y: 537, month: 'Aug 2026', tones: ['#6E9572', '#5E8562', '#82A886'], captions: ['Chinese fishing nets', 'Fort Kochi street art'] }
];
var UNPLACED_TONES = ['#8E8A9B', '#9C8F7E', '#7E959B', '#A08A8A', '#8A9A86', '#9A9180'];
var TEAL = '#B82A5E';
function phCls(p, i) { return p && p.photos ? 'ph ph-' + p.id + '-' + (i % p.photos) : ''; }
var NOLOC = [3, 9, 14];
var GALLERY = ['#D59A6A','#5E9AA3','#6E9572','#C9876F','#7F9C8A','#B88A9E','#A89270','#4F8A93','#E0AE82','#93AE9B','#74ACB4','#D69B85','#82A886','#C99CB0','#BBA582','#6C8877'];

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'onboard1', locationOn: true, selected: null, viewer: null, back: 'map',
      counts: { manali: 18, jaipur: 24, udaipur: 22, hampi: 0, goa: 31, pondy: 0, kochi: 12 },
      unplaced: ['u1', 'u2', 'u3'], nextU: 4, picked: [], query: '', choice: null,
      showAdd: false, toast: '', journeyId: null, newName: '', newPlaces: [],
      journeys: [
        { id: 'raj', title: 'Rajasthan Roadtrip', dates: '12–18 Mar 2026', placeIds: ['jaipur', 'udaipur'], dayLabels: ['Day 1 · Thu 12 Mar', 'Day 4 · Sun 15 Mar'] },
        { id: 'goa', title: 'Goa with Friends', dates: '2–6 Dec 2025', placeIds: ['goa'], dayLabels: ['Day 1 · Tue 2 Dec'] },
        { id: 'him', title: 'Himachal Winter', dates: '8–12 Jan 2026', placeIds: ['manali'], dayLabels: ['Day 1 · Thu 8 Jan'] }
      ],
      zoom: 1, passFilter: 'all', passFrom: 'profile', view: 'scrap', decorating: false, sharing: false, collab: false, noteDraft: '', drag: null, selSticker: null, nextS: 10, layoutSeed: 0, pages: { jaipur: { bg: 'pink', stickers: [{ id: 's1', kind: 'badge', x: 270, y: 470, rot: -8 }, { id: 's2', kind: 'star', x: 320, y: 230, rot: 10 }] }, goa: { bg: 'paper', stickers: [{ id: 's3', kind: 'sun', x: 300, y: 250, rot: 0 }, { id: 's4', kind: 'note', text: 'best coconut of my life', x: 250, y: 520, rot: -4 }] } }, email: '', pickSel: [0,1,2,3,4,5,6,7,8,9,10,11], uploadPct: 0, imp: { total: 12, placed: 9, missing: 3 },
      captions: {}, editCaption: '', editPlace: null, editJourney: null, confirm: null
    };
    this._initial = JSON.parse(JSON.stringify(this.state));
    var V = { pid: 'jaipur', i: 0 };
    var PRESETS = {
      onboard1: {}, onboard2: { screen: 'onboard2' }, signIn: { screen: 'signIn' }, magic: { screen: 'magic', email: 'aarohi@example.com' },
      map: { screen: 'map' }, locationOff: { screen: 'map', locationOn: false }, mapPreview: { screen: 'map', selected: 'jaipur' },
      place: { screen: 'place', selected: 'jaipur' }, decorate: { screen: 'place', selected: 'jaipur', decorating: true, selSticker: 's1' }, share: { screen: 'place', selected: 'goa', sharing: true }, grid: { screen: 'place', selected: 'jaipur', view: 'grid' }, passport: { screen: 'passport', passFrom: 'profile' }, viewer: { screen: 'viewer', selected: 'jaipur', viewer: V, back: 'place' },
      edit: { screen: 'edit', selected: 'jaipur', viewer: V, back: 'place', editCaption: 'Hawa Mahal at golden hour', editPlace: 'jaipur', editJourney: 'raj' },
      deleteConfirm: { screen: 'edit', selected: 'jaipur', viewer: V, back: 'place', editCaption: 'Hawa Mahal at golden hour', editPlace: 'jaipur', editJourney: 'raj', confirm: 'memory' },
      addSheet: { screen: 'map', showAdd: true }, camera: { screen: 'camera' }, picker: { screen: 'picker' }, uploading: { screen: 'uploading', uploadPct: 64 },
      import: { screen: 'import' }, unplaced: { screen: 'unplaced' }, journeys: { screen: 'journeys' }, newJourney: { screen: 'newJourney' },
      journey: { screen: 'journey', journeyId: 'raj' }, profile: { screen: 'profile', email: 'aarohi@example.com' }
    };
    var pre = PRESETS[props.start] || {};
    for (var k in pre) this.state[k] = pre[k];
  }
  zoomTo(z1) {
    var el = this._mapEl, z0 = this.state.zoom || 1;
    var cx = el ? (el.scrollLeft + 195) / z0 : 195, cy = el ? (el.scrollTop + 300) / z0 : 300;
    this.setState({ zoom: z1 });
    setTimeout(function () { if (el) { el.scrollLeft = Math.max(0, cx * z1 - 195); el.scrollTop = Math.max(0, cy * z1 - 300); } }, 0);
  }
  place(id) { return PLACES.filter(function (p) { return p.id === id; })[0]; }
  go(screen) { this.setState({ screen: screen, showAdd: false, selected: screen === 'map' ? this.state.selected : this.state.selected }); }
  flash(msg) {
    var self = this;
    this.setState({ toast: msg });
    clearTimeout(this._t);
    this._t = setTimeout(function () { self.setState({ toast: '' }); }, 2800);
  }
  thumbs(pid, n) {
    var self = this, p = this.place(pid), out = [];
    for (var i = 0; i < n; i++) {
      (function (i) {
        out.push({ color: p.tones[i % 3], cls: phCls(p, i), isVideo: (p.photos ? false : i % 6 === 4), open: function () { self.openViewer(pid, i); } });
      })(i);
    }
    return out;
  }
  openViewer(pid, i) { this.setState({ viewer: { pid: pid, i: i }, back: this.state.screen, screen: 'viewer' }); }
  splitCounts(n) { var v = Math.floor(n / 6); return (n - v) + ' photos · ' + v + ' videos'; }
  componentWillUnmount() { clearTimeout(this._t); clearInterval(this._u); }

  renderVals() {
    var self = this, s = this.state, c = s.counts;
    var on = function (x) { return s.screen === x; };

    var z = s.zoom || 1;
    var pins = PLACES.filter(function (p) { return c[p.id] > 0; }).map(function (p, k) {
      var isSel = s.selected === p.id;
      return {
        name: p.name, count: c[p.id], color: p.tones[0], cls: phCls(p, 2), ring: isSel ? TEAL : '#FFFDF8', rot: (k % 2 ? 5 : -4),
        left: Math.round(p.x * z - 36), top: Math.round(p.y * z - 26), aria: p.name + ', ' + c[p.id] + ' memories',
        pick: function () { self.setState({ selected: p.id }); }
      };
    });

    var selP = s.selected ? this.place(s.selected) : PLACES[1];
    var selCount = c[selP.id];
    var sel = { name: selP.name, region: selP.region, count: selCount, month: selP.month };

    var view = { cls: '', color: '#555', caption: '', meta: '', position: '', isVideo: false };
    if (s.viewer) {
      var vp = this.place(s.viewer.pid);
      view = {
        color: vp.tones[s.viewer.i % 3], cls: phCls(vp, s.viewer.i), isVideo: (vp.photos ? false : s.viewer.i % 6 === 4),
        caption: s.captions[s.viewer.pid + '-' + s.viewer.i] || vp.captions[s.viewer.i % vp.captions.length],
        meta: vp.name + ', ' + vp.region + ' · ' + vp.month,
        position: (s.viewer.i + 1) + ' of ' + c[vp.id]
      };
    }

    var unplacedItems = s.unplaced.map(function (id, k) {
      var isPicked = s.picked.indexOf(id) >= 0;
      return {
        color: UNPLACED_TONES[k % UNPLACED_TONES.length], selected: isPicked, ring: isPicked ? TEAL : 'transparent',
        aria: (isPicked ? 'Deselect' : 'Select') + ' memory ' + (k + 1),
        toggle: function () {
          var next = isPicked ? s.picked.filter(function (x) { return x !== id; }) : s.picked.concat([id]);
          self.setState({ picked: next });
        }
      };
    });
    var q = (s.query || '').toLowerCase();
    var suggestions = PLACES.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) >= 0 || p.region.toLowerCase().indexOf(q) >= 0; })
      .slice(0, 4).map(function (p) {
        var chosen = s.choice === p.id;
        return {
          name: p.name, region: p.region, chosen: chosen,
          border: chosen ? TEAL : '#EFC9D5', bg: chosen ? '#F6C9D3' : '#ffffff',
          pick: function () { self.setState({ choice: p.id }); }
        };
      });
    var cantPlace = !(s.picked.length > 0 && s.choice);
    var choiceName = s.choice ? this.place(s.choice).name : '';

    var journeyCards = s.journeys.map(function (j) {
      var total = j.placeIds.reduce(function (a, pid) { return a + c[pid]; }, 0);
      return {
        title: j.title, dates: j.dates, color: self.place(j.placeIds[0]).tones[0], cls: phCls(self.place(j.placeIds[0]), 3),
        places: j.placeIds.map(function (pid) { return self.place(pid).name; }).join(', '),
        counts: self.splitCounts(total),
        open: function () { self.setState({ journeyId: j.id, screen: 'journey' }); }
      };
    });
    var jObj = s.journeys.filter(function (j) { return j.id === s.journeyId; })[0] || s.journeys[0];
    var jTotal = jObj.placeIds.reduce(function (a, pid) { return a + c[pid]; }, 0);
    var jd = {
      title: jObj.title, dates: jObj.dates, counts: self.splitCounts(jTotal), color: self.place(jObj.placeIds[0]).tones[0], cls: phCls(self.place(jObj.placeIds[0]), 2),
      days: jObj.placeIds.map(function (pid, k) {
        return { label: jObj.dayLabels[k] || ('Day ' + (k + 1)), place: self.place(pid).name, thumbs: self.thumbs(pid, Math.min(c[pid], 6)) };
      })
    };

    var placeChips = PLACES.filter(function (p) { return c[p.id] > 0; }).map(function (p) {
      var onChip = s.newPlaces.indexOf(p.id) >= 0;
      return {
        label: p.name + ' · ' + c[p.id], border: onChip ? TEAL : '#E3B3C3', bg: onChip ? TEAL : '#ffffff', fg: onChip ? '#ffffff' : '#3B1D33',
        toggle: function () {
          var next = onChip ? s.newPlaces.filter(function (x) { return x !== p.id; }) : s.newPlaces.concat([p.id]);
          self.setState({ newPlaces: next });
        }
      };
    });
    var newTotal = s.newPlaces.reduce(function (a, pid) { return a + c[pid]; }, 0);
    var cantCreate = s.newPlaces.length === 0;

    var tabIsMap = ['map', 'place', 'import', 'picker', 'uploading', 'edit'].indexOf(s.screen) >= 0 || (on('viewer') && s.back === 'place');
    var tabIsJ = ['journeys', 'journey', 'newJourney'].indexOf(s.screen) >= 0 || (on('viewer') && s.back === 'journey');


    var pickTiles = GALLERY.map(function (col, i) {
      var idx = s.pickSel.indexOf(i), isSel = idx >= 0;
      return { color: col, selected: isSel, order: idx + 1, ring: isSel ? TEAL : 'transparent', noLoc: NOLOC.indexOf(i) >= 0,
        aria: (isSel ? 'Deselect' : 'Select') + ' photo ' + (i + 1),
        toggle: function () { self.setState({ pickSel: isSel ? s.pickSel.filter(function (x) { return x !== i; }) : s.pickSel.concat([i]) }); } };
    });
    var nPick = s.pickSel.length, cantImport = nPick === 0;
    var curPid = s.viewer ? s.viewer.pid : 'jaipur';
    var editPlaceChips = PLACES.filter(function (p) { return c[p.id] > 0 || p.id === s.editPlace; }).map(function (p) {
      var on1 = s.editPlace === p.id;
      return { label: p.name, border: on1 ? TEAL : '#E3B3C3', bg: on1 ? TEAL : '#FFFFFF', fg: on1 ? '#FFFFFF' : '#3B1D33', pick: function () { self.setState({ editPlace: p.id }); } };
    });
    var editJourneyChips = s.journeys.map(function (j) { return { id: j.id, label: j.title }; }).concat([{ id: null, label: 'No journey' }]).map(function (j) {
      var on2 = s.editJourney === j.id;
      return { label: j.label, border: on2 ? TEAL : '#E3B3C3', bg: on2 ? TEAL : '#FFFFFF', fg: on2 ? '#FFFFFF' : '#3B1D33', pick: function () { self.setState({ editJourney: j.id }); } };
    });

    var LAYOUTS = [
      [{ x: 14, y: 70, w: 140, h: 140, rot: -5, f: 'polaroid' }, { x: 190, y: 66, w: 120, h: 140, rot: 4, f: 'stamp' }, { x: 26, y: 292, w: 156, h: 112, rot: 3, f: 'taped' }, { x: 200, y: 280, w: 116, h: 116, rot: -4, f: 'polaroid' }, { x: 120, y: 440, w: 96, h: 104, rot: -6, f: 'stamp' }],
      [{ x: 20, y: 80, w: 150, h: 110, rot: 3, f: 'taped' }, { x: 196, y: 70, w: 118, h: 118, rot: -5, f: 'polaroid' }, { x: 30, y: 250, w: 116, h: 130, rot: -4, f: 'stamp' }, { x: 180, y: 300, w: 130, h: 130, rot: 5, f: 'polaroid' }, { x: 44, y: 440, w: 130, h: 96, rot: 2, f: 'taped' }]
    ];
    var curP = selP.id;
    var page = (s.pages[curP]) || { bg: 'paper', stickers: [] };
    var BGS = { paper: { bg: '#FFFDF8', img: 'none' }, pink: { bg: '#FBE1E9', img: 'none' }, grid: { bg: '#FFFDF8', img: 'linear-gradient(#EFC9D5 1px, transparent 1px), linear-gradient(90deg, #EFC9D5 1px, transparent 1px)' }, kraft: { bg: '#E8D3B2', img: 'none' } };
    var pg = BGS[page.bg] || BGS.paper;
    var setPage = function (np) { var all = Object.assign({}, s.pages); all[curP] = np; self.setState({ pages: all }); };
    var lay = LAYOUTS[s.layoutSeed % LAYOUTS.length];
    var pThumbs = this.thumbs(curP, Math.min(selCount, 5));
    var scrapPhotos = pThumbs.map(function (t, k) {
      var L = lay[k], cap = (selP.captions[k % selP.captions.length]);
      cap = s.captions[curP + '-' + k] || cap;
      return { x: L.x, y: L.y, w: L.w, h: L.h, rot: L.rot, isPolaroid: L.f === 'polaroid', isStamp: L.f === 'stamp', isTaped: L.f === 'taped', cls: t.cls, color: t.color, caption: cap, open: t.open };
    });
    var KINDS = ['star', 'heart', 'plane', 'pin', 'sun', 'badge', 'ticket', 'tape', 'avion', 'note'];
    var pageStickers = page.stickers.map(function (st, k) {
      var o = { x: st.x, y: st.y, rot: st.rot, text: st.text || '', z: 10 + k, selected: s.decorating && s.selSticker === st.id,
        outline: (s.decorating && s.selSticker === st.id) ? '2px dashed #B82A5E' : 'none',
        down: function (e) {
          if (!s.decorating) return;
          e.stopPropagation();
          var r = e.currentTarget.parentNode.getBoundingClientRect(), sc = r.width / 358;
          self.setState({ drag: { id: st.id, dx: (e.clientX - r.left) / sc - st.x, dy: (e.clientY - r.top) / sc - st.y }, selSticker: st.id });
        },
        select: function (e) { e.stopPropagation(); if (s.decorating) self.setState({ selSticker: st.id }); },
        remove: function (e) { e.stopPropagation(); setPage({ bg: page.bg, stickers: page.stickers.filter(function (x) { return x.id !== st.id; }) }); self.setState({ selSticker: null }); }
      };
      KINDS.forEach(function (kk) { o['is_' + kk] = st.kind === kk; });
      return o;
    });
    var addSticker = function (kind, extra) {
      var id = 's' + s.nextS, n = page.stickers.length;
      var st = Object.assign({ id: id, kind: kind, x: 120 + (n * 37) % 140, y: 180 + (n * 53) % 260, rot: ((n * 7) % 17) - 8 }, extra || {});
      setPage({ bg: page.bg, stickers: page.stickers.concat([st]) });
      self.setState({ nextS: s.nextS + 1, selSticker: id });
    };
    var bgSwatches = ['paper', 'pink', 'grid', 'kraft'].map(function (k) {
      return { bg: BGS[k].bg, img: k === 'grid' ? BGS.grid.img : 'none', ring: page.bg === k ? TEAL : '#EFC9D5', label: k + ' page', pick: function () { setPage({ bg: k, stickers: page.stickers }); } };
    });
    var shareOptions = [
      { label: 'WhatsApp', bg: '#3BAA7A', fg: '#FFFFFF', icon: 'M4 20l1.5-4A8 8 0 1 1 8 18.5L4 20z', go: function () { self.setState({ sharing: false }); self.flash('Opening WhatsApp with your ' + selP.name + ' page…'); } },
      { label: 'Instagram story', bg: '#B82A5E', fg: '#FFFFFF', icon: 'M4 4h16v16H4z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M17 6.5h.01', go: function () { self.setState({ sharing: false }); self.flash('Story image ready to post.'); } },
      { label: 'Copy link', bg: '#5B8DEF', fg: '#FFFFFF', icon: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1 M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1', go: function () { self.setState({ sharing: false }); self.flash('Link copied. Anyone with it can view this page.'); } },
      { label: 'Save image', bg: '#FFC83D', fg: '#3B1D33', icon: 'M12 4v11 M7 10l5 5 5-5 M5 20h14', go: function () { self.setState({ sharing: false }); self.flash('Page saved to your photos.'); } }
    ];

    var SMAP = {"himachal": ["manali"], "rajasthan": ["jaipur", "udaipur"], "karnataka": ["hampi"], "goa": ["goa"], "kerala": ["kochi"], "puducherry": ["pondy"]};
    var STATE_KEYS = ["andhra", "arunachal", "assam", "bihar", "chhattisgarh", "goa", "gujarat", "haryana", "himachal", "jharkhand", "karnataka", "kerala", "mp", "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamilnadu", "telangana", "tripura", "up", "uttarakhand", "westbengal"], UT_KEYS = ["andaman", "chandigarh", "dnhdd", "delhi", "jk", "ladakh", "lakshadweep", "puducherry"];
    var SNAMES = {"andhra": "Andhra Pradesh", "arunachal": "Arunachal Pradesh", "assam": "Assam", "bihar": "Bihar", "chhattisgarh": "Chhattisgarh", "goa": "Goa", "gujarat": "Gujarat", "haryana": "Haryana", "himachal": "Himachal Pradesh", "jharkhand": "Jharkhand", "karnataka": "Karnataka", "kerala": "Kerala", "mp": "Madhya Pradesh", "maharashtra": "Maharashtra", "manipur": "Manipur", "meghalaya": "Meghalaya", "mizoram": "Mizoram", "nagaland": "Nagaland", "odisha": "Odisha", "punjab": "Punjab", "rajasthan": "Rajasthan", "sikkim": "Sikkim", "tamilnadu": "Tamil Nadu", "telangana": "Telangana", "tripura": "Tripura", "up": "Uttar Pradesh", "uttarakhand": "Uttarakhand", "westbengal": "West Bengal", "andaman": "Andaman & Nicobar", "chandigarh": "Chandigarh", "dnhdd": "Dadra, Nagar Haveli, Daman & Diu", "delhi": "Delhi", "jk": "Jammu & Kashmir", "ladakh": "Ladakh", "lakshadweep": "Lakshadweep", "puducherry": "Puducherry"};
    var stp = {}, passGot = 0, passUt = 0;
    STATE_KEYS.concat(UT_KEYS).forEach(function (k, idx) {
      var pids = (SMAP[k] || []).filter(function (pid) { return c[pid] > 0; });
      var on = pids.length > 0, pl = on ? self.place(pids[0]) : null;
      if (on) { if (UT_KEYS.indexOf(k) >= 0) passUt++; else passGot++; }
      var show = s.passFilter === 'got' ? on : s.passFilter === 'todo' ? !on : true;
      var mm = pl ? pl.month.split(' ') : ['', ''];
      stp[k] = { on: on, off: !on, show: show, status: on ? 'collected' : 'not collected yet',
        op: on ? 1 : 0.5, filter: on ? 'none' : 'grayscale(1)', rot: on ? ((idx * 7) % 9) - 4 : 0,
        shadow: on ? '0 5px 12px rgba(59,29,51,0.22)' : 'none', month: (mm[0] || '').toUpperCase(), year: mm[1] || '',
        tap: function () { if (on) self.setState({ screen: 'place', selected: pids[0] }); else self.flash('Add a memory in ' + SNAMES[k] + ' to collect this stamp.'); } };
    });
    var pfc = function (k) { var a = (s.passFilter || 'all') === k; return { border: a ? TEAL : '#E3B3C3', bg: a ? TEAL : '#FFFFFF', fg: a ? '#FFFFFF' : '#3B1D33' }; };
    var totalMem = PLACES.reduce(function (a, p) { return a + c[p.id]; }, 0) + s.unplaced.length;
    var stats = [{ value: pins.length, label: 'places', rot: -2 }, { value: totalMem, label: 'memories', rot: 1.5 }, { value: s.journeys.length, label: 'journeys', rot: -1 }];
    var mb = Math.round(totalMem * 2.6);
    var confirmTitle = s.confirm === 'account' ? 'Delete your account?' : 'Delete this memory?';
    var confirmBody = s.confirm === 'account' ? 'Your map, journeys and every photo and video will be deleted for good. This can’t be undone.' : 'It will be removed from your map and any journey. This can’t be undone.';
    var doneUp = Math.round(s.uploadPct / 100 * s.imp.total);
    var uploadThumbs = [0, 1, 2, 3, 4].map(function (k) { return { cls: '', color: GALLERY[k], opacity: (k + 1) * 20 <= s.uploadPct ? 1 : 0.35 }; });
    return {
      isOnboard1: on('onboard1'), isOnboard2: on('onboard2'), isMain: ['onboard1', 'onboard2', 'signIn', 'magic', 'camera'].indexOf(s.screen) < 0,
      isSignIn: on('signIn'), isMagic: on('magic'), isCamera: on('camera'), isPicker: on('picker'), isUploading: on('uploading'), isEdit: on('edit'), isProfile: on('profile'),
      isMap: on('map'), isPlace: on('place'), isViewer: on('viewer'), isImport: on('import'), isUnplaced: on('unplaced'),
      isJourneys: on('journeys'), isJourney: on('journey'), isNewJourney: on('newJourney'),
      locationOff: !s.locationOn,
      pins: pins, hasSelected: !!s.selected, sel: sel,
      selThumbs: this.thumbs(selP.id, Math.min(selCount, 4)),
      placeThumbs: this.thumbs(selP.id, Math.min(selCount, 15)),
      placeHasMore: selCount > 15, placeMore: selCount - 15,
      view: view,
      hasUnplaced: s.unplaced.length > 0, noUnplaced: s.unplaced.length === 0,
      unplacedLabel: s.unplaced.length + ' unplaced',
      unplacedItems: unplacedItems, selCountLabel: s.picked.length + ' of ' + s.unplaced.length + ' selected',
      query: s.query, suggestions: suggestions, cantPlace: cantPlace,
      placeBtnBg: cantPlace ? '#EAD3DB' : TEAL, placeBtnColor: cantPlace ? '#6E4A63' : '#ffffff',
      placeBtnLabel: cantPlace ? 'Select memories and a place' : ('Place ' + s.picked.length + ' at ' + choiceName),
      journeyCards: journeyCards, jd: jd,
      newName: s.newName, placeChips: placeChips, cantCreate: cantCreate,
      createBg: cantCreate ? '#EAD3DB' : TEAL, createColor: cantCreate ? '#6E4A63' : '#ffffff',
      createLabel: cantCreate ? 'Pick at least one place' : ('Create journey · ' + newTotal + ' memories'),
      showAdd: s.showAdd, hasToast: !!s.toast, toast: s.toast,
      zoom: z, mapW: Math.round(390 * z), mapH: Math.round(760 * z), zoomMax: z >= 3, zoomMin: z <= 1,
      setMapEl: function (el) { self._mapEl = el; },
      zoomIn: function () { self.zoomTo(Math.min(3, z + 0.5)); },
      zoomOut: function () { self.zoomTo(Math.max(1, z - 0.5)); },
      zoomReset: function () { self.zoomTo(1); },
      tabMap: tabIsMap ? TEAL : '#6E4A63', tabJourneys: tabIsJ ? TEAL : '#6E4A63', tabInbox: on('unplaced') ? TEAL : '#6E4A63', tabMe: (on('profile') || on('passport')) ? TEAL : '#6E4A63',
      unplacedCount: s.unplaced.length,
      isPassport: on('passport'), stp: stp, passGot: passGot, passUt: passUt, passPct: Math.round(passGot / 28 * 100),
      pfc_all: pfc('all'), pfc_got: pfc('got'), pfc_todo: pfc('todo'),
      pf_all: function () { self.setState({ passFilter: 'all' }); }, pf_got: function () { self.setState({ passFilter: 'got' }); }, pf_todo: function () { self.setState({ passFilter: 'todo' }); },
      goPassport: function () { self.setState({ screen: 'passport', passFrom: s.screen === 'passport' ? s.passFrom : s.screen }); },
      passBack: function () { self.setState({ screen: s.passFrom || 'profile' }); }, passBackLabel: (s.passFrom === 'journeys' ? 'Journeys' : 'Me'),
      scrapOn: s.view === 'scrap', gridOn: s.view !== 'scrap', scrapOnStr: s.view === 'scrap' ? 'true' : 'false', gridOnStr: s.view !== 'scrap' ? 'true' : 'false',
      scrapTabBg: s.view === 'scrap' ? TEAL : 'transparent', scrapTabFg: s.view === 'scrap' ? '#FFFFFF' : '#3B1D33',
      gridTabBg: s.view !== 'scrap' ? TEAL : 'transparent', gridTabFg: s.view !== 'scrap' ? '#FFFFFF' : '#3B1D33',
      showScrap: function () { self.setState({ view: 'scrap' }); }, showGrid: function () { self.setState({ view: 'grid', decorating: false }); },
      pg: pg, scrapPhotos: scrapPhotos, pageStickers: pageStickers, postmarkText: selP.name.toUpperCase().slice(0, 7),
      moreLabel: selCount > 5 ? ('Switch to Grid to see all ' + selCount + '.') : '',
      decorating: s.decorating && s.view === 'scrap', notDecorating: !s.decorating, placePadBottom: s.decorating ? 250 : 24,
      startDecorate: function () { self.setState({ decorating: true }); },
      doneDecorate: function () { self.setState({ decorating: false, selSticker: null }); self.flash('Page saved.'); },
      shuffleLayout: function () { self.setState({ layoutSeed: s.layoutSeed + 1 }); },
      deselect: function () { if (s.decorating) self.setState({ selSticker: null }); },
      onPageMove: function (e) {
        if (!s.drag) return;
        var r = e.currentTarget.getBoundingClientRect(), sc = r.width / 358;
        var x = Math.max(10, Math.min(348, (e.clientX - r.left) / sc - s.drag.dx)), y = Math.max(10, Math.min(570, (e.clientY - r.top) / sc - s.drag.dy));
        setPage({ bg: page.bg, stickers: page.stickers.map(function (st) { return st.id === s.drag.id ? Object.assign({}, st, { x: Math.round(x), y: Math.round(y) }) : st; }) });
      },
      onPageUp: function () { if (s.drag) self.setState({ drag: null }); },
      add_star: function () { addSticker('star'); }, add_heart: function () { addSticker('heart'); }, add_plane: function () { addSticker('plane'); }, add_pin: function () { addSticker('pin'); },
      add_sun: function () { addSticker('sun'); }, add_badge: function () { addSticker('badge'); }, add_ticket: function () { addSticker('ticket'); }, add_tape: function () { addSticker('tape'); },
      add_avion: function () { addSticker('avion'); },
      add_note: function () { var t = (s.noteDraft || '').trim() || 'wish we stayed longer'; addSticker('note', { text: t }); self.setState({ noteDraft: '' }); },
      noteDraft: s.noteDraft, onNote: function (e) { self.setState({ noteDraft: e.target.value.slice(0, 60) }); },
      bgSwatches: bgSwatches,
      showShare: s.sharing, openShare: function () { self.setState({ sharing: true, decorating: false }); }, closeShare: function () { self.setState({ sharing: false }); },
      shareOptions: shareOptions, collabStr: s.collab ? 'true' : 'false', collabBg: s.collab ? TEAL : '#D9B8C4', collabKnob: s.collab ? 23 : 3,
      toggleCollab: function () { var v = !s.collab; self.setState({ collab: v }); self.flash(v ? 'Friends with the link can add photos.' : 'Only you can add photos.'); },
      email: s.email, emailShown: s.email || 'aarohi@example.com',
      camLocation: s.locationOn ? 'Goa · accurate to 20 m' : 'Location off · goes to Unplaced',
      pickTiles: pickTiles, pickLabel: nPick + ' selected · up to 50', cantImport: cantImport, importLabel: cantImport ? 'Select photos to import' : ('Import ' + nPick + (nPick === 1 ? ' memory' : ' memories')),
      uploadPct: s.uploadPct, uploadLabel: doneUp + ' of ' + s.imp.total + ' added', uploadThumbs: uploadThumbs, imp: s.imp,
      editCaption: s.editCaption, captionCount: (s.editCaption || '').length, editPlaceChips: editPlaceChips, editJourneyChips: editJourneyChips,
      stats: stats, locationOnStr: s.locationOn ? 'true' : 'false', locationNote: s.locationOn ? 'On: new photos are pinned where you are' : 'Off: new photos go to Unplaced',
      toggleBg: s.locationOn ? TEAL : '#D9B8C4', knobLeft: s.locationOn ? 23 : 3,
      storageLabel: mb + ' MB of 1 GB', storagePct: Math.min(100, Math.round(mb / 10.24)),
      hasConfirm: !!s.confirm, confirmTitle: confirmTitle, confirmBody: confirmBody, confirmCta: s.confirm === 'account' ? 'Delete account' : 'Delete memory',
      onEmail: function (e) { self.setState({ email: e.target.value }); },
      sendLink: function () { self.setState({ screen: 'magic', email: s.email || 'aarohi@example.com' }); },
      openLink: function () { self.setState({ screen: 'map' }); self.flash('Welcome, Aarohi. Your map is ready.'); },
      socialSignIn: function () { self.setState({ screen: 'map', email: s.email || 'aarohi@example.com' }); self.flash('Signed in. Your map is ready.'); },
      backToSignIn: function () { self.setState({ screen: 'signIn' }); },
      openCamera: function () { self.setState({ screen: 'camera', showAdd: false }); },
      closeCamera: function () { self.setState({ screen: 'map' }); },
      openPicker: function () { self.setState({ screen: 'picker', showAdd: false, pickSel: [0,1,2,3,4,5,6,7,8,9,10,11] }); },
      closePicker: function () { self.setState({ screen: 'map' }); },
      pickAll: function () { self.setState({ pickSel: GALLERY.map(function (x, i) { return i; }) }); },
      startUpload: function () {
        if (cantImport) return;
        var miss = s.pickSel.filter(function (i) { return NOLOC.indexOf(i) >= 0; }).length, placed = nPick - miss;
        self.setState({ screen: 'uploading', uploadPct: 0, imp: { total: nPick, placed: placed, missing: miss } });
        clearInterval(self._u);
        self._u = setInterval(function () {
          var pct = Math.min(100, self.state.uploadPct + 10);
          if (pct < 100) { self.setState({ uploadPct: pct }); return; }
          clearInterval(self._u);
          var st = self.state, nc = Object.assign({}, st.counts);
          nc.goa = nc.goa + Math.ceil(placed / 2); nc.kochi = nc.kochi + Math.floor(placed / 2);
          var add = []; for (var q = 0; q < miss; q++) add.push('u' + (st.nextU + q));
          self.setState({ uploadPct: 100, counts: nc, unplaced: st.unplaced.concat(add), nextU: st.nextU + miss, screen: 'import' });
        }, 160);
      },
      cancelUpload: function () { clearInterval(self._u); self.setState({ screen: 'map' }); self.flash('Import cancelled. Nothing was added.'); },
      openEdit: function () {
        var vp = self.place(curPid), i = s.viewer ? s.viewer.i : 0;
        var j = s.journeys.filter(function (x) { return x.placeIds.indexOf(curPid) >= 0; })[0];
        self.setState({ screen: 'edit', editCaption: s.captions[curPid + '-' + i] || vp.captions[i % vp.captions.length], editPlace: curPid, editJourney: j ? j.id : null });
      },
      closeEdit: function () { self.setState({ screen: 'viewer' }); },
      onCaption: function (e) { self.setState({ editCaption: e.target.value.slice(0, 280) }); },
      saveEdit: function () {
        var i = s.viewer ? s.viewer.i : 0, caps = Object.assign({}, s.captions), nc = Object.assign({}, c), v = s.viewer;
        if (s.editPlace && s.editPlace !== curPid) { nc[curPid] = Math.max(0, nc[curPid] - 1); v = { pid: s.editPlace, i: nc[s.editPlace] }; nc[s.editPlace] = nc[s.editPlace] + 1; }
        caps[v.pid + '-' + v.i] = s.editCaption;
        self.setState({ captions: caps, counts: nc, viewer: v, selected: v.pid, screen: 'viewer' });
        self.flash('Changes saved.');
      },
      askDeleteMemory: function () { self.setState({ confirm: 'memory' }); },
      askDeleteAccount: function () { self.setState({ confirm: 'account' }); },
      cancelConfirm: function () { self.setState({ confirm: null }); },
      doConfirm: function () {
        if (s.confirm === 'account') { var fresh = JSON.parse(JSON.stringify(self._initial)); self.setState(fresh); return; }
        var nc = Object.assign({}, c); nc[curPid] = Math.max(0, nc[curPid] - 1);
        self.setState({ counts: nc, confirm: null, screen: nc[curPid] > 0 ? 'place' : 'map', selected: nc[curPid] > 0 ? curPid : null });
        self.flash('Memory deleted.');
      },
      goProfile: function () { self.setState({ screen: 'profile', showAdd: false }); },
      toggleLocation: function () { var v = !s.locationOn; self.setState({ locationOn: v }); self.flash(v ? 'Location on. New photos will be pinned.' : 'Location off. New photos go to Unplaced.'); },
      signOut: function () { self.setState({ screen: 'signIn' }); },

      goOnboard2: function () { self.setState({ screen: 'onboard2' }); },
      allowLocation: function () { self.setState({ screen: 'signIn', locationOn: true }); },
      skipLocation: function () { self.setState({ screen: 'signIn', locationOn: false }); },
      goMap: function () { self.setState({ screen: 'map', showAdd: false }); },
      goPlace: function () { self.setState({ screen: 'place' }); },
      goUnplaced: function () { self.setState({ screen: 'unplaced', picked: [], choice: null, query: '', showAdd: false }); },
      goJourneys: function () { self.setState({ screen: 'journeys', showAdd: false }); },
      goNewJourney: function () { self.setState({ screen: 'newJourney', newName: '', newPlaces: [] }); },
      closePreview: function () { self.setState({ selected: null }); },
      closeViewer: function () { self.setState({ screen: s.back }); },
      openAdd: function () { self.setState({ showAdd: true }); },
      closeAdd: function () { self.setState({ showAdd: false }); },
      capture: function () {
        if (s.locationOn) {
          var nc = Object.assign({}, c); nc.goa = nc.goa + 1;
          self.setState({ counts: nc, showAdd: false, screen: 'map', selected: 'goa' });
          self.flash('Photo saved and pinned to Goa, your current location.');
        } else {
          self.setState({ unplaced: s.unplaced.concat(['u' + s.nextU]), nextU: s.nextU + 1, showAdd: false, screen: 'map' });
          self.flash('Photo saved to Unplaced. Location is off.');
        }
      },
      importGallery: function () {
        var nc = Object.assign({}, c); nc.goa = nc.goa + 4; nc.kochi = nc.kochi + 5;
        var add = ['u' + s.nextU, 'u' + (s.nextU + 1), 'u' + (s.nextU + 2)];
        self.setState({ counts: nc, unplaced: s.unplaced.concat(add), nextU: s.nextU + 3, showAdd: false, screen: 'import' });
      },
      selectAll: function () { self.setState({ picked: s.unplaced.slice() }); },
      onQuery: function (e) { self.setState({ query: e.target.value }); },
      confirmPlace: function () {
        if (cantPlace) return;
        var n = s.picked.length, nc = Object.assign({}, c); nc[s.choice] = nc[s.choice] + n;
        var left = s.unplaced.filter(function (x) { return s.picked.indexOf(x) < 0; });
        var name = choiceName;
        self.setState({ counts: nc, unplaced: left, picked: [], choice: null, query: '', screen: left.length ? 'unplaced' : 'map', selected: left.length ? s.selected : s.choice });
        self.flash(n + (n === 1 ? ' memory' : ' memories') + ' placed at ' + name + '.');
      },
      onName: function (e) { self.setState({ newName: e.target.value }); },
      createJourney: function () {
        if (cantCreate) return;
        var id = 'j' + Date.now();
        var first = self.place(s.newPlaces[0]);
        var j = { id: id, title: s.newName.trim() || 'Untitled journey', dates: first.month, placeIds: s.newPlaces.slice(), dayLabels: [] };
        self.setState({ journeys: [j].concat(s.journeys), journeyId: id, screen: 'journey' });
        self.flash('Journey created.');
      }
    };
  }
}
