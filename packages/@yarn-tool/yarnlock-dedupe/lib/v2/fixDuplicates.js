"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDuplicates = void 0;
const yarn_berry_deduplicate_1 = require("yarn-berry-deduplicate");
const yarnlock_banner_1 = __importDefault(require("@yarn-tool/yarnlock-banner"));
function fixDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    let { banner, content } = yarnlock_banner_1.default(yarnlock_old);
    let output = yarn_berry_deduplicate_1.fixDuplicates(content, options);
    return `${banner}${output}`;
}
exports.fixDuplicates = fixDuplicates;
//# sourceMappingURL=fixDuplicates.js.map