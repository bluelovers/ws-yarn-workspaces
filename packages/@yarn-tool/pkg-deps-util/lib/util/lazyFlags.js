"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyFlags = lazyFlags;
function lazyFlags(keys, argv) {
    return keys.reduce((a, key) => {
        if (argv[key]) {
            a.push('--' + key);
        }
        return a;
    }, []);
}
//# sourceMappingURL=lazyFlags.js.map