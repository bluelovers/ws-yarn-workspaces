"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolModuleMain = exports.SymbolGlobalYarn = exports.SymbolGlobalNpm = exports.SymbolGlobal = exports.SymbolCurrentDirectory = void 0;
exports.getPathsByType = getPathsByType;
const global_dirs_1 = require("global-dirs");
const SymbolCurrentDirectory = Symbol.for('cwd');
exports.SymbolCurrentDirectory = SymbolCurrentDirectory;
/**
 * SymbolGlobalYarn + SymbolGlobalNpm
 */
const SymbolGlobal = Symbol.for('global');
exports.SymbolGlobal = SymbolGlobal;
const SymbolGlobalNpm = Symbol.for('npm');
exports.SymbolGlobalNpm = SymbolGlobalNpm;
const SymbolGlobalYarn = Symbol.for('yarn');
exports.SymbolGlobalYarn = SymbolGlobalYarn;
const SymbolModuleMain = Symbol.for('module.main');
exports.SymbolModuleMain = SymbolModuleMain;
function getPathsByType(valueType, cwd) {
    const paths = [];
    switch (valueType) {
        case SymbolGlobal:
            paths.push(global_dirs_1.yarn.packages);
            paths.push(global_dirs_1.npm.packages);
            break;
        case SymbolCurrentDirectory:
            paths.push(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
            break;
        case SymbolGlobalNpm:
            paths.push(global_dirs_1.npm.packages);
            break;
        case SymbolGlobalYarn:
            paths.push(global_dirs_1.yarn.packages);
            break;
        case SymbolModuleMain:
            if (typeof module !== 'undefined' && require.main !== module) {
                paths.push(require.main.path);
            }
            break;
        default:
            throw new TypeError(`Not supported type: ${valueType}`);
    }
    return paths;
}
exports.default = getPathsByType;
//# sourceMappingURL=index.js.map