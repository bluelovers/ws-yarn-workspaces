import { sortObjectKeys as r } from "sort-object-keys2";

import e from "is-plain-obj";

function isPackageJsonExportsEntryObject(r) {
  return e(r);
}

function _handleOptions(r) {
  const e = [ "types", "require", "import", "node", "node-addons" ], o = [ ...e, "default", ".", "./", "./package.json" ];
  var t, n;
  return r && (null !== (t = r.rootOrder) && void 0 !== t && t.length && e.splice(0, 0, ...r.rootOrder), 
  null !== (n = r.entryOrder) && void 0 !== n && n.length && o.splice(0, 0, ...r.entryOrder)), 
  {
    rootOrder: e,
    entryOrder: o
  };
}

function sortPackageJsonExports(e, o) {
  if (isPackageJsonExportsEntryObject(e)) {
    const {rootOrder: t, entryOrder: n} = _handleOptions(o);
    r(e, {
      keys: t,
      useSource: !0
    }), Object.keys(e).forEach((o => {
      const t = e[o];
      isPackageJsonExportsEntryObject(t) && (e[o] = r(t, {
        keys: n,
        useSource: !0
      }));
    }));
  }
  return e;
}

export { _handleOptions, sortPackageJsonExports as default, isPackageJsonExportsEntryObject, sortPackageJsonExports };
//# sourceMappingURL=index.esm.mjs.map
