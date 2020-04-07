"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeReadme = void 0;
const fs_extra_1 = require("fs-extra");
const template_1 = __importDefault(require("lodash/template"));
const fs_1 = require("fs");
function writeReadme(options) {
    if (fs_extra_1.existsSync(options.file)) {
        let md1 = fs_extra_1.readFileSync(options.file).toString();
        let compiled = template_1.default(md1.toString(), {
        //escape: new RegExp('_'),
        });
        let md2 = compiled(options.variable);
        if (md1 !== md2) {
            fs_1.writeFileSync(options.file, md2);
        }
    }
}
exports.writeReadme = writeReadme;
//# sourceMappingURL=writeReadme.js.map