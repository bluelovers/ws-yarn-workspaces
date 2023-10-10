"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const get_paths_by_type_1 = require("@yarn-tool/get-paths-by-type");
Object.defineProperty(exports, "SymbolCurrentDirectory", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolCurrentDirectory; } });
Object.defineProperty(exports, "SymbolGlobal", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolGlobal; } });
Object.defineProperty(exports, "SymbolGlobalNpm", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolGlobalNpm; } });
Object.defineProperty(exports, "SymbolGlobalYarn", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolGlobalYarn; } });
Object.defineProperty(exports, "SymbolModuleMain", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolModuleMain; } });
const defaultMap = {
    tsdx: 'tsdx/dist/index',
};
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
                    case get_paths_by_type_1.SymbolGlobalYarn:
                    case get_paths_by_type_1.SymbolGlobalNpm:
                    case get_paths_by_type_1.SymbolCurrentDirectory:
                    case get_paths_by_type_1.SymbolGlobal:
                    case get_paths_by_type_1.SymbolModuleMain:
                        _unshiftArray(paths, value);
                        break;
                }
            });
        }
        else {
            _unshiftArray(paths, get_paths_by_type_1.SymbolGlobal);
        }
    }
    if (options.includeCurrentDirectory) {
        _unshiftArray(paths, get_paths_by_type_1.SymbolCurrentDirectory);
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
                case get_paths_by_type_1.SymbolGlobal:
                case get_paths_by_type_1.SymbolCurrentDirectory:
                case get_paths_by_type_1.SymbolGlobalNpm:
                case get_paths_by_type_1.SymbolGlobalYarn:
                case get_paths_by_type_1.SymbolModuleMain:
                    paths.push(...(0, get_paths_by_type_1.getPathsByType)(value, cwd));
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
    return Promise.resolve(`${requireResolveCore(name, options)}`).then(s => __importStar(require(s)));
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