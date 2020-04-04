#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const crossSpawn = require("cross-spawn-extra");
const fs = require("fs-extra");
const path = require("path");
const workspaces_config_1 = require("workspaces-config");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const index_1 = require("./lib/index");
const yargs_setting_1 = require("./lib/yargs-setting");
const find_root_1 = require("@yarn-tool/find-root");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
//updateNotifier(__dirname);
let cli = yargs_setting_1.default(yargs);
let argv = cli.argv._;
//console.dir(cli.argv);
let cwd = path.resolve(cli.argv.cwd || process.cwd());
let rootData = find_root_1.findRoot({
    cwd,
    skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});
let hasWorkspace = rootData.ws;
let workspacePrefix;
if (hasWorkspace) {
    let ws = workspaces_config_1.parseStaticPackagesPaths(workspaces_config_1.default(hasWorkspace));
    if (ws.prefix.length) {
        workspacePrefix = ws.prefix[0];
    }
}
let { targetDir, targetName } = index_1.getTargetDir({
    inputName: argv.length && argv[0],
    cwd,
    targetName: cli.argv.name || null,
    hasWorkspace,
    workspacePrefix,
});
fs.ensureDirSync(targetDir);
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
let oldExists = fs.existsSync(path.join(targetDir, 'package.json'));
if (!targetName) {
    try {
        let pkg = new npm_package_json_loader_1.default(path.join(targetDir, 'package.json'));
        old_pkg_name = pkg.data.name;
    }
    catch (e) {
    }
}
let cp = crossSpawn.sync(cli.argv.npmClient, args, {
    stdio: 'inherit',
    cwd: targetDir,
});
if (!cp.error) {
    let pkg = new npm_package_json_loader_1.default(path.join(targetDir, 'package.json'));
    if (pkg.exists()) {
        if (cli.argv.p && cli.argv.npmClient != 'yarn') {
            pkg.data.private = true;
        }
        // 防止 node- 被 npm 移除
        if (!cli.argv.yes && old_pkg_name && /^node-/.test(old_pkg_name) && ('node-' + pkg.data.name) === old_pkg_name) {
            pkg.data.name = old_pkg_name;
        }
        else if (cli.argv.yes && old_pkg_name && pkg.data.name != old_pkg_name) {
            pkg.data.name = old_pkg_name;
        }
        else if (targetName && pkg.data.name != targetName) {
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
                    u.pathname += '/tree/master/' + path.relative(hasWorkspace, targetDir);
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
        Object
            .entries({
            "test:mocha": "npx mocha --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
            "prepublish:lockfile": "npx sync-lockfile .",
            "lint": "npx eslint **/*.ts",
            "ncu": "npx yarn-tool ncu -u",
            "npm:publish": "npm publish",
            "tsc:default": "tsc -p tsconfig.json",
            "tsc:esm": "tsc -p tsconfig.esm.json",
            "sort-package-json": "npx yarn-tool sort",
            "prepublishOnly_": "yarn run ncu && yarn run sort-package-json && yarn run test",
            "postpublish_": `git commit -m "chore(release): publish" .`,
            "coverage": "npx nyc yarn run test",
            "test": `echo "Error: no test specified" && exit 1`,
        })
            .forEach(([k, v]) => {
            if (pkg.data.scripts[k] == null) {
                pkg.data.scripts[k] = v;
            }
        });
        if (!oldExists) {
            const cpkg = require('./package.json');
            const findVersion = (name) => {
                return cpkg.dependencies[name] || cpkg.devDependencies[name] || cpkg.peerDependencies[name] || "latest";
            };
            pkg.data.devDependencies = pkg.data.devDependencies || {};
            pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
            pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
        }
        pkg.autofix();
        if (cli.argv.sort) {
            pkg.sort();
        }
        pkg.writeOnlyWhenLoaded();
        try {
            let copyOptions = {
                overwrite: false,
                preserveTimestamps: true,
                errorOnExist: false,
            };
            fs.copySync(path.join(__dirname, 'lib/static'), targetDir, copyOptions);
        }
        catch (e) {
        }
        index_1.copyStaticFiles(index_1.defaultCopyStaticFiles, {
            cwd: targetDir,
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSwrQkFBZ0M7QUFDaEMsZ0RBQWlEO0FBQ2pELCtCQUFnQztBQUNoQyw2QkFBOEI7QUFDOUIseURBQXdFO0FBQ3hFLHFFQUF3RDtBQUd4RCx1Q0FBb0Y7QUFDcEYsdURBQStDO0FBQy9DLG9EQUFnRDtBQUNoRCwwREFBMkQ7QUFFM0QsNEJBQTRCO0FBRTVCLElBQUksR0FBRyxHQUFHLHVCQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFOUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFdEIsd0JBQXdCO0FBRXhCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFdEQsSUFBSSxRQUFRLEdBQUcsb0JBQVEsQ0FBQztJQUN2QixHQUFHO0lBQ0gsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0I7Q0FDL0MsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLEdBQVcsUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUV2QyxJQUFJLGVBQXVCLENBQUM7QUFFNUIsSUFBSSxZQUFZLEVBQ2hCO0lBQ0MsSUFBSSxFQUFFLEdBQUcsNENBQXdCLENBQUMsMkJBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBRTNELElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQ3BCO1FBQ0MsZUFBZSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0I7Q0FDRDtBQUVELElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEdBQUcsb0JBQVksQ0FBQztJQUM1QyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMs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QUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7Q0FDckIiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCBmaW5kWWFybldvcmtzcGFjZVJvb3QgPSByZXF1aXJlKCdmaW5kLXlhcm4td29ya3NwYWNlLXJvb3QyJyk7XG5pbXBvcnQgeWFyZ3MgPSByZXF1aXJlKCd5YXJncycpO1xuaW1wb3J0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bi1leHRyYScpO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IGdldENvbmZpZywgeyBwYXJzZVN0YXRpY1BhY2thZ2VzUGF0aHMgfSBmcm9tICd3b3Jrc3BhY2VzLWNvbmZpZyc7XG5pbXBvcnQgUGFja2FnZUpzb25Mb2FkZXIgZnJvbSAnbnBtLXBhY2thZ2UtanNvbi1sb2FkZXInO1xuaW1wb3J0IHsgdXBkYXRlTm90aWZpZXIgfSBmcm9tICdAeWFybi10b29sL3VwZGF0ZS1ub3RpZmllcic7XG5pbXBvcnQgcGtnID0gcmVxdWlyZSggJy4vcGFja2FnZS5qc29uJyApO1xuaW1wb3J0IHsgY29weVN0YXRpY0ZpbGVzLCBkZWZhdWx0Q29weVN0YXRpY0ZpbGVzLCBnZXRUYXJnZXREaXIgfSBmcm9tICcuL2xpYi9pbmRleCc7XG5pbXBvcnQgc2V0dXBUb1lhcmdzIGZyb20gJy4vbGliL3lhcmdzLXNldHRpbmcnO1xuaW1wb3J0IHsgZmluZFJvb3QgfSBmcm9tICdAeWFybi10b29sL2ZpbmQtcm9vdCc7XG5pbXBvcnQgeyBucG1Ib3N0ZWRHaXRJbmZvIH0gZnJvbSAnQHlhcm4tdG9vbC9wa2ctZ2l0LWluZm8nO1xuXG4vL3VwZGF0ZU5vdGlmaWVyKF9fZGlybmFtZSk7XG5cbmxldCBjbGkgPSBzZXR1cFRvWWFyZ3MoeWFyZ3MpO1xuXG5sZXQgYXJndiA9IGNsaS5hcmd2Ll87XG5cbi8vY29uc29sZS5kaXIoY2xpLmFyZ3YpO1xuXG5sZXQgY3dkID0gcGF0aC5yZXNvbHZlKGNsaS5hcmd2LmN3ZCB8fCBwcm9jZXNzLmN3ZCgpKTtcblxubGV0IHJvb3REYXRhID0gZmluZFJvb3Qoe1xuXHRjd2QsXG5cdHNraXBDaGVja1dvcmtzcGFjZTogY2xpLmFyZ3Yuc2tpcENoZWNrV29ya3NwYWNlLFxufSk7XG5cbmxldCBoYXNXb3Jrc3BhY2U6IHN0cmluZyA9IHJvb3REYXRhLndzO1xuXG5sZXQgd29ya3NwYWNlUHJlZml4OiBzdHJpbmc7XG5cbmlmIChoYXNXb3Jrc3BhY2UpXG57XG5cdGxldCB3cyA9IHBhcnNlU3RhdGljUGFja2FnZXNQYXRocyhnZXRDb25maWcoaGFzV29ya3NwYWNlKSk7XG5cblx0aWYgKHdzLnByZWZpeC5sZW5ndGgpXG5cdHtcblx0XHR3b3Jrc3BhY2VQcmVmaXggPSB3cy5wcmVmaXhbMF07XG5cdH1cbn1cblxubGV0IHsgdGFyZ2V0RGlyLCB0YXJnZXROYW1lIH0gPSBnZXRUYXJnZXREaXIoe1xuXHRpbnB1dE5hbWU6IGFyZ3YubGVuZ3RoICYmIGFyZ3ZbMF0sXG5cdGN3ZCxcblx0dGFyZ2V0TmFtZTogY2xpLmFyZ3YubmFtZSB8fCBudWxsLFxuXHRoYXNXb3Jrc3BhY2UsXG5cdHdvcmtzcGFjZVByZWZpeCxcbn0pO1xuXG5mcy5lbnN1cmVEaXJTeW5jKHRhcmdldERpcik7XG5cbmxldCBmbGFncyA9IE9iamVjdC5rZXlzKGNsaS5hcmd2KVxuXHQucmVkdWNlKGZ1bmN0aW9uIChhLCBmKVxuXHR7XG5cdFx0aWYgKGYgPT09ICdzaWxlbnQnIHx8IGYgPT09ICd5JyB8fCBmID09PSAneWVzJylcblx0XHR7XG5cblx0XHR9XG5cdFx0ZWxzZSBpZiAoL15bYS16XSQvLnRlc3QoZikgJiYgY2xpLmFyZ3ZbZl0pXG5cdFx0e1xuXHRcdFx0YS5wdXNoKGYpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhO1xuXHR9LCBbXSlcblx0LmpvaW4oJycpXG47XG5cbmxldCBhcmdzID0gW1xuXHQnaW5pdCcsXG5cdChmbGFncyAmJiAnLScgKyBmbGFncyksXG5cdGNsaS5hcmd2LmNyZWF0ZU1vZHVsZSxcblx0Y2xpLmFyZ3YueWVzICYmICcteScsXG5dLmZpbHRlcih2ID0+IHYpO1xuXG4vL2NvbnNvbGUubG9nKGFyZ3MpO1xuXG5sZXQgb2xkX3BrZ19uYW1lOiBzdHJpbmc7XG5sZXQgb2xkRXhpc3RzID0gZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4odGFyZ2V0RGlyLCAncGFja2FnZS5qc29uJykpO1xuXG5pZiAoIXRhcmdldE5hbWUpXG57XG5cdHRyeVxuXHR7XG5cdFx0bGV0IHBrZyA9IG5ldyBQYWNrYWdlSnNvbkxvYWRlcihwYXRoLmpvaW4odGFyZ2V0RGlyLCAncGFja2FnZS5qc29uJykpO1xuXG5cdFx0b2xkX3BrZ19uYW1lID0gcGtnLmRhdGEubmFtZVxuXHR9XG5cdGNhdGNoIChlKVxuXHR7XG5cblx0fVxufVxuXG5sZXQgY3AgPSBjcm9zc1NwYXduLnN5bmMoY2xpLmFyZ3YubnBtQ2xpZW50LCBhcmdzLCB7XG5cdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdGN3ZDogdGFyZ2V0RGlyLFxufSk7XG5cbmlmICghY3AuZXJyb3IpXG57XG5cdGxldCBwa2cgPSBuZXcgUGFja2FnZUpzb25Mb2FkZXIocGF0aC5qb2luKHRhcmdldERpciwgJ3BhY2thZ2UuanNvbicpKTtcblxuXHRpZiAocGtnLmV4aXN0cygpKVxuXHR7XG5cdFx0aWYgKGNsaS5hcmd2LnAgJiYgY2xpLmFyZ3YubnBtQ2xpZW50ICE9ICd5YXJuJylcblx0XHR7XG5cdFx0XHRwa2cuZGF0YS5wcml2YXRlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyDpmLLmraIgbm9kZS0g6KKrIG5wbSDnp7vpmaRcblx0XHRpZiAoIWNsaS5hcmd2LnllcyAmJiBvbGRfcGtnX25hbWUgJiYgL15ub2RlLS8udGVzdChvbGRfcGtnX25hbWUpICYmICgnbm9kZS0nICsgcGtnLmRhdGEubmFtZSkgPT09IG9sZF9wa2dfbmFtZSlcblx0XHR7XG5cdFx0XHRwa2cuZGF0YS5uYW1lID0gb2xkX3BrZ19uYW1lO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjbGkuYXJndi55ZXMgJiYgb2xkX3BrZ19uYW1lICYmIHBrZy5kYXRhLm5hbWUgIT0gb2xkX3BrZ19uYW1lKVxuXHRcdHtcblx0XHRcdHBrZy5kYXRhLm5hbWUgPSBvbGRfcGtnX25hbWU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRhcmdldE5hbWUgJiYgcGtnLmRhdGEubmFtZSAhPSB0YXJnZXROYW1lKVxuXHRcdHtcblx0XHRcdHBrZy5kYXRhLm5hbWUgPSB0YXJnZXROYW1lO1xuXHRcdH1cblxuXHRcdGlmIChwa2cuZGF0YS5uYW1lICYmIC9eQC8udGVzdChwa2cuZGF0YS5uYW1lKSAmJiAhcGtnLmRhdGEucHVibGlzaENvbmZpZylcblx0XHR7XG5cdFx0XHQvL3BrZy5kYXRhLnB1Ymxpc2hDb25maWcgPSB7fTtcblx0XHR9XG5cblx0XHRpZiAoIXBrZy5kYXRhLnNjcmlwdHMpXG5cdFx0e1xuXHRcdFx0cGtnLmRhdGEuc2NyaXB0cyA9IHt9O1xuXHRcdH1cblxuXHRcdGlmICghcGtnLmRhdGEuaG9tZXBhZ2UgfHwgIXBrZy5kYXRhLmJ1Z3MgfHwgIXBrZy5kYXRhLnJlcG9zaXRvcnkpXG5cdFx0e1xuXHRcdFx0dHJ5XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBpbmZvID0gbnBtSG9zdGVkR2l0SW5mbyh0YXJnZXREaXIpO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cGtnLmRhdGEuaG9tZXBhZ2UgPSBwa2cuZGF0YS5ob21lcGFnZSB8fCBpbmZvLmhvbWVwYWdlXG5cblx0XHRcdFx0aWYgKGhhc1dvcmtzcGFjZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCB1ID0gbmV3IFVSTChwa2cuZGF0YS5ob21lcGFnZSBhcyBzdHJpbmcpO1xuXG5cdFx0XHRcdFx0dS5wYXRobmFtZSArPSAnL3RyZWUvbWFzdGVyLycgKyBwYXRoLnJlbGF0aXZlKGhhc1dvcmtzcGFjZSwgdGFyZ2V0RGlyKTtcblxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRwa2cuZGF0YS5ob21lcGFnZSA9IHUudG9TdHJpbmcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBrZy5kYXRhLmJ1Z3MgPSBwa2cuZGF0YS5idWdzIHx8IHtcblx0XHRcdFx0XHR1cmw6IGluZm8uYnVncyxcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBrZy5kYXRhLnJlcG9zaXRvcnkgPSBwa2cuZGF0YS5yZXBvc2l0b3J5IHx8IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJnaXRcIixcblx0XHRcdFx0XHR1cmw6IGluZm8ucmVwb3NpdG9yeSxcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpXG5cdFx0XHR7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRPYmplY3Rcblx0XHRcdC5lbnRyaWVzKHtcblx0XHRcdFx0XCJ0ZXN0Om1vY2hhXCI6IFwibnB4IG1vY2hhIC0tcmVxdWlyZSB0cy1ub2RlL3JlZ2lzdGVyIFxcXCIhKG5vZGVfbW9kdWxlcykvKiovKi57dGVzdCxzcGVjfS57dHMsdHN4fVxcXCJcIixcblx0XHRcdFx0XCJwcmVwdWJsaXNoOmxvY2tmaWxlXCI6IFwibnB4IHN5bmMtbG9ja2ZpbGUgLlwiLFxuXHRcdFx0XHRcImxpbnRcIjogXCJucHggZXNsaW50ICoqLyoudHNcIixcblx0XHRcdFx0XCJuY3VcIjogXCJucHggeWFybi10b29sIG5jdSAtdVwiLFxuXHRcdFx0XHRcIm5wbTpwdWJsaXNoXCI6IFwibnBtIHB1Ymxpc2hcIixcblx0XHRcdFx0XCJ0c2M6ZGVmYXVsdFwiOiBcInRzYyAtcCB0c2NvbmZpZy5qc29uXCIsXG5cdFx0XHRcdFwidHNjOmVzbVwiOiBcInRzYyAtcCB0c2NvbmZpZy5lc20uanNvblwiLFxuXHRcdFx0XHRcInNvcnQtcGFja2FnZS1qc29uXCI6IFwibnB4IHlhcm4tdG9vbCBzb3J0XCIsXG5cdFx0XHRcdFwicHJlcHVibGlzaE9ubHlfXCI6IFwieWFybiBydW4gbmN1ICYmIHlhcm4gcnVuIHNvcnQtcGFja2FnZS1qc29uICYmIHlhcm4gcnVuIHRlc3RcIixcblx0XHRcdFx0XCJwb3N0cHVibGlzaF9cIjogYGdpdCBjb21taXQgLW0gXCJjaG9yZShyZWxlYXNlKTogcHVibGlzaFwiIC5gLFxuXHRcdFx0XHRcImNvdmVyYWdlXCI6IFwibnB4IG55YyB5YXJuIHJ1biB0ZXN0XCIsXG5cdFx0XHRcdFwidGVzdFwiOiBgZWNobyBcIkVycm9yOiBubyB0ZXN0IHNwZWNpZmllZFwiICYmIGV4aXQgMWAsXG5cdFx0XHR9KVxuXHRcdFx0LmZvckVhY2goKFtrLCB2XSkgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKHBrZy5kYXRhLnNjcmlwdHNba10gPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHBrZy5kYXRhLnNjcmlwdHNba10gPSB2O1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdDtcblxuXHRcdGlmICghb2xkRXhpc3RzKVxuXHRcdHtcblx0XHRcdGNvbnN0IGNwa2cgPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpO1xuXG5cdFx0XHRjb25zdCBmaW5kVmVyc2lvbiA9IChuYW1lOiBzdHJpbmcpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBjcGtnLmRlcGVuZGVuY2llc1tuYW1lXSB8fCBjcGtnLmRldkRlcGVuZGVuY2llc1tuYW1lXSB8fCBjcGtnLnBlZXJEZXBlbmRlbmNpZXNbbmFtZV0gfHwgXCJsYXRlc3RcIlxuXHRcdFx0fTtcblxuXHRcdFx0cGtnLmRhdGEuZGV2RGVwZW5kZW5jaWVzID0gcGtnLmRhdGEuZGV2RGVwZW5kZW5jaWVzIHx8IHt9O1xuXG5cdFx0XHRwa2cuZGF0YS5kZXZEZXBlbmRlbmNpZXNbJ0BibHVlbG92ZXJzL3RzY29uZmlnJ10gPSBmaW5kVmVyc2lvbignQGJsdWVsb3ZlcnMvdHNjb25maWcnKTtcblx0XHRcdHBrZy5kYXRhLmRldkRlcGVuZGVuY2llc1snQHR5cGVzL25vZGUnXSA9IGZpbmRWZXJzaW9uKCdAdHlwZXMvbm9kZScpO1xuXHRcdH1cblxuXHRcdHBrZy5hdXRvZml4KCk7XG5cblx0XHRpZiAoY2xpLmFyZ3Yuc29ydClcblx0XHR7XG5cdFx0XHRwa2cuc29ydCgpO1xuXHRcdH1cblxuXHRcdHBrZy53cml0ZU9ubHlXaGVuTG9hZGVkKCk7XG5cblx0XHR0cnlcblx0XHR7XG5cdFx0XHRsZXQgY29weU9wdGlvbnM6IGZzLkNvcHlPcHRpb25zU3luYyA9IHtcblx0XHRcdFx0b3ZlcndyaXRlOiBmYWxzZSxcblx0XHRcdFx0cHJlc2VydmVUaW1lc3RhbXBzOiB0cnVlLFxuXHRcdFx0XHRlcnJvck9uRXhpc3Q6IGZhbHNlLFxuXHRcdFx0fTtcblxuXHRcdFx0ZnMuY29weVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xpYi9zdGF0aWMnKSwgdGFyZ2V0RGlyLCBjb3B5T3B0aW9ucyk7XG5cdFx0fVxuXHRcdGNhdGNoIChlKVxuXHRcdHtcblxuXHRcdH1cblxuXHRcdGNvcHlTdGF0aWNGaWxlcyhkZWZhdWx0Q29weVN0YXRpY0ZpbGVzLCB7XG5cdFx0XHRjd2Q6IHRhcmdldERpcixcblx0XHR9KTtcblxuXHRcdC8qXG5cdFx0ZnMuY29weVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xpYi9maWxlL25wbWlnbm9yZScpLCBwYXRoLmpvaW4odGFyZ2V0RGlyLCAnLm5wbWlnbm9yZScpLCBjb3B5T3B0aW9ucyk7XG5cblx0XHRmcy5jb3B5U3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnbGliL2ZpbGUvZ2l0aWdub3JlJyksIHBhdGguam9pbih0YXJnZXREaXIsICcuZ2l0aWdub3JlJyksIGNvcHlPcHRpb25zKTtcblxuXHRcdGlmICghZnMucGF0aEV4aXN0c1N5bmMocGF0aC5qb2luKHRhcmdldERpciwgJ3RzY29uZmlnLmpzb24nKSkpXG5cdFx0e1xuXHRcdFx0ZnMuY29weVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xpYi9maWxlL3RzY29uZmlnLmpzb24udHBsJyksIHBhdGguam9pbih0YXJnZXREaXIsICd0c2NvbmZpZy5qc29uLnRwbCcpLCBjb3B5T3B0aW9ucyk7XG5cdFx0fVxuXHRcdCAqL1xuXG5cdH1cbn1cbmVsc2Vcbntcblx0cHJvY2Vzcy5leGl0Q29kZSA9IDE7XG59XG4iXX0=