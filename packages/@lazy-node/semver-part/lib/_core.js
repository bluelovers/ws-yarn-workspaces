"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionToParts = exports.partsToVersion = exports._part = exports._version = exports._versionUnsafe = void 0;
function _versionUnsafe(part, defaultValue) {
    var _a;
    return `0.0.${(_a = part !== null && part !== void 0 ? part : defaultValue) !== null && _a !== void 0 ? _a : 0}`;
}
exports._versionUnsafe = _versionUnsafe;
function _version(part1) {
    if (/^\d+\.\d+\./.test(part1)) {
        return part1;
    }
    else if (/^\d+\.(?:[^\.]+)$/.test(part1)) {
        return '0.' + part1;
    }
    return _versionUnsafe(part1);
}
exports._version = _version;
function _part(part1, part2) {
    if (/^\d+\.\d+\./.test(part1) && /^\d+\.\d+\./.test(part2)) {
        return [part1, part2];
    }
    else if (/^\d+\.(?:[^\.]+)$/.test(part1) && /^\d+\.(?:[^\.]+)$/.test(part2)) {
        return ['0.' + part1, '0.' + part2];
    }
    return [_versionUnsafe(part1), _versionUnsafe(part2)];
}
exports._part = _part;
function partsToVersion(parts) {
    return parts.join('.');
}
exports.partsToVersion = partsToVersion;
function versionToParts(version) {
    let parts = version.split('.');
    if (parts.length > 3) {
        return [parts[0], parts[1], partsToVersion(parts.slice(2))];
    }
    return parts;
}
exports.versionToParts = versionToParts;
//# sourceMappingURL=_core.js.map