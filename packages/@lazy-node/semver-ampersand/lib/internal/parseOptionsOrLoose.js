"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptionsOrLoose = parseOptionsOrLoose;
const index_1 = require("../util/index");
const fixBooleanProperty_1 = require("../util/fixBooleanProperty");
function parseOptionsOrLoose(options) {
    if (options === false) {
        options = {
            loose: !!options,
        };
    }
    else if (!options || typeof options === 'object' && !(0, index_1.isPlainObject)(options)) {
        options = {};
    }
    else if (typeof options !== 'object' || !(0, index_1.isPlainObject)(options)) {
        options = {
            loose: !!options,
        };
    }
    else {
        options = (0, fixBooleanProperty_1.fixBooleanProperty)(options, fixBooleanProperty_1.opts);
    }
    return options;
}
//# sourceMappingURL=parseOptionsOrLoose.js.map