"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lifecycleMap = void 0;
const tslib_1 = require("tslib");
const install_1 = tslib_1.__importDefault(require("./lifecycle/install"));
const pack_1 = tslib_1.__importDefault(require("./lifecycle/pack"));
const publish_1 = tslib_1.__importDefault(require("./lifecycle/publish"));
exports.lifecycleMap = {
    install: install_1.default,
    pack: pack_1.default,
    publish: publish_1.default
};
exports.default = exports.lifecycleMap;
//# sourceMappingURL=lifecycle.js.map