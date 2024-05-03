"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmCheckUpdatesOptions = npmCheckUpdatesOptions;
function npmCheckUpdatesOptions(ncuOptions) {
    ncuOptions = {
        ...ncuOptions,
    };
    delete ncuOptions.upgrade;
    // @ts-ignore
    delete ncuOptions.global;
    ncuOptions.packageManager = 'npm';
    if (ncuOptions.json_old) {
        ncuOptions.packageData = JSON.stringify(ncuOptions.json_old);
    }
    // @ts-ignore
    ncuOptions.jsonUpgraded = true;
    return ncuOptions;
}
//# sourceMappingURL=options.js.map