#!/usr/bin/env node
"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h;
var _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const workspaces_config_1 = require("workspaces-config");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const yargs_setting_1 = require("./lib/yargs-setting");
const find_root_1 = require("@yarn-tool/find-root");
const fs_1 = require("fs");
const writeReadme_1 = require("./lib/writeReadme");
const sort_package_json_scripts_1 = require("sort-package-json-scripts");
const workspaces_project_1 = require("@yarn-tool/workspaces-project");
const path_is_same_1 = require("path-is-same");
const node_modules_link_1 = require("@yarn-tool/node-modules-link");
const init_path_1 = require("@yarn-tool/init-path");
const path_1 = require("path");
const is_builtin_module_1 = require("@yarn-tool/is-builtin-module");
const initWithPreserveDeps_1 = require("./lib/initWithPreserveDeps");
const static_file_1 = require("@yarn-tool/static-file");
const logger_1 = require("debug-color2/logger");
const nameExistsInWorkspaces_1 = require("ws-pkg-list/lib/nameExistsInWorkspaces");
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const index_1 = require("@yarn-tool/setup-module-env/lib/preset/tsdx/index");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/dummy");
const root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/root-scripts");
const pkg_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/pkg-scripts");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const getRootCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/root/getRootCopyStaticFiles");
const scripts_1 = require("@yarn-tool/pkg-entry-util/lib/field/scripts");
//updateNotifier(__dirname);
// avoid buf for idea
logger_1.consoleLogger.length;
let cli = (0, yargs_setting_1.setupToYargs)(yargs_1.default);
let argv = cli.argv._;
//console.dir(cli.argv);
let cwd = (0, upath2_1.resolve)(cli.argv.cwd || process.cwd());
let rootData = (0, find_root_1.findRoot)({
    cwd,
    skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});
let workspacePrefix;
let workspacesConfig;
let wsProject;
if (rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace) {
    workspacesConfig = (0, workspaces_config_1.parseStaticPackagesPaths)((0, workspaces_config_1.getConfig)(rootData.ws));
    if (workspacesConfig.prefix.length) {
        workspacePrefix = workspacesConfig.prefix[0];
    }
    wsProject = new workspaces_project_1.WorkspacesProject(rootData.ws);
}
let { targetDir, targetName, scopedPackagePattern } = (0, init_path_1.getTargetDir)({
    // @ts-ignore
    inputName: argv.length && argv[0],
    cwd,
    targetName: cli.argv.name || null,
    hasWorkspace: rootData === null || rootData === void 0 ? void 0 : rootData.ws,
    workspacePrefix,
    workspacesConfig,
});
(0, fs_extra_1.ensureDirSync)(targetDir);
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
const oldExists = (0, fs_1.existsSync)(pkg_file_path);
let old_pkg;
if (oldExists && (targetName === null || targetName === void 0 ? void 0 : targetName.length)) {
    logger_1.consoleLogger.error(`對於已存在的 Package 而言，禁止同時指定名稱`, targetName);
    logger_1.consoleLogger.error(pkg_file_path);
    process.exit(1);
}
if (!oldExists && (rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace)) {
    if ((0, nameExistsInWorkspaces_1.nameExistsInWorkspaces)(targetName)) {
        logger_1.consoleLogger.error(`root:`, rootData.root);
        logger_1.consoleLogger.error(`目標名稱已存在於 Workspaces 內，請更換名稱:`, targetName);
        process.exit(1);
    }
}
if (!oldExists && targetName && scopedPackagePattern && (0, is_builtin_module_1.isBuiltinModule)((0, path_1.basename)(targetDir))) {
    (0, write_package_json_1.outputPackageJSONSync)(pkg_file_path, {
        name: targetName,
    });
}
else if (!targetName) {
    try {
        old_pkg = (_a = new npm_package_json_loader_1.PackageJsonLoader(pkg_file_path)) === null || _a === void 0 ? void 0 : _a.data;
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
    rootData = (0, find_root_1.findRoot)({
        cwd: targetDir,
        skipCheckWorkspace: cli.argv.skipCheckWorkspace,
    });
    if (!(rootData === null || rootData === void 0 ? void 0 : rootData.root)) {
        logger_1.consoleLogger.error(`發生錯誤，初始化失敗`, targetName);
        logger_1.consoleLogger.error(targetDir);
        process.exit(1);
    }
    let pkg = new npm_package_json_loader_1.PackageJsonLoader(pkg_file_path);
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
        (0, pkg_hosted_info_1.fillPkgHostedInfo)(pkg.data, {
            targetDir,
            rootData,
        });
        (_b = (_j = pkg.data).packageManager) !== null && _b !== void 0 ? _b : (_j.packageManager = "yarn@1.22.19");
        let sharedScript = {
            "prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
            "ncu": "yarn-tool ncu -u",
            "sort-package-json": "yarn-tool sort",
            "test": `echo "Error: no test specified"`,
            "tsc:showConfig": "ynpx get-current-tsconfig -p",
        };
        (0, dummy_1.fillDummyScripts)(sharedScript);
        let preScripts = ["echo preversion"];
        /*
        if (rootData.isRoot || rootData.hasWorkspace && !wsProject.manifest.scripts?.['prepublishOnly:check-bin'])
        {
            preScripts.push('yarn run prepublishOnly:check-bin');
        }
         */
        if (rootData.isRoot && !rootData.isWorkspace) {
            sharedScript.prepublishOnly = "yarn run preversion";
        }
        if (rootData.hasWorkspace) {
        }
        else if (rootData.isRoot) {
            sharedScript = {
                ...sharedScript,
                ...(0, root_scripts_1.defaultRootScripts)(),
            };
            if (!oldExists) {
                sharedScript = {
                    ...sharedScript,
                    "tsc:default": "tsc -p tsconfig.json",
                    "tsc:esm": "tsc -p tsconfig.esm.json",
                };
            }
        }
        if (!oldExists) {
            sharedScript.coverage = "yarn run test -- --coverage";
        }
        preScripts.push("yarn run test");
        sharedScript.preversion = preScripts.join(' && ');
        (_c = (_k = pkg.data).scripts) !== null && _c !== void 0 ? _c : (_k.scripts = {});
        if (!oldExists) {
            if ((0, scripts_1.scriptsEntryIsNoTestSpecified)((_d = pkg.data.scripts) === null || _d === void 0 ? void 0 : _d.test) && ((_e = sharedScript.test) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                delete pkg.data.scripts.test;
            }
            if (_findDeps(wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest, '@types/jest') || _findDeps(wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest, 'jest') || _findDeps(wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest, 'ts-jest')) {
                sharedScript.test = "jest --passWithNoTests" /* EnumScriptsEntry.JEST_TEST */;
            }
            Object
                .entries({
                ...(0, pkg_scripts_1.defaultPkgNotOldExists)(),
                ...sharedScript,
            })
                .forEach(([k, v]) => {
                var _a;
                var _b;
                (_a = (_b = pkg.data.scripts)[k]) !== null && _a !== void 0 ? _a : (_b[k] = v);
            });
        }
        else {
            Object
                .entries(sharedScript)
                .forEach(([k, v]) => {
                var _a;
                var _b;
                if (k.endsWith('_') && pkg.data.scripts[k.replace(/_+$/, '')] === v) {
                    return;
                }
                (_a = (_b = pkg.data.scripts)[k]) !== null && _a !== void 0 ? _a : (_b[k] = v);
            });
            if (!pkg.data.types || !pkg.data.typings) {
                pkg.data.types = pkg.data.types || pkg.data.typings;
                if (pkg.data.main && !pkg.data.types) {
                    let file = (0, upath2_1.join)(targetDir, pkg.data.main);
                    let parsed = (0, upath2_1.parse)(file);
                    if (!(0, path_is_same_1.pathIsSame)(targetDir, parsed.dir) && (0, fs_extra_1.pathExistsSync)((0, upath2_1.join)(parsed.dir, parsed.name + '.d.ts'))) {
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
        /*
        console.dir({
            sharedScript,
            scripts: pkg.data.scripts,
            oldExists,
            rootData,
            preScripts,
        })
         */
        if (!oldExists) {
            const cpkg = require('./package.json');
            const findVersion = (name) => {
                var _a, _b, _c;
                return ((_a = cpkg.dependencies) === null || _a === void 0 ? void 0 : _a[name]) || ((_b = cpkg.devDependencies) === null || _b === void 0 ? void 0 : _b[name]) || ((_c = cpkg.peerDependencies) === null || _c === void 0 ? void 0 : _c[name]) || "*";
            };
            pkg.data.dependencies = pkg.data.dependencies || {};
            pkg.data.devDependencies = pkg.data.devDependencies || {};
            pkg.data.peerDependencies = pkg.data.peerDependencies || {};
            if (rootData.isRoot) {
                pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
                pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
            }
            pkg.data.dependencies['tslib'] = findVersion('tslib');
        }
        if (wsProject && !rootData.isWorkspace) {
            const rootKeywords = wsProject.manifest.toJSON().keywords;
            if (!((_f = pkg.data.keywords) === null || _f === void 0 ? void 0 : _f.length) && (rootKeywords === null || rootKeywords === void 0 ? void 0 : rootKeywords.length)) {
                pkg.data.keywords = rootKeywords.slice();
            }
        }
        (_g = (_l = pkg.data).keywords) !== null && _g !== void 0 ? _g : (_l.keywords = []);
        pkg.data.keywords.push('create-by-yarn-tool');
        let file_map = (0, getRootCopyStaticFiles_1.getRootCopyStaticFilesAuto)({
            hasWorkspace: !!wsProject,
            isRoot: !wsProject,
        });
        let mdFile = (0, upath2_1.join)(targetDir, 'README.md');
        let existsReadme = !oldExists || !(0, fs_1.existsSync)(mdFile);
        if (cli.argv.tsdx) {
            ({
                file_map,
                existsReadme,
            } = (0, index_1.setup)({
                targetDir,
                rootData,
                pkg: pkg.data,
                file_map,
                mdFile,
                existsReadme,
                oldExists,
            }));
        }
        pkg.data.scripts = (0, sort_package_json_scripts_1.sortPackageJsonScripts)(pkg.data.scripts);
        /**
         * https://juejin.cn/post/6844903640533041159
         */
        (_h = (_m = pkg.data).sideEffects) !== null && _h !== void 0 ? _h : (_m.sideEffects = false);
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
        (0, static_file_1.copyStaticFiles)({
            cwd: targetDir,
            file_map,
        });
        if (existsReadme) {
            (0, writeReadme_1.writeReadme)({
                file: (0, upath2_1.join)(targetDir, 'README.md'),
                variable: pkg.data,
            });
        }
        if (wsProject && !rootData.isWorkspace) {
            (0, node_modules_link_1.linkToNodeModules)({
                cwd: targetDir,
                sourcePackagePath: targetDir,
                overwrite: true,
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
function _findDeps(pkg, name) {
    var _a, _b, _c;
    pkg !== null && pkg !== void 0 ? pkg : (pkg = {});
    return (_b = (_a = pkg.dependencies) === null || _a === void 0 ? void 0 : _a[name]) !== null && _b !== void 0 ? _b : (_c = pkg.devDependencies) === null || _c === void 0 ? void 0 : _c[name];
}
//# sourceMappingURL=index.js.map