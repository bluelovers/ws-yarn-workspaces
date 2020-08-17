"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyFlags = void 0;
function lazyFlags(keys, argv) {
    return keys.reduce((a, key) => {
        if (argv[key]) {
            a.push('--' + key);
        }
        return a;
    }, []);
}
exports.lazyFlags = lazyFlags;
//# sourceMappingURL=lazyFlags.js.map