"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonScripts = void 0;
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const MyUtil = __importStar(require("./lib/util"));
function sortPackageJsonScripts(scripts, opts) {
    const { otherNpmScriptsOrder = MyUtil.otherNpmScriptsOrder, defaultNpmScriptsOrder = MyUtil.defaultNpmScriptsOrder, omitKey = MyUtil.omitKey, } = opts || {};
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
        const { key, omitted } = omitKey(name);
        if (defaultNpmScriptsOrder.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        if (defaultNpmScriptsOrder.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        else if (defaultNpmScriptsOrder.has(omitted)) {
            addToPrefixable1(omitted, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        else if (otherNpmScriptsOrder.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else if (otherNpmScriptsOrder.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else if (otherNpmScriptsOrder.has(omitted) || key !== omitted) {
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
        ...defaultNpmScriptsOrder.values(),
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
exports.sortPackageJsonScripts = sortPackageJsonScripts;
exports.default = sortPackageJsonScripts;
//# sourceMappingURL=index.js.map