"use strict";
/**
 * Created by user on 2020/4/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "install",
    ignoreSelf: false,
    before: [
        "preinstall",
    ],
    after: [
        "postinstall",
        "prepublish",
        "prepare",
        "preshrinkwrap",
        "shrinkwrap",
        "postshrinkwrap",
    ],
};
//# sourceMappingURL=install.js.map