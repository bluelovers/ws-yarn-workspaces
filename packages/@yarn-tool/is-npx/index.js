"use strict";
/**
 * Created by user on 2019/7/19.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_npx_1 = __importDefault(require("is-npx"));
function isNpx(data) {
    const { __dirname = '' } = data;
    return (is_npx_1.default() || __dirname.includes('_npx'));
}
exports.isNpx = isNpx;
exports.default = isNpx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsb0RBQTRCO0FBRTVCLFNBQWdCLEtBQUssQ0FBQyxJQUVyQjtJQUVBLE1BQU0sRUFBRSxTQUFTLEdBQUcsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRWhDLE9BQU8sQ0FBQyxnQkFBTSxFQUFFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQ2hELENBQUM7QUFQRCxzQkFPQztBQUVELGtCQUFlLEtBQUssQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvNy8xOS5cbiAqL1xuXG5pbXBvcnQgX2lzTnB4IGZyb20gXCJpcy1ucHhcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnB4KGRhdGE6IHtcblx0X19kaXJuYW1lPzogc3RyaW5nLFxufSk6IGJvb2xlYW5cbntcblx0Y29uc3QgeyBfX2Rpcm5hbWUgPSAnJyB9ID0gZGF0YTtcblxuXHRyZXR1cm4gKF9pc05weCgpIHx8IF9fZGlybmFtZS5pbmNsdWRlcygnX25weCcpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBpc05weFxuIl19