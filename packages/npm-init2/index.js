#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const workspaces_config_1 = __importStar(require("workspaces-config"));
const npm_package_json_loader_1 = __importDefault(require("npm-package-json-loader"));
const lib_1 = require("./lib");
const yargs_setting_1 = __importDefault(require("./lib/yargs-setting"));
const find_root_1 = require("@yarn-tool/find-root");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const fs_1 = require("fs");
const writeReadme_1 = require("./lib/writeReadme");
const sort_package_json_scripts_1 = __importDefault(require("sort-package-json-scripts"));
const workspaces_project_1 = __importDefault(require("@yarn-tool/workspaces-project"));
const upath2_2 = require("upath2");
const path_is_same_1 = __importDefault(require("path-is-same"));
const node_modules_link_1 = __importDefault(require("@yarn-tool/node-modules-link"));
//updateNotifier(__dirname);
let cli = yargs_setting_1.default(yargs_1.default);
let argv = cli.argv._;
//console.dir(cli.argv);
let cwd = upath2_1.resolve(cli.argv.cwd || process.cwd());
let rootData = find_root_1.findRoot({
    cwd,
    skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});
let hasWorkspace = rootData.ws;
let isWorkspace = rootData.isWorkspace;
let workspacePrefix;
let workspacesConfig;
let wsProject;
if (hasWorkspace) {
    workspacesConfig = workspaces_config_1.parseStaticPackagesPaths(workspaces_config_1.default(hasWorkspace));
    if (workspacesConfig.prefix.length) {
        workspacePrefix = workspacesConfig.prefix[0];
    }
    wsProject = new workspaces_project_1.default(hasWorkspace);
}
let { targetDir, targetName } = lib_1.getTargetDir({
    inputName: argv.length && argv[0],
    cwd,
    targetName: cli.argv.name || null,
    hasWorkspace,
    workspacePrefix,
    workspacesConfig,
});
fs_extra_1.ensureDirSync(targetDir);
isWorkspace = path_is_same_1.default(targetDir, rootData.root);
let flags = Object.keys(cli.argv)
    .reduce(function (a, f) {
    if (f === 'silent' || f === 'y' || f === 'yes') {
    }
    else if (/^[a-z]$/.test(f) && cli.argv[f]) {
        a.push(f);
    }
    return a;
}, [])
    .join('');
let args = [
    'init',
    (flags && '-' + flags),
    cli.argv.createModule,
    cli.argv.yes && '-y',
].filter(v => v);
//console.log(args);
let old_pkg_name;
let oldExists = fs_1.existsSync(upath2_1.join(targetDir, 'package.json'));
let old_pkg;
if (!targetName) {
    try {
        old_pkg = (_a = new npm_package_json_loader_1.default(upath2_1.join(targetDir, 'package.json'))) === null || _a === void 0 ? void 0 : _a.data;
        old_pkg_name = old_pkg.name;
    }
    catch (e) {
    }
}
let cp = cross_spawn_extra_1.default.sync(cli.argv.npmClient, args, {
    stdio: 'inherit',
    cwd: targetDir,
});
if (!cp.error) {
    let pkg = new npm_package_json_loader_1.default(upath2_1.join(targetDir, 'package.json'));
    if (pkg.exists()) {
        if (cli.argv.p && cli.argv.npmClient !== 'yarn') {
            pkg.data.private = true;
        }
        // 防止 node- 被 npm 移除
        if (!cli.argv.yes && old_pkg_name && /^node-/.test(old_pkg_name) && ('node-' + pkg.data.name) === old_pkg_name) {
            pkg.data.name = old_pkg_name;
        }
        else if (cli.argv.yes && old_pkg_name && pkg.data.name !== old_pkg_name) {
            pkg.data.name = old_pkg_name;
        }
        else if (targetName && pkg.data.name !== targetName) {
            pkg.data.name = targetName;
        }
        if (pkg.data.name && /^@/.test(pkg.data.name) && !pkg.data.publishConfig) {
            //pkg.data.publishConfig = {};
        }
        if (!pkg.data.scripts) {
            pkg.data.scripts = {};
        }
        if (!pkg.data.homepage || !pkg.data.bugs || !pkg.data.repository) {
            try {
                let info = pkg_git_info_1.npmHostedGitInfo(targetDir);
                // @ts-ignore
                pkg.data.homepage = pkg.data.homepage || info.homepage;
                if (hasWorkspace) {
                    let u = new URL(pkg.data.homepage);
                    u.pathname += '/tree/master/' + upath2_1.relative(hasWorkspace, targetDir);
                    // @ts-ignore
                    pkg.data.homepage = u.toString();
                }
                pkg.data.bugs = pkg.data.bugs || {
                    url: info.bugs,
                };
                pkg.data.repository = pkg.data.repository || {
                    "type": "git",
                    url: info.repository,
                };
            }
            catch (e) {
            }
        }
        let sharedScript = {
            "prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
            "prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
            "ncu": "yarn-tool ncu -u",
            "sort-package-json": "yarn-tool sort",
            "test": `echo "Error: no test specified"`,
            "preversion": `echo preversion`,
        };
        let prepublishOnly = "yarn run prepublishOnly:check-bin && yarn run prepublishOnly:update && yarn run test";
        if (hasWorkspace) {
            prepublishOnly = "yarn run prepublishOnly:check-bin && yarn run test";
            sharedScript = {
                ...sharedScript,
                "preversion": "yarn run prepublishOnly",
            };
        }
        else {
            sharedScript = {
                ...sharedScript,
                "npm:publish": "npm publish",
                "npm:publish:lerna": "lerna publish --yes --bump patch",
                "postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
                "postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
                "postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
                "postpublish:git:push": `git push --follow-tags`,
                "postpublish_": `yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push`,
            };
            if (!oldExists) {
                sharedScript = {
                    ...sharedScript,
                    "coverage": "nyc npm run test",
                    "tsc:default": "tsc -p tsconfig.json",
                    "tsc:esm": "tsc -p tsconfig.esm.json",
                };
            }
        }
        if (oldExists) {
            sharedScript.prepublishOnly_ = prepublishOnly;
        }
        else {
            sharedScript.prepublishOnly = prepublishOnly;
        }
        if (!oldExists) {
            if (((_b = pkg.data.scripts) === null || _b === void 0 ? void 0 : _b.test) === "echo \"Error: no test specified\" && exit 1" && ((_c = sharedScript.test) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                delete pkg.data.scripts.test;
            }
            Object
                .entries({
                "test:mocha": "ynpx --quiet -p ts-node -p mocha mocha -- --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
                "test:jest": "ynpx --quiet jest -- --coverage",
                "lint": "ynpx --quiet eslint -- **/*.ts",
                ...sharedScript,
            })
                .forEach(([k, v]) => {
                if (pkg.data.scripts[k] == null) {
                    pkg.data.scripts[k] = v;
                }
            });
        }
        else {
            Object
                .entries(sharedScript)
                .forEach(([k, v]) => {
                if (k.endsWith('_') && pkg.data.scripts[k.replace(/_+$/, '')] === v) {
                    return;
                }
                if (pkg.data.scripts[k] == null) {
                    pkg.data.scripts[k] = v;
                }
            });
            if (!pkg.data.types || !pkg.data.typeings) {
                pkg.data.types = pkg.data.types || pkg.data.typeings;
                if (pkg.data.main && !pkg.data.types) {
                    let file = upath2_1.join(targetDir, pkg.data.main);
                    let parsed = upath2_2.parse(file);
                    if (!path_is_same_1.default(targetDir, parsed.dir) && fs_extra_1.pathExistsSync(upath2_1.join(parsed.dir, parsed.name + '.d.ts'))) {
                        pkg.data.types = upath2_1.relative(targetDir, parsed.dir).replace(/^\.\//, '') + '/' + parsed.name + '.d.ts';
                    }
                }
                pkg.data.typeings = pkg.data.types;
            }
            if (old_pkg) {
                Object.keys(old_pkg)
                    .forEach(key => {
                    if (!(key in pkg.data)) {
                        pkg.data[key] = old_pkg[key];
                    }
                });
            }
        }
        if (!oldExists) {
            const cpkg = require('./package.json');
            const findVersion = (name) => {
                var _a, _b, _c;
                return ((_a = cpkg.dependencies) === null || _a === void 0 ? void 0 : _a[name]) || ((_b = cpkg.devDependencies) === null || _b === void 0 ? void 0 : _b[name]) || ((_c = cpkg.peerDependencies) === null || _c === void 0 ? void 0 : _c[name]) || "*";
            };
            pkg.data.dependencies = pkg.data.dependencies || {};
            pkg.data.devDependencies = pkg.data.devDependencies || {};
            pkg.data.peerDependencies = pkg.data.peerDependencies || {};
            if (!hasWorkspace || hasWorkspace && isWorkspace) {
                pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
                pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
            }
        }
        if (wsProject && !isWorkspace) {
            if (!((_d = pkg.data.keywords) === null || _d === void 0 ? void 0 : _d.length) && ((_f = (_e = wsProject.manifest) === null || _e === void 0 ? void 0 : _e.keywords) === null || _f === void 0 ? void 0 : _f.length)) {
                pkg.data.keywords = wsProject.manifest.keywords.slice();
            }
        }
        pkg.data.scripts = sort_package_json_scripts_1.default(pkg.data.scripts);
        pkg.autofix();
        if (cli.argv.sort) {
            pkg.sort();
        }
        pkg.writeOnlyWhenLoaded();
        /*
        try
        {
            let copyOptions: CopyOptionsSync = {
                overwrite: false,
                preserveTimestamps: true,
                errorOnExist: false,
            };

            copySync(join(__dirname, 'lib/static'), targetDir, copyOptions);
        }
        catch (e)
        {

        }
         */
        let mdFile = upath2_1.join(targetDir, 'README.md');
        let existsReadme = !oldExists || !fs_1.existsSync(mdFile);
        lib_1.copyStaticFiles(lib_1.defaultCopyStaticFiles, {
            cwd: targetDir,
        });
        if (existsReadme) {
            writeReadme_1.writeReadme({
                file: upath2_1.join(targetDir, 'README.md'),
                variable: pkg.data,
            });
        }
        if (wsProject && !isWorkspace) {
            node_modules_link_1.default({
                cwd: targetDir,
                sourcePackagePath: targetDir,
            });
        }
        /*
        fs.copySync(path.join(__dirname, 'lib/file/npmignore'), path.join(targetDir, '.npmignore'), copyOptions);

        fs.copySync(path.join(__dirname, 'lib/file/gitignore'), path.join(targetDir, '.gitignore'), copyOptions);

        if (!fs.pathExistsSync(path.join(targetDir, 'tsconfig.json')))
        {
            fs.copySync(path.join(__dirname, 'lib/file/tsconfig.json.tpl'), path.join(targetDir, 'tsconfig.json.tpl'), copyOptions);
        }
         */
    }
}
else {
    process.exitCode = 1;
}
//# sourceMappingURL=index.js.map