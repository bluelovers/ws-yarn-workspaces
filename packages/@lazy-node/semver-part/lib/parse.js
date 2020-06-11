"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersionsAndCompare = exports.parseVersions = void 0;
const _core_1 = require("./_core");
const compare_1 = require("./compare");
function parseVersions(versionOld, versionNew) {
    const partsNew = _core_1.versionToParts(versionNew);
    const partsOld = _core_1.versionToParts(versionOld);
    let index = partsNew.findIndex((part, i) => part !== partsOld[i]);
    index = index >= 0 ? index : partsNew.length;
    return {
        versionOld,
        versionNew,
        partsOld,
        partsNew,
        index,
    };
}
exports.parseVersions = parseVersions;
function parseVersionsAndCompare(versionOld, versionNew) {
    const data = parseVersions(versionOld, versionNew);
    let comp = compare_1.tryCompare(data.partsNew[data.index], data.partsOld[data.index]);
    return {
        ...data,
        comp,
    };
}
exports.parseVersionsAndCompare = parseVersionsAndCompare;
//# sourceMappingURL=parse.js.map