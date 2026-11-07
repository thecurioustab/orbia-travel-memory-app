/* Small template renderer for the ORBIA prototype.
   Turns the screen template (<template id="screens">) into Preact elements
   on every render. Supports {{path}} holes, <sc-if>, <sc-for>, events and refs. */
(function () {
  var h = preact.h, Fragment = preact.Fragment;
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;
  var EVENT_FIX = { ondoubleclick: 'ondblclick' };

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return parseFloat(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function attrValue(raw, scope) {
    var m = raw.match(WHOLE);
    return m ? lookup(m[1], scope) : interp(raw, scope);
  }
  function child(scope, extra) {
    var s = Object.create(scope);
    for (var k in extra) s[k] = extra[k];
    return s;
  }

  function convert(node, scope, key) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      return t.indexOf('{{') < 0 ? t : interp(t, scope);
    }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === 'sc-if') {
      if (!attrValue(node.getAttribute('value') || '', scope)) return null;
      return h(Fragment, { key: key }, kids(node, scope));
    }
    if (tag === 'sc-for') {
      var list = attrValue(node.getAttribute('list') || '', scope) || [];
      var as = node.getAttribute('as') || 'item';
      return h(Fragment, { key: key }, list.map(function (item, i) {
        var extra = { $index: i }; extra[as] = item;
        return h(Fragment, { key: (item && item.id) || i }, kids(node, child(scope, extra)));
      }));
    }
    var props = { key: key };
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i], name = a.name;
      if (name.indexOf('hint-') === 0) continue;
      var val = attrValue(a.value, scope);
      if (name.length > 2 && name[0] === 'o' && name[1] === 'n') {
        var lname = name.toLowerCase();
        if (lname === 'onchange' && (tag === 'input' || tag === 'textarea')) lname = 'oninput';
        props[EVENT_FIX[lname] || lname] = typeof val === 'function' ? val : undefined;
      } else if (name === 'ref') {
        if (typeof val === 'function') props.ref = val;
      } else {
        if (val === false || val == null) continue;
        props[name] = val;
      }
    }
    return h(tag, props, kids(node, scope));
  }
  function kids(node, scope) {
    var out = [], c = node.childNodes;
    for (var i = 0; i < c.length; i++) {
      var v = convert(c[i], scope, i);
      if (v !== null && v !== '') out.push(v);
    }
    return out;
  }

  /* Minimal component base: state, setState, lifecycle. */
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch, cb) {
    var p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, p);
    this.__schedule(cb);
  };
  DCLogic.prototype.forceUpdate = function (cb) { this.__schedule(cb); };
  DCLogic.prototype.__schedule = function (cb) {
    var self = this;
    if (cb) (self.__cbs = self.__cbs || []).push(cb);
    if (self.__pending) return;
    self.__pending = true;
    Promise.resolve().then(function () { self.__pending = false; self.__render(); });
  };
  DCLogic.prototype.__render = function () {
    var prev = this.__prevState;
    preact.render(h(Fragment, null, kids(this.__tpl, this.renderVals())), this.__root);
    var first = !this.__mounted;
    this.__mounted = true;
    this.__prevState = this.state;
    if (first) { if (this.componentDidMount) this.componentDidMount(); }
    else if (this.componentDidUpdate) this.componentDidUpdate(this.props, prev);
    var cbs = this.__cbs || []; this.__cbs = [];
    cbs.forEach(function (f) { f(); });
  };
  window.DCLogic = DCLogic;

  window.mountScreens = function (Component, tplEl, root, props) {
    var c = new Component(props || {});
    c.__tpl = tplEl.content;
    c.__root = root;
    c.__render();
    return c;
  };
})();
