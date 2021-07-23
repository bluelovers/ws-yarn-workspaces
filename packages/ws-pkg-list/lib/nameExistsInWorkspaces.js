"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameExistsInWorkspaces = void 0;
const tslib_1 = require("tslib");
const listable_1 = (0, tslib_1.__importDefault)(require("./listable"));
function nameExistsInWorkspaces(name) {
    name = name.toLowerCase();
    return (0, listable_1.default)()
        .find(entry => entry.name.toLowerCase() === name);
}
exports.nameExistsInWorkspaces = nameExistsInWorkspaces;
//# sourceMappingURL=nameExistsInWorkspaces.js.map