'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sortObjectKeys2 = require('sort-object-keys2');
var isPlainObject = require('is-plain-obj');

function isPackageJsonExportsEntryObject(exports) {
  return isPlainObject(exports);
}
function _handleOptions(options) {
  const rootOrder = ['types', 'require', 'import', 'node', 'node-addons'];
  const entryOrder = [...rootOrder, 'default', '.', './', './package.json'];
  if (options) {
    var _options$rootOrder, _options$entryOrder;
    if ((_options$rootOrder = options.rootOrder) !== null && _options$rootOrder !== void 0 && _options$rootOrder.length) {
      rootOrder.splice(0, 0, ...options.rootOrder);
    }
    if ((_options$entryOrder = options.entryOrder) !== null && _options$entryOrder !== void 0 && _options$entryOrder.length) {
      entryOrder.splice(0, 0, ...options.entryOrder);
    }
  }
  return {
    rootOrder,
    entryOrder
  };
}
function sortPackageJsonExports(exports, options) {
  if (isPackageJsonExportsEntryObject(exports)) {
    const {
      rootOrder,
      entryOrder
    } = _handleOptions(options);
    sortObjectKeys2.sortObjectKeys(exports, {
      keys: rootOrder,
      useSource: true
    });
    Object.keys(exports).forEach(key => {
      const value = exports[key];
      if (isPackageJsonExportsEntryObject(value)) {
        exports[key] = sortObjectKeys2.sortObjectKeys(value, {
          keys: entryOrder,
          useSource: true
        });
      }
    });
  }
  return exports;
}

exports._handleOptions = _handleOptions;
exports.default = sortPackageJsonExports;
exports.isPackageJsonExportsEntryObject = isPackageJsonExportsEntryObject;
exports.sortPackageJsonExports = sortPackageJsonExports;
//# sourceMappingURL=index.cjs.development.cjs.map
