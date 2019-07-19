"use strict";
/**
 * Created by user on 2019/7/19.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const _isNpx = require("is-npx");
function isNpx(data) {
    const { __dirname = '' } = data;
    return (_isNpx() || __dirname.includes('_npx'));
}
exports.isNpx = isNpx;
exports.default = isNpx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsaUNBQWtDO0FBRWxDLFNBQWdCLEtBQUssQ0FBQyxJQUVyQjtJQUVBLE1BQU0sRUFBRSxTQUFTLEdBQUcsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRWhDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDaEQsQ0FBQztBQVBELHNCQU9DO0FBRUQsa0JBQWUsS0FBSyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS83LzE5LlxuICovXG5cbmltcG9ydCBfaXNOcHggPSByZXF1aXJlKFwiaXMtbnB4XCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNOcHgoZGF0YToge1xuXHRfX2Rpcm5hbWU/OiBzdHJpbmcsXG59KTogYm9vbGVhblxue1xuXHRjb25zdCB7IF9fZGlybmFtZSA9ICcnIH0gPSBkYXRhO1xuXG5cdHJldHVybiAoX2lzTnB4KCkgfHwgX19kaXJuYW1lLmluY2x1ZGVzKCdfbnB4JykpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTnB4XG4iXX0=