"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("sort-object-keys2"), r = require("is-plain-obj");

function isPackageJsonExportsEntryObject(e) {
  return r(e);
}

function _handleOptions(e) {
  const r = [ "types", "require", "import", "node", "node-addons" ], t = [ ...r, "default", ".", "./", "./package.json" ];
  var o, s;
  return e && (null !== (o = e.rootOrder) && void 0 !== o && o.length && r.splice(0, 0, ...e.rootOrder), 
  null !== (s = e.entryOrder) && void 0 !== s && s.length && t.splice(0, 0, ...e.entryOrder)), 
  {
    rootOrder: r,
    entryOrder: t
  };
}

function sortPackageJsonExports(r, t) {
  if (isPackageJsonExportsEntryObject(r)) {
    const {rootOrder: o, entryOrder: s} = _handleOptions(t);
    e.sortObjectKeys(r, {
      keys: o,
      useSource: !0
    }), Object.keys(r).forEach((t => {
      const o = r[t];
      isPackageJsonExportsEntryObject(o) && (r[t] = e.sortObjectKeys(o, {
        keys: s,
        useSource: !0
      }));
    }));
  }
  return r;
}

exports._handleOptions = _handleOptions, exports.default = sortPackageJsonExports, 
exports.isPackageJsonExportsEntryObject = isPackageJsonExportsEntryObject, exports.sortPackageJsonExports = sortPackageJsonExports;
//# sourceMappingURL=index.cjs.production.min.cjs.map
