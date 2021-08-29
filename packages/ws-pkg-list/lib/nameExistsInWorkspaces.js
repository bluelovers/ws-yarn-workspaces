"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameExistsInWorkspaces = void 0;
const listable_1 = require("./listable");
function nameExistsInWorkspaces(name) {
    name = name.toLowerCase();
    return (0, listable_1.wsPkgListable)()
        .find(entry => entry.name.toLowerCase() === name);
}
exports.nameExistsInWorkspaces = nameExistsInWorkspaces;
//# sourceMappingURL=nameExistsInWorkspaces.js.map