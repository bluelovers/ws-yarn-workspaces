"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersions = parseVersions;
exports.parseVersionsAndCompare = parseVersionsAndCompare;
const _core_1 = require("./_core");
const compare_1 = require("./compare");
function parseVersions(versionOld, versionNew) {
    const partsNew = (0, _core_1.versionToParts)(versionNew);
    const partsOld = (0, _core_1.versionToParts)(versionOld);
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
function parseVersionsAndCompare(versionOld, versionNew, optionsOrLoose) {
    const data = parseVersions(versionOld, versionNew);
    let comp = (0, compare_1.tryCompare)(data.partsNew[data.index], data.partsOld[data.index], optionsOrLoose);
    return {
        ...data,
        comp,
    };
}
//# sourceMappingURL=parse.js.map