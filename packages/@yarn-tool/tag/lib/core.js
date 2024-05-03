"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports.formatPackageTag = formatPackageTag;
function handleOptions(options) {
    var _a, _b, _c;
    let version = (_a = options.version) !== null && _a !== void 0 ? _a : options.pkg.version;
    let cwd = options.cwd || process.cwd();
    if (!(version === null || version === void 0 ? void 0 : version.length)) {
        throw new Error(`tag version must be provided`);
    }
    let tag = version;
    let tagPrefix = (_b = options.tagPrefix) !== null && _b !== void 0 ? _b : '';
    let name = (_c = options.name) !== null && _c !== void 0 ? _c : options.pkg.name;
    if (!options.excludeName && !(name === null || name === void 0 ? void 0 : name.length)) {
        throw new Error(`pkg name must be provided`);
    }
    return {
        ...options,
        cwd,
        name,
        version,
        tagPrefix,
    };
}
function formatPackageTag(options) {
    var _a, _b, _c;
    let tag = (_a = options.version) !== null && _a !== void 0 ? _a : options.pkg.version;
    if (!(tag === null || tag === void 0 ? void 0 : tag.length)) {
        throw new Error(`tag version must be provided`);
    }
    if (((_b = options.tagPrefix) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        tag = `${options.tagPrefix}${tag}`;
    }
    if (!options.excludeName) {
        let name = (_c = options.name) !== null && _c !== void 0 ? _c : options.pkg.name;
        if (!(name === null || name === void 0 ? void 0 : name.length)) {
            throw new Error(`pkg name must be provided`);
        }
        tag = `${name}@${tag}`;
    }
    return tag;
}
//# sourceMappingURL=core.js.map