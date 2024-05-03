"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleOptions = _handleOptions;
exports.writePackageJSONSync = writePackageJSONSync;
exports.outputPackageJSONSync = outputPackageJSONSync;
exports.writePackageJSON = writePackageJSON;
exports.outputPackageJSON = outputPackageJSON;
const fs_json_1 = require("@bluelovers/fs-json");
function _handleOptions(options) {
    // @ts-ignore
    let { spaces = 2, finalEOL = true } = options;
    return {
        // @ts-ignore
        ...options,
        spaces,
        finalEOL,
    };
}
function writePackageJSONSync(file, data, options = {}) {
    return (0, fs_json_1.writeJSONSync)(file, data, _handleOptions(options));
}
function outputPackageJSONSync(file, data, options = {}) {
    return (0, fs_json_1.outputJSONSync)(file, data, _handleOptions(options));
}
function writePackageJSON(file, data, options = {}) {
    return (0, fs_json_1.writeJSON)(file, data, _handleOptions(options));
}
function outputPackageJSON(file, data, options = {}) {
    return (0, fs_json_1.outputJSON)(file, data, _handleOptions(options));
}
exports.default = writePackageJSONSync;
//# sourceMappingURL=index.js.map