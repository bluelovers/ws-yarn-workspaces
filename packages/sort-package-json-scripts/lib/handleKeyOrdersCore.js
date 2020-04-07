"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeyOrdersCore = void 0;
function handleKeyOrdersCore(names, { otherScriptNames, defaultNpmScriptsOrder, omitKeyFn, sortKeyFn, }) {
    const prefixable = new Set();
    const keymap = {};
    const addToPrefixable1 = (value, { key, omitted, name, list, }) => {
        var _a;
        keymap[key] = ((_a = keymap[key]) !== null && _a !== void 0 ? _a : []);
        keymap[key].push(name);
        prefixable.add(value);
        list.push(value);
    };
    const keys = names
        .sort(sortKeyFn)
        .reduce((a, name) => {
        const { key, omitted } = omitKeyFn(name);
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
        else if (otherScriptNames.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else if (otherScriptNames.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        else if (otherScriptNames.has(omitted) || key !== omitted) {
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
    return order;
}
exports.handleKeyOrdersCore = handleKeyOrdersCore;
exports.default = handleKeyOrdersCore;
//# sourceMappingURL=handleKeyOrdersCore.js.map