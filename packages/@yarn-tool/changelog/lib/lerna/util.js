"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = void 0;
const lodash_1 = require("lodash");
function handleOptions(options) {
    options = lodash_1.defaults(options !== null && options !== void 0 ? options : {}, {
        type: 'independent',
        changelogPreset: '@bluelovers/conventional-changelog-bluelovers',
        tagPrefix: 'v',
    });
    if (!options.changelogPreset) {
        options.changelogPreset = tryRequire('@bluelovers/conventional-changelog-bluelovers') ? '@bluelovers/conventional-changelog-bluelovers' : 'conventional-changelog-angular';
    }
    return options;
}
exports.handleOptions = handleOptions;
function tryRequire(name) {
    try {
        return require.resolve(name);
    }
    catch (err) {
        if (err.code !== "MODULE_NOT_FOUND") {
            throw new err;
        }
    }
}
//# sourceMappingURL=util.js.map