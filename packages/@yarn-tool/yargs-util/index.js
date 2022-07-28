"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yargsProcessExit = void 0;
function yargsProcessExit(msg, code = 1) {
    if (!(msg instanceof Error)) {
        msg = new Error(msg);
        // @ts-ignore
        msg.code = code;
    }
    console.error(msg.message);
    require('yargs').exit(code, msg);
    process.exit(code);
}
exports.yargsProcessExit = yargsProcessExit;
//# sourceMappingURL=index.js.map