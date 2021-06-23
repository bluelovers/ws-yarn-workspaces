"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBuiltinModule = exports.builtins = exports.createNewIsBuiltinModule = void 0;
const tslib_1 = require("tslib");
const builtins_1 = (0, tslib_1.__importDefault)(require("builtins"));
function createNewIsBuiltinModule(options) {
    const builtins = (0, builtins_1.default)(options === null || options === void 0 ? void 0 : options.targetNodeJSVersion);
    return {
        builtins,
        isBuiltinModule(moduleName) {
            if (typeof moduleName !== 'string') {
                throw new TypeError('Expected a string');
            }
            return builtins.includes(moduleName);
        },
    };
}
exports.createNewIsBuiltinModule = createNewIsBuiltinModule;
const { builtins, isBuiltinModule, } = createNewIsBuiltinModule();
exports.builtins = builtins;
exports.isBuiltinModule = isBuiltinModule;
exports.default = isBuiltinModule;
//# sourceMappingURL=index.js.map