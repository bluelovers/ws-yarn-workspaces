"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixPublishConfig = void 0;
function fixPublishConfig(pkg) {
    if (!pkg.publishConfig
        && !pkg.private
        && pkg.name
        && /\//.test(pkg.name)) {
        pkg.publishConfig = {
            access: "public",
        };
    }
    return pkg;
}
exports.fixPublishConfig = fixPublishConfig;
//# sourceMappingURL=publishConfig.js.map