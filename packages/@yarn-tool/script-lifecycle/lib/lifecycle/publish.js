"use strict";
/**
 * Created by user on 2020/4/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "publish",
    ignoreSelf: false,
    before: [
        "prepublish",
        "prepare",
        "prepublishOnly",
        "prepack",
        "postpack",
    ],
    after: [
        "postpublish"
    ],
};
//# sourceMappingURL=publish.js.map