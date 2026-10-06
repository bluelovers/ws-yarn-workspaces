"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependenciesIfNotExists = exports.addDependencies = exports._add_to_deps_field = void 0;
/**
 * 依賴寫入函式的再匯出 (Re-exports of the dependency write helpers)
 *
 * 這些函式實際實作於 `@yarn-tool/pkg-deps-add`；此處再匯出是為了讓既有使用端
 * 可繼續以 `pkg-deps-util` 的路徑存取，維持向後相容。
 *
 * The functions live in `@yarn-tool/pkg-deps-add`; re-exporting them keeps the
 * old `pkg-deps-util` import paths working for existing consumers.
 */
var pkg_deps_add_1 = require("@yarn-tool/pkg-deps-add");
Object.defineProperty(exports, "_add_to_deps_field", { enumerable: true, get: function () { return pkg_deps_add_1._add_to_deps_field; } });
Object.defineProperty(exports, "addDependencies", { enumerable: true, get: function () { return pkg_deps_add_1.addDependencies; } });
Object.defineProperty(exports, "addDependenciesIfNotExists", { enumerable: true, get: function () { return pkg_deps_add_1.addDependenciesIfNotExists; } });
//# sourceMappingURL=addDependenciesIfNotExists.js.map