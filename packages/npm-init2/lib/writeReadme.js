"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeReadme = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const template_1 = tslib_1.__importDefault(require("lodash/template"));
const fs_1 = require("fs");
function writeReadme(options) {
    if ((0, fs_extra_1.existsSync)(options.file)) {
        let md1 = (0, fs_extra_1.readFileSync)(options.file).toString();
        let compiled = (0, template_1.default)(md1.toString(), {
        //escape: new RegExp('_'),
        });
        let md2 = compiled(options.variable);
        if (md1 !== md2) {
            (0, fs_1.writeFileSync)(options.file, md2);
        }
    }
}
exports.writeReadme = writeReadme;
//# sourceMappingURL=writeReadme.js.map