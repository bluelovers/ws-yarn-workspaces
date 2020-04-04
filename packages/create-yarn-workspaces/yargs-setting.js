"use strict";
/**
 * Created by user on 2019/5/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWorkspacesInitToYargs = void 0;
function setupWorkspacesInitToYargs(yargs) {
    return yargs
        .default({
    //input: process.cwd(),
    })
        .option('name', {
        alias: ['n'],
        requiresArg: true,
        normalize: true,
        type: 'string',
    })
        .option('ignoreExistsPackage', {
        boolean: true,
        alias: ['i'],
    })
        .option('ignoreParentWorkspaces', {
        boolean: true,
    })
        .option('debug', {
        boolean: true,
    });
}
exports.setupWorkspacesInitToYargs = setupWorkspacesInitToYargs;
exports.default = setupWorkspacesInitToYargs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFyZ3Mtc2V0dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInlhcmdzLXNldHRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7QUFLSCxTQUFnQiwwQkFBMEIsQ0FBZ0IsS0FBYztJQUV2RSxPQUFPLEtBQUs7U0FDVixPQUFPLENBQUM7SUFDUix1QkFBdUI7S0FDdkIsQ0FBQztTQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDZixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDWixXQUFXLEVBQUUsSUFBSTtRQUNqQixTQUFTLEVBQUUsSUFBSTtRQUNmLElBQUksRUFBRSxRQUFRO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixPQUFPLEVBQUUsSUFBSTtRQUNiLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztLQUNaLENBQUM7U0FDRCxNQUFNLENBQUMsd0JBQXdCLEVBQUU7UUFDakMsT0FBTyxFQUFFLElBQUk7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNoQixPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FDRjtBQUNGLENBQUM7QUF2QkQsZ0VBdUJDO0FBRUQsa0JBQWUsMEJBQTBCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzUvMTYuXG4gKi9cblxuaW1wb3J0IHlhcmdzID0gcmVxdWlyZSgneWFyZ3MnKTtcbmltcG9ydCB7IEFyZ3YsIE9taXQgfSBmcm9tICd5YXJncyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cFdvcmtzcGFjZXNJbml0VG9ZYXJnczxUIGV4dGVuZHMgYW55Pih5YXJnczogQXJndjxUPilcbntcblx0cmV0dXJuIHlhcmdzXG5cdFx0LmRlZmF1bHQoe1xuXHRcdFx0Ly9pbnB1dDogcHJvY2Vzcy5jd2QoKSxcblx0XHR9KVxuXHRcdC5vcHRpb24oJ25hbWUnLCB7XG5cdFx0XHRhbGlhczogWyduJ10sXG5cdFx0XHRyZXF1aXJlc0FyZzogdHJ1ZSxcblx0XHRcdG5vcm1hbGl6ZTogdHJ1ZSxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdH0pXG5cdFx0Lm9wdGlvbignaWdub3JlRXhpc3RzUGFja2FnZScsIHtcblx0XHRcdGJvb2xlYW46IHRydWUsXG5cdFx0XHRhbGlhczogWydpJ10sXG5cdFx0fSlcblx0XHQub3B0aW9uKCdpZ25vcmVQYXJlbnRXb3Jrc3BhY2VzJywge1xuXHRcdFx0Ym9vbGVhbjogdHJ1ZSxcblx0XHR9KVxuXHRcdC5vcHRpb24oJ2RlYnVnJywge1xuXHRcdFx0Ym9vbGVhbjogdHJ1ZSxcblx0XHR9KVxuXHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwV29ya3NwYWNlc0luaXRUb1lhcmdzXG4iXX0=