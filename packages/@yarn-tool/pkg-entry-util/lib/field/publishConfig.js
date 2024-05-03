"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixPublishConfig = fixPublishConfig;
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
//# sourceMappingURL=publishConfig.js.map