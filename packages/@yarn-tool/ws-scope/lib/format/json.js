"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeJson = void 0;
const fs_extra_1 = require("fs-extra");
const json_object_1 = require("./json-object");
class ScopeJson extends json_object_1.ScopeJsonObject {
    existsFile() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    loadFile(reload) {
        if (reload || !this.opened) {
            this.json = (0, fs_extra_1.readJSONSync)(this.file);
        }
        return this.json;
    }
    saveFile() {
        return this.opened && (0, fs_extra_1.writeJSONSync)(this.file, this.json, {
            spaces: 2,
        });
    }
}
exports.ScopeJson = ScopeJson;
//# sourceMappingURL=json.js.map