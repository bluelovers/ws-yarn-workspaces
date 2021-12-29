"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeJson = void 0;
const fs_extra_1 = require("fs-extra");
const json_object_1 = require("./json-object");
const fs_json_1 = require("@bluelovers/fs-json");
class ScopeJson extends json_object_1.ScopeJsonObject {
    existsFile() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    loadFile(reload) {
        if (reload || !this.opened) {
            this.json = (0, fs_json_1.readJSONSync)(this.file);
        }
        return this.json;
    }
    saveFile() {
        return this.opened && (0, fs_json_1.writeJSONSync)(this.file, this.json, {
            spaces: 2,
            // @ts-ignore
            finalEOL: true,
        });
    }
    loadFileLazy(reload) {
        return this.existsFile() && this.loadFile(reload);
    }
}
exports.ScopeJson = ScopeJson;
//# sourceMappingURL=json.js.map