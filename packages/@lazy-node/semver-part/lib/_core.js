"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._versionUnsafe = _versionUnsafe;
exports._versionSafe = _versionSafe;
exports._part = _part;
exports.partsToVersion = partsToVersion;
exports.versionToParts = versionToParts;
function _versionUnsafe(part, defaultValue) {
    var _a;
    return `0.0.${(_a = part !== null && part !== void 0 ? part : defaultValue) !== null && _a !== void 0 ? _a : 0}`;
}
function _versionSafe(part) {
    if (/^\d+\.\d+\./.test(part)) {
        return part;
    }
    else if (/^\d+\.(?:[^\.]+)$/.test(part)) {
        return '0.' + part;
    }
    return _versionUnsafe(part);
}
function _part(part1, part2) {
    if (/^\d+\.\d+\./.test(part1) && /^\d+\.\d+\./.test(part2)) {
        return [part1, part2];
    }
    else if (/^\d+\.(?:[^\.]+)$/.test(part1) && /^\d+\.(?:[^\.]+)$/.test(part2)) {
        return ['0.' + part1, '0.' + part2];
    }
    return [_versionUnsafe(part1), _versionUnsafe(part2)];
}
function partsToVersion(parts) {
    return parts.join('.');
}
function versionToParts(version) {
    let parts = version.split('.');
    if (parts.length > 3) {
        return [parts[0], parts[1], partsToVersion(parts.slice(2))];
    }
    return parts;
}
//# sourceMappingURL=_core.js.map