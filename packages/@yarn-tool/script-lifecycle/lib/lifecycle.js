"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lifecycleMap = void 0;
const install_1 = __importDefault(require("./lifecycle/install"));
const pack_1 = __importDefault(require("./lifecycle/pack"));
const publish_1 = __importDefault(require("./lifecycle/publish"));
exports.lifecycleMap = {
    install: install_1.default,
    pack: pack_1.default,
    publish: publish_1.default
};
exports.default = exports.lifecycleMap;
//# sourceMappingURL=lifecycle.js.map