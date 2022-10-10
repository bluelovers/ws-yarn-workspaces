"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonExports = exports.isPackageJsonExportsEntryObject = void 0;
const tslib_1 = require("tslib");
const sort_object_keys2_1 = require("sort-object-keys2");
const is_plain_obj_1 = tslib_1.__importDefault(require("is-plain-obj"));
function isPackageJsonExportsEntryObject(exports) {
    return (0, is_plain_obj_1.default)(exports);
}
exports.isPackageJsonExportsEntryObject = isPackageJsonExportsEntryObject;
function sortPackageJsonExports(exports) {
    if (isPackageJsonExportsEntryObject(exports)) {
        const _order = [
            'types',
            'require',
            'import',
            'node',
            'node-addons',
        ];
        const _order_root = [
            ..._order,
            'default',
            '.',
            './',
        ];
        (0, sort_object_keys2_1.sortObjectKeys)(exports, {
            keys: _order_root,
            useSource: true,
        });
        Object.keys(exports)
            .forEach(key => {
            let value = exports[key];
            if ((key === '.' || key.startsWith('./')) && isPackageJsonExportsEntryObject(value)) {
                exports[key] = (0, sort_object_keys2_1.sortObjectKeys)(value, {
                    keys: _order,
                    useSource: true,
                });
            }
        });
    }
    return exports;
}
exports.sortPackageJsonExports = sortPackageJsonExports;
//# sourceMappingURL=sort-exports.js.map