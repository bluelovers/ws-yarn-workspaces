#!/usr/bin/env node
"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
var _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const workspaces_config_1 = (0, tslib_1.__importStar)(require("workspaces-config"));
const npm_package_json_loader_1 = (0, tslib_1.__importDefault)(require("npm-package-json-loader"));
const lib_1 = require("./lib");
const static_file_1 = require("@yarn-tool/static-file");
const yargs_setting_1 = (0, tslib_1.__importDefault)(require("./lib/yargs-setting"));
const find_root_1 = require("@yarn-tool/find-root");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const fs_1 = require("fs");
const writeReadme_1 = require("./lib/writeReadme");
const sort_package_json_scripts_1 = (0, tslib_1.__importDefault)(require("sort-package-json-scripts"));
const workspaces_project_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/workspaces-project"));
const upath2_2 = require("upath2");
const path_is_same_1 = (0, tslib_1.__importDefault)(require("path-is-same"));
const node_modules_link_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/node-modules-link"));
const init_path_1 = require("@yarn-tool/init-path");
const path_1 = require("path");
const is_builtin_module_1 = require("@yarn-tool/is-builtin-module");
const initWithPreserveDeps_1 = require("./lib/initWithPreserveDeps");
//updateNotifier(__dirname);
let cli = (0, yargs_setting_1.default)(yargs_1.default);
let argv = cli.argv._;
//console.dir(cli.argv);
let cwd = (0, upath2_1.resolve)(cli.argv.cwd || process.cwd());
let rootData = (0, find_root_1.findRoot)({
    cwd,
    skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});
let hasWorkspace = rootData.ws;
let isWorkspace = rootData.isWorkspace;
let workspacePrefix;
let workspacesConfig;
let wsProject;
if (hasWorkspace) {
    workspacesConfig = (0, workspaces_config_1.parseStaticPackagesPaths)((0, workspaces_config_1.default)(hasWorkspace));
    if (workspacesConfig.prefix.length) {
        workspacePrefix = workspacesConfig.prefix[0];
    }
    wsProject = new workspaces_project_1.default(hasWorkspace);
}
let { targetDir, targetName, scopedPackagePattern } = (0, init_path_1.getTargetDir)({
    // @ts-ignore
    inputName: argv.length && argv[0],
    cwd,
    targetName: cli.argv.name || null,
    hasWorkspace,
    workspacePrefix,
    workspacesConfig,
});
(0, fs_extra_1.ensureDirSync)(targetDir);
if (rootData.root) {
    isWorkspace = (0, path_is_same_1.default)(targetDir, rootData.root);
}
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
const pkg_file_path = (0, upath2_1.join)(targetDir, 'package.json');
let old_pkg_name;
let oldExists = (0, fs_1.existsSync)(pkg_file_path);
let old_pkg;
if (!oldExists && targetName && scopedPackagePattern && (0, is_builtin_module_1.isBuiltinModule)((0, path_1.basename)(targetDir))) {
    (0, fs_extra_1.outputJSONSync)(pkg_file_path, {
        name: targetName,
    }, {
        spaces: 2,
    });
}
else if (!targetName) {
    try {
        old_pkg = (_a = new npm_package_json_loader_1.default(pkg_file_path)) === null || _a === void 0 ? void 0 : _a.data;
        old_pkg_name = old_pkg.name;
    }
    catch (e) {
    }
}
let { cp } = (0, initWithPreserveDeps_1.initWithPreserveDeps)({
    npmClient: cli.argv.npmClient,
    args,
    cwd: targetDir,
    old_pkg,
    pkg_file_path,
});
if (!cp.error) {
    let pkg = new npm_package_json_loader_1.default(pkg_file_path);
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
                let info = (0, pkg_git_info_1.npmHostedGitInfo)(targetDir);
                // @ts-ignore
                pkg.data.homepage = pkg.data.homepage || info.homepage;
                if (hasWorkspace) {
                    let u = new URL(pkg.data.homepage);
                    u.pathname += '/tree/master/' + (0, upath2_1.relative)(hasWorkspace, targetDir);
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
            "preversion": `echo preversion && yarn run test`,
        };
        let prepublishOnly = "yarn run prepublishOnly:check-bin && yarn run prepublishOnly:update && yarn run test";
        if (hasWorkspace) {
            if ((_c = (_b = wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest) === null || _b === void 0 ? void 0 : _b.scripts) === null || _c === void 0 ? void 0 : _c['prepublishOnly:check-bin']) {
                prepublishOnly = "yarn run test";
            }
            else {
                prepublishOnly = "yarn run prepublishOnly:check-bin && yarn run test";
            }
            let preversion = "yarn run prepublishOnly";
            if (!oldExists || !((_d = pkg.data.scripts) === null || _d === void 0 ? void 0 : _d.prepublishOnly)) {
                preversion = prepublishOnly;
                prepublishOnly = "echo prepublishOnly";
            }
            sharedScript = {
                ...sharedScript,
                preversion,
            };
        }
        else {
            sharedScript = {
                ...sharedScript,
                "npm:publish": "npm publish",
                "npm:publish:bump": "yarn-tool version && npm publish",
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
            if (((_e = pkg.data.scripts) === null || _e === void 0 ? void 0 : _e.test) === "echo \"Error: no test specified\" && exit 1" && ((_f = sharedScript.test) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                delete pkg.data.scripts.test;
            }
            Object
                .entries({
                "test:mocha": "ynpx --quiet -p ts-node -p mocha mocha -- --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
                "test:jest": "ynpx --quiet jest -- --coverage --passWithNoTests",
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
            (_g = (_l = pkg.data).scripts) !== null && _g !== void 0 ? _g : (_l.scripts = {});
            (_h = (_m = pkg.data.scripts).test) !== null && _h !== void 0 ? _h : (_m.test = "echo \"Error: no test specified\"");
            (_j = (_o = pkg.data.scripts).preversion) !== null && _j !== void 0 ? _j : (_o.preversion = "echo preversion && yarn run test");
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
            if (!pkg.data.types || !pkg.data.typings) {
                pkg.data.types = pkg.data.types || pkg.data.typings;
                if (pkg.data.main && !pkg.data.types) {
                    let file = (0, upath2_1.join)(targetDir, pkg.data.main);
                    let parsed = (0, upath2_2.parse)(file);
                    if (!(0, path_is_same_1.default)(targetDir, parsed.dir) && (0, fs_extra_1.pathExistsSync)((0, upath2_1.join)(parsed.dir, parsed.name + '.d.ts'))) {
                        pkg.data.types = (0, upath2_1.relative)(targetDir, parsed.dir).replace(/^\.\//, '') + '/' + parsed.name + '.d.ts';
                    }
                }
                pkg.data.typings = pkg.data.types;
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
            pkg.data.dependencies['tslib'] = findVersion('tslib');
        }
        if (wsProject && !isWorkspace) {
            const rootKeywords = wsProject.manifest.toJSON().keywords;
            if (!((_k = pkg.data.keywords) === null || _k === void 0 ? void 0 : _k.length) && (rootKeywords === null || rootKeywords === void 0 ? void 0 : rootKeywords.length)) {
                pkg.data.keywords = rootKeywords.slice();
            }
        }
        pkg.data.scripts = (0, sort_package_json_scripts_1.default)(pkg.data.scripts);
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
        let mdFile = (0, upath2_1.join)(targetDir, 'README.md');
        let existsReadme = !oldExists || !(0, fs_1.existsSync)(mdFile);
        let file_map = [
            ...static_file_1.defaultCopyStaticFiles,
        ];
        if (!wsProject) {
            file_map = [
                ['tsconfig.json', 'file/tsconfig.json.tpl'],
                ...file_map,
            ];
        }
        (0, lib_1.copyStaticFiles)(file_map, {
            cwd: targetDir,
        });
        if (existsReadme) {
            (0, writeReadme_1.writeReadme)({
                file: (0, upath2_1.join)(targetDir, 'README.md'),
                variable: pkg.data,
            });
        }
        if (wsProject && !isWorkspace) {
            (0, node_modules_link_1.default)({
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