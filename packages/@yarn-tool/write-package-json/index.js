"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputPackageJSON = exports.writePackageJSON = exports.outputPackageJSONSync = exports.writePackageJSONSync = exports._handleOptions = void 0;
const fs_json_1 = require("@bluelovers/fs-json");
function _handleOptions(options) {
    // @ts-ignore
    let { spaces = 2, finalEOL = false } = options;
    return {
        // @ts-ignore
        ...options,
        spaces,
        finalEOL,
    };
}
exports._handleOptions = _handleOptions;
function writePackageJSONSync(file, data, options = {}) {
    return (0, fs_json_1.writeJSONSync)(file, data, _handleOptions(options));
}
exports.writePackageJSONSync = writePackageJSONSync;
function outputPackageJSONSync(file, data, options = {}) {
    return (0, fs_json_1.outputJSONSync)(file, data, _handleOptions(options));
}
exports.outputPackageJSONSync = outputPackageJSONSync;
function writePackageJSON(file, data, options = {}) {
    return (0, fs_json_1.writeJSON)(file, data, _handleOptions(options));
}
exports.writePackageJSON = writePackageJSON;
function outputPackageJSON(file, data, options = {}) {
    return (0, fs_json_1.outputJSON)(file, data, _handleOptions(options));
}
exports.outputPackageJSON = outputPackageJSON;
exports.default = writePackageJSONSync;
//# sourceMappingURL=index.js.map