"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRootScripts = defaultRootScripts;
const shared_root_scripts_1 = require("./shared-root-scripts");
const pkg_scripts_1 = require("./pkg-scripts");
function defaultRootScripts() {
    const bumpVersion = (bump) => {
        return [
            `yarn run version:bump` + (bump ? `:${bump}` : ''),
            `npm publish`,
        ].join(' && ');
    };
    return {
        ...(0, pkg_scripts_1.defaultPkgScripts)(),
        ...(0, shared_root_scripts_1.defaultSharedRootScripts)(),
        "prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
        "version:bump": "yarn-tool version",
        "npm:publish": "npm publish",
        //"npm:publish:bump": "yarn run version:bump && npm publish",
        "npm:publish:bump": bumpVersion(),
        ...[
            'patch',
            'minor',
            'major',
            'prerelease',
        ].reduce((a, bump, idx) => {
            a[`version:bump:${bump}`] = `yarn run version:bump` + (bump ? ` -- --bump ${bump}` : '');
            a[`npm:publish:bump:${bump}`] = bumpVersion(bump);
            return a;
        }, {}),
        "postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
        "postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
        "postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
        "postpublish:git:push": `git push --follow-tags`,
        "postpublish": `yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push`,
        "ncu": "yarn-tool ncu -u",
    };
}
//# sourceMappingURL=root-scripts.js.map