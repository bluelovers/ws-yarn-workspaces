"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonExports = void 0;
const tslib_1 = require("tslib");
const sort_object_keys2_1 = (0, tslib_1.__importDefault)(require("sort-object-keys2"));
const is_plain_obj_1 = (0, tslib_1.__importDefault)(require("is-plain-obj"));
function sortPackageJsonExports(exports) {
    if ((0, is_plain_obj_1.default)(exports)) {
        (0, sort_object_keys2_1.default)(exports, {
            keys: [
                'types',
                'require',
                'import',
                'node',
                'default',
                '.',
                './',
            ],
            useSource: true,
        });
        Object.keys(exports)
            .forEach(key => {
            let value = exports[key];
            if ((key === '.' || key.startsWith('./')) && (0, is_plain_obj_1.default)(value)) {
                exports[key] = (0, sort_object_keys2_1.default)(value, {
                    keys: [
                        'types',
                        'import',
                        'require',
                    ],
                    useSource: true,
                });
            }
        });
    }
    return exports;
}
exports.sortPackageJsonExports = sortPackageJsonExports;
//# sourceMappingURL=sort-exports.js.map