"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayAdd = arrayAdd;
exports.arrayRemove = arrayRemove;
const array_hyper_unique_1 = require("array-hyper-unique");
function arrayAdd(scope, value) {
    value !== null && value !== void 0 ? value : (value = []);
    if (!Array.isArray(value)) {
        throw new Error(`Only support Array but ${value}`);
    }
    let changed = false;
    if (!value.includes(scope)) {
        value.push(scope);
        (0, array_hyper_unique_1.array_unique_overwrite)(value);
        changed = true;
    }
    return {
        changed,
        value,
    };
}
function arrayRemove(scope, value) {
    let changed = false;
    if (value && value.includes(scope)) {
        let i = value.indexOf(scope);
        value.splice(i, 1);
        changed = true;
    }
    return {
        changed,
        value,
    };
}
//# sourceMappingURL=arrayAdd.js.map