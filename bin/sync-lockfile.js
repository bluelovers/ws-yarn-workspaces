"use strict";
/**
 * Created by user on 2020/1/8.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const index_1 = __importDefault(require("../index"));
let argv = yargs_1.default.
    option('cwd', {
    alias: ['c'],
    default: process.cwd(),
    normalize: true,
    string: true,
})
    .option('silent', {
    boolean: true,
})
    .help(true)
    .showHelpOnFail(true)
    .argv;
index_1.default(argv.cwd, {
    print: !argv.silent
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1sb2NrZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN5bmMtbG9ja2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7OztBQUVILGtEQUEwQjtBQUMxQixxREFBb0M7QUFFcEMsSUFBSSxJQUFJLEdBQUcsZUFBSztJQUNmLE1BQU0sQ0FBQyxLQUFLLEVBQUU7SUFDYixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDWixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTtJQUN2QixTQUFTLEVBQUUsSUFBSTtJQUNmLE1BQU0sRUFBRSxJQUFJO0NBQ1osQ0FBQztLQUNBLE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDakIsT0FBTyxFQUFFLElBQUk7Q0FDYixDQUFDO0tBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQztLQUNWLGNBQWMsQ0FBQyxJQUFJLENBQUM7S0FDcEIsSUFBSSxDQUNMO0FBRUQsZUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDdEIsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU07Q0FDbkIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzguXG4gKi9cblxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCBzeW5jTG9ja2ZpbGUgZnJvbSAnLi4vaW5kZXgnO1xuXG5sZXQgYXJndiA9IHlhcmdzLlxuXHRvcHRpb24oJ2N3ZCcsIHtcblx0XHRhbGlhczogWydjJ10sXG5cdFx0ZGVmYXVsdDogcHJvY2Vzcy5jd2QoKSxcblx0bm9ybWFsaXplOiB0cnVlLFxuXHRzdHJpbmc6IHRydWUsXG59KVxuXHQub3B0aW9uKCdzaWxlbnQnLCB7XG5cdFx0Ym9vbGVhbjogdHJ1ZSxcblx0fSlcblx0LmhlbHAodHJ1ZSlcblx0LnNob3dIZWxwT25GYWlsKHRydWUpXG5cdC5hcmd2XG47XG5cbnN5bmNMb2NrZmlsZShhcmd2LmN3ZCwge1xuXHRwcmludDogIWFyZ3Yuc2lsZW50XG59KTtcbiJdfQ==