"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = void 0;
const lodash_1 = require("lodash");
const require_resolve_1 = require("@yarn-tool/require-resolve");
const path_1 = require("path");
function handleOptions(options) {
    var _a, _b;
    const defaultChangelogPreset = '@bluelovers/conventional-changelog-bluelovers';
    options = (0, lodash_1.defaults)(options !== null && options !== void 0 ? options : {}, {
        type: 'independent',
        changelogPreset: void 0,
        tagPrefix: 'v',
    });
    if (typeof options.type !== 'string' || !options.type.length) {
        options.type = 'independent';
    }
    if (typeof options.tagPrefix !== 'string') {
        options.tagPrefix = 'v';
    }
    if (typeof options.changelogPreset !== 'string' || !options.changelogPreset.length || !Boolean(options.changelogPreset)) {
        options.changelogPreset = void 0;
    }
    if (!options.changelogPreset || options.changelogPreset === defaultChangelogPreset) {
        options.changelogPreset = (_a = (0, require_resolve_1.requireResolveExtra)(defaultChangelogPreset, {
            includeGlobal: true,
            includeCurrentDirectory: true,
            paths: [
                (0, path_1.join)(__dirname, '../..'),
            ],
        }).result) !== null && _a !== void 0 ? _a : options.changelogPreset;
    }
    (_b = options.changelogPreset) !== null && _b !== void 0 ? _b : (options.changelogPreset = 'conventional-changelog-angular');
    return options;
}
exports.handleOptions = handleOptions;
function tryRequire(name) {
    try {
        return (0, require_resolve_1.requireResolveCore)(name, {
            includeGlobal: true,
            includeCurrentDirectory: true,
        });
    }
    catch (err) {
        if (err.code !== "MODULE_NOT_FOUND") {
            throw new err;
        }
    }
}
//# sourceMappingURL=util.js.map