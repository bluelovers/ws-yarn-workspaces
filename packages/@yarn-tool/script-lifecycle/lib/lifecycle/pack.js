"use strict";
/**
 * Created by user on 2020/4/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "pack",
    ignoreSelf: true,
    before: [
        "prepublish",
        "prepare",
        "prepack",
    ],
    after: [
        "postpack"
    ],
};
//# sourceMappingURL=pack.js.map