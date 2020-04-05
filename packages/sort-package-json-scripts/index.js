"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonScript = void 0;
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const util_1 = require("./lib/util");
function sortPackageJsonScript(scripts) {
    const names = Object.keys(scripts);
    const prefixable = new Set();
    const keymap = {};
    const addToPrefixable1 = (value, { key, omitted, name, list }) => {
        var _a;
        keymap[key] = ((_a = keymap[key]) !== null && _a !== void 0 ? _a : []);
        keymap[key].push(name);
        prefixable.add(value);
        list.push(value);
    };
    const keys = names
        .sort()
        .reduce((a, name) => {
        const { key, omitted } = util_1.omitKey(name);
        if (util_1.defaultNpmScriptsOrder.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        if (util_1.defaultNpmScriptsOrder.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        else if (util_1.defaultNpmScriptsOrder.has(omitted)) {
            addToPrefixable1(omitted, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        else if (util_1.otherNpmScriptsOrder.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else if (util_1.otherNpmScriptsOrder.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else if (util_1.otherNpmScriptsOrder.has(omitted) || key !== omitted) {
            addToPrefixable1(omitted, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else {
            a.list1.push(name);
        }
        return a;
    }, {
        list1: [],
        list2: [],
    });
    const order = [
        ...util_1.defaultNpmScriptsOrder.values(),
        ...keys.list2,
        ...keys.list1,
    ].reduce((order, key) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (prefixable.has(key)) {
            order.push(...((_c = (_b = (_a = keymap[`pre${key}`]) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : []));
            order.push(...((_f = (_e = (_d = keymap[key]) === null || _d === void 0 ? void 0 : _d.sort) === null || _e === void 0 ? void 0 : _e.call(_d)) !== null && _f !== void 0 ? _f : []));
            order.push(...((_j = (_h = (_g = keymap[`post${key}`]) === null || _g === void 0 ? void 0 : _g.sort) === null || _h === void 0 ? void 0 : _h.call(_g)) !== null && _j !== void 0 ? _j : []));
        }
        else {
            order.push(key);
        }
        return order;
    }, []);
    return sort_object_keys2_1.default(scripts, {
        keys: order,
    });
}
exports.sortPackageJsonScript = sortPackageJsonScript;
exports.default = sortPackageJsonScript;
//# sourceMappingURL=index.js.map