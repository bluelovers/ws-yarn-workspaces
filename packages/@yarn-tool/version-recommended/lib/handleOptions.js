"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = void 0;
const types_1 = require("./types");
function handleOptions(options) {
    options = {
        ...options,
    };
    let bump = options.bump;
    if (!bump) {
        for (let type of types_1.releaseTypes) {
            if (options[type] === true) {
                bump = type;
                break;
            }
        }
    }
    /*
    for (let type of releaseTypes)
    {
        delete options[type]
    }
     */
    return options;
}
exports.handleOptions = handleOptions;
//# sourceMappingURL=handleOptions.js.map