"use strict";
/**
 * Created by user on 2019/5/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = void 0;
function setupToYargs(yargs) {
    return yargs
        .default({
    //input: process.cwd(),
    })
        .option('npmClient', {
        alias: ['N'],
        requiresArg: true,
        normalize: true,
        description: 'npm, yarn, ...etc',
        default: 'npm',
        type: 'string',
    })
        .option('yes', {
        alias: ['y', 'silent'],
        //		requiresArg: true,
        //		default: 'npm',
        type: 'boolean',
    })
        .option('cwd', {
        alias: ['C'],
        requiresArg: true,
        normalize: true,
        //		default: process.cwd(),
        defaultDescription: process.cwd(),
        type: 'string',
    })
        .option('skipCheckWorkspace', {
        alias: ['W'],
        type: 'boolean',
    })
        .option('force', {
        alias: ['f'],
        type: 'boolean',
    })
        .option('sort', {
        type: 'boolean',
        default: true,
    })
        .option('private', {
        alias: ['p'],
        type: 'boolean',
    })
        .option('createModule', {
        alias: ['m'],
        type: 'string',
    })
        .option('name', {
        type: 'string',
    })
        .option('copyStatic', {
        type: 'boolean',
    });
}
exports.setupToYargs = setupToYargs;
exports.default = setupToYargs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFyZ3Mtc2V0dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInlhcmdzLXNldHRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7QUFLSCxTQUFnQixZQUFZLENBQUksS0FBYztJQUU3QyxPQUFPLEtBQUs7U0FDVixPQUFPLENBQUM7SUFDUix1QkFBdUI7S0FDdkIsQ0FBQztTQUNELE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDcEIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLElBQUk7UUFDZixXQUFXLEVBQUUsbUJBQW1CO1FBQ2hDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsSUFBSSxFQUFFLFFBQVE7S0FDZCxDQUFDO1NBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNkLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7UUFDekIsc0JBQXNCO1FBQ3RCLG1CQUFtQjtRQUNoQixJQUFJLEVBQUUsU0FBUztLQUNmLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2QsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLElBQUk7UUFDbEIsMkJBQTJCO1FBQ3hCLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7UUFDakMsSUFBSSxFQUFFLFFBQVE7S0FDZCxDQUFDO1NBQ0QsTUFBTSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNaLElBQUksRUFBRSxTQUFTO0tBQ2YsQ0FBQztTQUNELE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDaEIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ1osSUFBSSxFQUFFLFNBQVM7S0FDZixDQUFDO1NBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUNmLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLElBQUk7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNsQixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDWixJQUFJLEVBQUUsU0FBUztLQUNmLENBQUM7U0FDRCxNQUFNLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNaLElBQUksRUFBRSxRQUFRO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDZixJQUFJLEVBQUUsUUFBUTtLQUNkLENBQUM7U0FDRCxNQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JCLElBQUksRUFBRSxTQUFTO0tBQ2YsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQXRERCxvQ0FzREM7QUFFRCxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzUvMTYuXG4gKi9cblxuaW1wb3J0IHlhcmdzID0gcmVxdWlyZSgneWFyZ3MnKTtcbmltcG9ydCB7IEFyZ3YsIE9taXQgfSBmcm9tICd5YXJncyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cFRvWWFyZ3M8VD4oeWFyZ3M6IEFyZ3Y8VD4pXG57XG5cdHJldHVybiB5YXJnc1xuXHRcdC5kZWZhdWx0KHtcblx0XHRcdC8vaW5wdXQ6IHByb2Nlc3MuY3dkKCksXG5cdFx0fSlcblx0XHQub3B0aW9uKCducG1DbGllbnQnLCB7XG5cdFx0XHRhbGlhczogWydOJ10sXG5cdFx0XHRyZXF1aXJlc0FyZzogdHJ1ZSxcblx0XHRcdG5vcm1hbGl6ZTogdHJ1ZSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnbnBtLCB5YXJuLCAuLi5ldGMnLFxuXHRcdFx0ZGVmYXVsdDogJ25wbScsXG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHR9KVxuXHRcdC5vcHRpb24oJ3llcycsIHtcblx0XHRcdGFsaWFzOiBbJ3knLCAnc2lsZW50J10sXG4vL1x0XHRyZXF1aXJlc0FyZzogdHJ1ZSxcbi8vXHRcdGRlZmF1bHQ6ICducG0nLFxuXHRcdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdH0pXG5cdFx0Lm9wdGlvbignY3dkJywge1xuXHRcdFx0YWxpYXM6IFsnQyddLFxuXHRcdFx0cmVxdWlyZXNBcmc6IHRydWUsXG5cdFx0XHRub3JtYWxpemU6IHRydWUsXG4vL1x0XHRkZWZhdWx0OiBwcm9jZXNzLmN3ZCgpLFxuXHRcdFx0ZGVmYXVsdERlc2NyaXB0aW9uOiBwcm9jZXNzLmN3ZCgpLFxuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0fSlcblx0XHQub3B0aW9uKCdza2lwQ2hlY2tXb3Jrc3BhY2UnLCB7XG5cdFx0XHRhbGlhczogWydXJ10sXG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0fSlcblx0XHQub3B0aW9uKCdmb3JjZScsIHtcblx0XHRcdGFsaWFzOiBbJ2YnXSxcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR9KVxuXHRcdC5vcHRpb24oJ3NvcnQnLCB7XG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0XHRkZWZhdWx0OiB0cnVlLFxuXHRcdH0pXG5cdFx0Lm9wdGlvbigncHJpdmF0ZScsIHtcblx0XHRcdGFsaWFzOiBbJ3AnXSxcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR9KVxuXHRcdC5vcHRpb24oJ2NyZWF0ZU1vZHVsZScsIHtcblx0XHRcdGFsaWFzOiBbJ20nXSxcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdH0pXG5cdFx0Lm9wdGlvbignbmFtZScsIHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdH0pXG5cdFx0Lm9wdGlvbignY29weVN0YXRpYycsIHtcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZXR1cFRvWWFyZ3NcbiJdfQ==