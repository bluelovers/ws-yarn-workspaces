"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._unshiftArray = exports.requireResolveExtra = exports.importExtra = exports.requireExtra = exports.isErrorModuleNotFound = exports.handleOptionsPaths = exports.requireResolveCore = exports.SymbolModuleMain = exports.SymbolGlobalYarn = exports.SymbolGlobalNpm = exports.SymbolGlobal = exports.SymbolCurrentDirectory = void 0;
const global_dirs_1 = require("global-dirs");
const defaultMap = {
    tsdx: 'tsdx/dist/index',
};
exports.SymbolCurrentDirectory = Symbol.for('cwd');
exports.SymbolGlobal = Symbol.for('global');
exports.SymbolGlobalNpm = Symbol.for('npm');
exports.SymbolGlobalYarn = Symbol.for('yarn');
exports.SymbolModuleMain = Symbol.for('module.main');
function requireResolveCore(name, options) {
    var _a, _b, _c, _d;
    options !== null && options !== void 0 ? options : (options = {});
    const target = (_c = (_b = (_a = options.map) === null || _a === void 0 ? void 0 : _a[name]) !== null && _b !== void 0 ? _b : defaultMap[name]) !== null && _c !== void 0 ? _c : name;
    let paths = options.paths;
    if (options.includeGlobal) {
        paths = paths !== null && paths !== void 0 ? paths : [];
        if (Array.isArray(options.includeGlobal)) {
            (options.includeGlobal)
                .forEach(value => {
                switch (value) {
                    case exports.SymbolGlobalYarn:
                    case exports.SymbolGlobalNpm:
                    case exports.SymbolCurrentDirectory:
                    case exports.SymbolGlobal:
                    case exports.SymbolModuleMain:
                        _unshiftArray(paths, value);
                        break;
                }
            });
        }
        else {
            _unshiftArray(paths, exports.SymbolGlobal);
        }
    }
    if (options.includeCurrentDirectory) {
        _unshiftArray(paths, exports.SymbolCurrentDirectory);
    }
    return ((_d = options.require) !== null && _d !== void 0 ? _d : require).resolve(target, {
        ...options,
        paths: handleOptionsPaths(paths, options.cwd),
    });
}
exports.requireResolveCore = requireResolveCore;
function handleOptionsPaths(paths, cwd) {
    if (paths === null || paths === void 0 ? void 0 : paths.length) {
        paths = paths.reduce((paths, value) => {
            switch (value) {
                case exports.SymbolGlobal:
                    paths.push(global_dirs_1.yarn.packages);
                    paths.push(global_dirs_1.npm.packages);
                    break;
                case exports.SymbolCurrentDirectory:
                    paths.push(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
                    break;
                case exports.SymbolGlobalNpm:
                    paths.push(global_dirs_1.npm.packages);
                    break;
                case exports.SymbolGlobalYarn:
                    paths.push(global_dirs_1.yarn.packages);
                    break;
                case exports.SymbolModuleMain:
                    if (typeof module !== 'undefined' && require.main !== module) {
                        paths.push(require.main.path);
                    }
                    break;
                default:
                    if (value !== null && value !== void 0 ? value : false) {
                        paths.push(value);
                    }
            }
            return paths;
        }, []);
    }
    if (!(paths === null || paths === void 0 ? void 0 : paths.length)) {
        paths = void 0;
    }
    return paths;
}
exports.handleOptionsPaths = handleOptionsPaths;
function isErrorModuleNotFound(error) {
    return error.code === 'MODULE_NOT_FOUND';
}
exports.isErrorModuleNotFound = isErrorModuleNotFound;
function requireExtra(name, options) {
    return require(requireResolveCore(name, options));
}
exports.requireExtra = requireExtra;
function importExtra(name, options) {
    return Promise.resolve().then(() => __importStar(require(requireResolveCore(name, options))));
}
exports.importExtra = importExtra;
function requireResolveExtra(name, options) {
    let error;
    let result;
    try {
        result = requireResolveCore(name, options);
        return {
            result,
            error,
        };
    }
    catch (e) {
        error = e;
        if (isErrorModuleNotFound(error)) {
            return {
                result,
                error,
            };
        }
        throw error;
    }
}
exports.requireResolveExtra = requireResolveExtra;
function _unshiftArray(array, item) {
    (array[0] !== item) && array.unshift(item);
    return array;
}
exports._unshiftArray = _unshiftArray;
exports.default = requireResolveExtra;
//# sourceMappingURL=index.js.map