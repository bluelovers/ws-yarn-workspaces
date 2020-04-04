#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const yargs = require("yargs");
const path = require("path");
const yargs_setting_1 = require("../yargs-setting");
const CWD = process.cwd();
let cli = yargs_setting_1.default(yargs)
    // @ts-ignore
    .command('$0', '', function (yargs) {
    let name = yargs.argv.name || yargs.argv._[0];
    if (name) {
        name = path.join(CWD, name);
    }
    else {
        name = CWD;
    }
    //console.log(CWD, yargs.argv);
    yargs.argv.debug && __1.console.debug(yargs.argv);
    let bool = __1.default(name, {
        ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
        ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
        debug: !!yargs.argv.debug,
    });
    //console.log(77777777777, bool);
    if (!bool) {
        console.log('\n');
        yargs.showHelp();
    }
    else {
        __1.console.success(`done`);
    }
})
    .version()
    .help()
    .argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFybi13cy1pbml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsieWFybi13cy1pbml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDBCQUE0RDtBQUM1RCwrQkFBK0I7QUFDL0IsNkJBQTZCO0FBQzdCLG9EQUEwRDtBQUUxRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxHQUFHLEdBQUcsdUJBQTBCLENBQUMsS0FBSyxDQUFDO0lBQzFDLGFBQWE7S0FDWixPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEtBQUs7SUFFakMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUMsSUFBSSxJQUFJLEVBQ1I7UUFDQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUI7U0FFRDtRQUNDLElBQUksR0FBRyxHQUFHLENBQUM7S0FDWDtJQUVELCtCQUErQjtJQUUvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxXQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QyxJQUFJLElBQUksR0FBRyxXQUFvQixDQUFDLElBQUksRUFBRTtRQUNyQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUI7UUFDckQsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsc0JBQXNCO1FBQzNELEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLO0tBQ3pCLENBQUMsQ0FBQztJQUVILGlDQUFpQztJQUVqQyxJQUFJLENBQUMsSUFBSSxFQUNUO1FBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7U0FFRDtRQUNDLFdBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEI7QUFDRixDQUFDLENBQUM7S0FDRCxPQUFPLEVBQUU7S0FDVCxJQUFJLEVBQUU7S0FDTixJQUFJLENBQ0wiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCBjcmVhdGVZYXJuV29ya3NwYWNlcywgeyBjb25zb2xlIGFzIGRlYnVnIH0gZnJvbSAnLi4nO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBzZXR1cFdvcmtzcGFjZXNJbml0VG9ZYXJncyBmcm9tICcuLi95YXJncy1zZXR0aW5nJztcblxuY29uc3QgQ1dEID0gcHJvY2Vzcy5jd2QoKTtcblxubGV0IGNsaSA9IHNldHVwV29ya3NwYWNlc0luaXRUb1lhcmdzKHlhcmdzKVxuXHQvLyBAdHMtaWdub3JlXG5cdC5jb21tYW5kKCckMCcsICcnLCBmdW5jdGlvbiAoeWFyZ3MpXG5cdHtcblx0XHRsZXQgbmFtZSA9IHlhcmdzLmFyZ3YubmFtZSB8fCB5YXJncy5hcmd2Ll9bMF07XG5cblx0XHRpZiAobmFtZSlcblx0XHR7XG5cdFx0XHRuYW1lID0gcGF0aC5qb2luKENXRCwgbmFtZSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRuYW1lID0gQ1dEO1xuXHRcdH1cblxuXHRcdC8vY29uc29sZS5sb2coQ1dELCB5YXJncy5hcmd2KTtcblxuXHRcdHlhcmdzLmFyZ3YuZGVidWcgJiYgZGVidWcuZGVidWcoeWFyZ3MuYXJndik7XG5cblx0XHRsZXQgYm9vbCA9IGNyZWF0ZVlhcm5Xb3Jrc3BhY2VzKG5hbWUsIHtcblx0XHRcdGlnbm9yZUV4aXN0c1BhY2thZ2U6ICEheWFyZ3MuYXJndi5pZ25vcmVFeGlzdHNQYWNrYWdlLFxuXHRcdFx0aWdub3JlUGFyZW50V29ya3NwYWNlczogISF5YXJncy5hcmd2Lmlnbm9yZVBhcmVudFdvcmtzcGFjZXMsXG5cdFx0XHRkZWJ1ZzogISF5YXJncy5hcmd2LmRlYnVnLFxuXHRcdH0pO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyg3Nzc3Nzc3Nzc3NywgYm9vbCk7XG5cblx0XHRpZiAoIWJvb2wpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coJ1xcbicpO1xuXHRcdFx0eWFyZ3Muc2hvd0hlbHAoKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGRlYnVnLnN1Y2Nlc3MoYGRvbmVgKTtcblx0XHR9XG5cdH0pXG5cdC52ZXJzaW9uKClcblx0LmhlbHAoKVxuXHQuYXJndlxuO1xuIl19