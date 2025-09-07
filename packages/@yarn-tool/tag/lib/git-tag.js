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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitPackageTag = gitPackageTag;
const core_1 = require("./core");
const tag_1 = require("@git-lazy/tag");
const path_is_same_1 = require("path-is-same");
const find_root_1 = require("@yarn-tool/find-root");
const path_1 = require("path");
async function gitPackageTag(options, spawnOptions) {
    var _a, _b;
    let cwd = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    let rootData = (0, find_root_1.findRoot)({
        cwd,
    });
    if (rootData.hasWorkspace && rootData.isWorkspace) {
        throw new Error(`disallow create git tag for workspace root`);
    }
    else if (!(0, path_is_same_1.pathIsSame)(rootData.pkg, cwd)) {
        throw new Error(`cwd must be same as package dir\n${rootData.pkg}\n${cwd}`);
    }
    if (!options.pkg) {
        options.pkg = await Promise.resolve(`${(0, path_1.join)(rootData.pkg, 'package.json')}`).then(s => __importStar(require(s))).then(m => m.default || m);
    }
    cwd = options.cwd = rootData.pkg;
    options = (0, core_1.handleOptions)(options);
    const tag = (0, core_1.formatPackageTag)(options);
    options.message = (_b = options.message) !== null && _b !== void 0 ? _b : tag;
    spawnOptions = {
        ...spawnOptions,
        cwd,
    };
    return (0, tag_1.gitTag)(tag, options, spawnOptions);
}
exports.default = gitPackageTag;
//# sourceMappingURL=git-tag.js.map