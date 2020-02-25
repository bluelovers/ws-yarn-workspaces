"use strict";
/**
 * Created by user on 2019/5/21.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_decorators_1 = require("core-decorators");
exports.SYM_CONFIG = Symbol.for('config');
exports.SYM_YARGS = Symbol.for('yargs');
exports.SYM_PROP = Symbol.for('fakeProp');
const YargsCommandModule = /** @class */ (() => {
    var _a, _b;
    class YargsCommandModule {
        constructor(config) {
            this[_a] = {};
            this[_b] = {};
            this[exports.SYM_CONFIG] = config;
        }
        static create(config) {
            return new this(config);
        }
        /** string (or array of strings) that executes this command when given on the command line, first string may contain positional args */
        get command() {
            return this[exports.SYM_CONFIG].command;
        }
        set command(value) {
            this[exports.SYM_CONFIG].command = value;
        }
        /** string used as the description for the command in help text, use `false` for a hidden command */
        get describe() {
            return this[exports.SYM_CONFIG].describe;
        }
        set describe(value) {
            this[exports.SYM_CONFIG].describe = value;
        }
        /** array of strings (or a single string) representing aliases of `exports.command`, positional args defined in an alias are ignored */
        get aliases() {
            return this[exports.SYM_CONFIG].aliases;
        }
        set aliases(value) {
            this[exports.SYM_CONFIG].aliases = value;
        }
        /** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
        get builder() {
            // @ts-ignore
            let builder = this[exports.SYM_CONFIG].builder;
            if (typeof builder == 'function') {
                let self = this;
                return function builder(yargs) {
                    self[exports.SYM_YARGS].from = yargs;
                    // @ts-ignore
                    return self[exports.SYM_YARGS].to = builder.call(this, yargs);
                };
            }
            // @ts-ignore
            return this[exports.SYM_CONFIG].builder;
        }
        get yargs() {
            return this[exports.SYM_YARGS].to;
        }
        /** a function which will be passed the parsed argv. */
        get handler() {
            // @ts-ignore
            return this.newHandler(this[exports.SYM_CONFIG].handler);
        }
        setHandler(cb) {
            // @ts-ignore
            this[exports.SYM_CONFIG].handler = cb;
            return this;
        }
        newHandler(cb) {
            let self = this;
            return (args) => {
                return cb(args, self[exports.SYM_YARGS].to, self);
            };
        }
        toValue() {
            return this[Symbol.toPrimitive]();
        }
        [(_a = exports.SYM_CONFIG, _b = exports.SYM_YARGS, Symbol.toPrimitive)]() {
            let { command, describe, aliases } = this;
            if (Array.isArray(command)) {
                command = command.slice();
            }
            if (Array.isArray(aliases)) {
                aliases = aliases.slice();
            }
            let builder = this.builder;
            let handler = this.handler;
            return {
                command,
                aliases,
                describe,
                builder,
                handler,
            };
        }
    }
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], YargsCommandModule.prototype, "command", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], YargsCommandModule.prototype, "describe", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], YargsCommandModule.prototype, "aliases", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], YargsCommandModule.prototype, "builder", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], YargsCommandModule.prototype, "yargs", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], YargsCommandModule.prototype, "handler", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], YargsCommandModule.prototype, "setHandler", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], YargsCommandModule.prototype, "newHandler", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], YargsCommandModule.prototype, "toValue", null);
    return YargsCommandModule;
})();
exports.YargsCommandModule = YargsCommandModule;
exports.default = YargsCommandModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7Ozs7Ozs7O0FBRUgscURBQTJDO0FBc0M5QixRQUFBLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEMsUUFBQSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQWEvQzs7SUFBQSxNQUFhLGtCQUFrQjtRQW1COUIsWUFBWSxNQUFtQztZQWpCL0MsUUFBWSxHQUFnQyxFQUFTLENBQUM7WUFDdEQsUUFBVyxHQUdQLEVBQUUsQ0FBQztZQWVOLElBQUksQ0FBQyxrQkFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNCLENBQUM7UUFSRCxNQUFNLENBQUMsTUFBTSxDQUFPLE1BQW1DO1lBRXRELE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDeEIsQ0FBQztRQU9ELHVJQUF1STtRQUV2SSxJQUFJLE9BQU87WUFFVixPQUFPLElBQUksQ0FBQyxrQkFBVSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFxQztZQUVoRCxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7UUFDakMsQ0FBQztRQUVELG9HQUFvRztRQUVwRyxJQUFJLFFBQVE7WUFFWCxPQUFPLElBQUksQ0FBQyxrQkFBVSxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxJQUFJLFFBQVEsQ0FBQyxLQUFxQjtZQUVqQyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7UUFDbEMsQ0FBQztRQUVELHVJQUF1STtRQUV2SSxJQUFJLE9B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O3dEQU9SO0lBR0Q7UUFEQywwQkFBUTs7Ozt3REFTUjtJQUdEO1FBREMsMEJBQVE7Ozs7cURBSVI7SUEyQkYseUJBQUM7S0FBQTtBQXJKWSxnREFBa0I7QUF1Si9CLGtCQUFlLGtCQUFrQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS81LzIxLlxuICovXG5cbmltcG9ydCB7IGF1dG9iaW5kIH0gZnJvbSAnY29yZS1kZWNvcmF0b3JzJztcbmltcG9ydCB7IEFyZ3VtZW50cywgQXJndiwgQ29tbWFuZE1vZHVsZSwgT3B0aW9ucywgQ29tbWFuZEJ1aWxkZXIgfSBmcm9tICd5YXJncyc7XG5cbmludGVyZmFjZSBJQ29tbWFuZE1vZHVsZU9taXRcbntcblx0LyoqIHN0cmluZyAob3IgYXJyYXkgb2Ygc3RyaW5ncykgdGhhdCBleGVjdXRlcyB0aGlzIGNvbW1hbmQgd2hlbiBnaXZlbiBvbiB0aGUgY29tbWFuZCBsaW5lLCBmaXJzdCBzdHJpbmcgbWF5IGNvbnRhaW4gcG9zaXRpb25hbCBhcmdzICovXG5cdGNvbW1hbmQ6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB8IHN0cmluZztcblx0LyoqIHN0cmluZyB1c2VkIGFzIHRoZSBkZXNjcmlwdGlvbiBmb3IgdGhlIGNvbW1hbmQgaW4gaGVscCB0ZXh0LCB1c2UgYGZhbHNlYCBmb3IgYSBoaWRkZW4gY29tbWFuZCAqL1xuXHRkZXNjcmliZT86IHN0cmluZyB8IGZhbHNlO1xuXHQvKiogYXJyYXkgb2Ygc3RyaW5ncyAob3IgYSBzaW5nbGUgc3RyaW5nKSByZXByZXNlbnRpbmcgYWxpYXNlcyBvZiBgZXhwb3J0cy5jb21tYW5kYCwgcG9zaXRpb25hbCBhcmdzIGRlZmluZWQgaW4gYW4gYWxpYXMgYXJlIGlnbm9yZWQgKi9cblx0YWxpYXNlcz86IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB8IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgSUNvbW1hbmRNb2R1bGVFeHBvcnRzPFQsIFU+ID1cblx0SUNvbW1hbmRNb2R1bGVPbWl0XG5cdCYgKHtcblx0LyoqIG9iamVjdCBkZWNsYXJpbmcgdGhlIG9wdGlvbnMgdGhlIGNvbW1hbmQgYWNjZXB0cywgb3IgYSBmdW5jdGlvbiBhY2NlcHRpbmcgYW5kIHJldHVybmluZyBhIHlhcmdzIGluc3RhbmNlICovXG5cdGJ1aWxkZXIoeWFyZ3M6IEFyZ3Y8VD4pOiBBcmd2PFU+O1xuXHQvKiogYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHBhc3NlZCB0aGUgcGFyc2VkIGFyZ3YuICovXG5cdGhhbmRsZXIoYXJnczogQXJndW1lbnRzPFU+LCB5YXJncz86IEFyZ3Y8SVRvclU8VCwgVT4+KTogYW55IHwgdm9pZDtcblx0Ly9oYW5kbGVyKGFyZ3M6IEFyZ3VtZW50czxVPik6IHZvaWQ7XG59IHwge1xuXHQvKiogb2JqZWN0IGRlY2xhcmluZyB0aGUgb3B0aW9ucyB0aGUgY29tbWFuZCBhY2NlcHRzLCBvciBhIGZ1bmN0aW9uIGFjY2VwdGluZyBhbmQgcmV0dXJuaW5nIGEgeWFyZ3MgaW5zdGFuY2UgKi9cblx0YnVpbGRlcjoge1xuXHRcdFtrZXk6IHN0cmluZ106IE9wdGlvbnNcblx0fTtcblx0LyoqIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBwYXNzZWQgdGhlIHBhcnNlZCBhcmd2LiAqL1xuXHRoYW5kbGVyKGFyZ3M6IEFyZ3VtZW50czxVPiwgeWFyZ3M/OiBBcmd2PElUb3JVPFQsIFU+Pik6IGFueSB8IHZvaWQ7XG5cdC8vaGFuZGxlcihhcmdzOiBBcmd1bWVudHM8VT4pOiB2b2lkO1xufSB8IHtcblx0LyoqIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBwYXNzZWQgdGhlIHBhcnNlZCBhcmd2LiAqL1xuXHRoYW5kbGVyKGFyZ3M6IEFyZ3VtZW50czxUPiwgeWFyZ3M/OiBBcmd2PElUb3JVPFQsIFU+Pik6IGFueSB8IHZvaWQ7XG5cdC8vaGFuZGxlcihhcmdzOiBBcmd1bWVudHM8VD4pOiB2b2lkO1xufSB8IHtcblx0LyoqIG9iamVjdCBkZWNsYXJpbmcgdGhlIG9wdGlvbnMgdGhlIGNvbW1hbmQgYWNjZXB0cywgb3IgYSBmdW5jdGlvbiBhY2NlcHRpbmcgYW5kIHJldHVybmluZyBhIHlhcmdzIGluc3RhbmNlICovXG5cdGJ1aWxkZXIoeWFyZ3M6IEFyZ3Y8VD4pOiBBcmd2PFU+O1xufSk7XG5cbmV4cG9ydCBjb25zdCBTWU1fQ09ORklHID0gU3ltYm9sLmZvcignY29uZmlnJyk7XG5leHBvcnQgY29uc3QgU1lNX1lBUkdTID0gU3ltYm9sLmZvcigneWFyZ3MnKTtcbmV4cG9ydCBjb25zdCBTWU1fUFJPUCA9IFN5bWJvbC5mb3IoJ2Zha2VQcm9wJyk7XG5cbmV4cG9ydCB0eXBlIElUb3JVPFQsIFU+ID0gVSBleHRlbmRzIG5ldmVyID8gVFxuXHQvLzogVSBleHRlbmRzIHVua25vd24gPyBUXG5cdC8vOiBVIGV4dGVuZHMge30gPyBUXG5cdFx0OiBVXG5cdDtcblxuZXhwb3J0IHR5cGUgSVVucGFja0NtZE1vZDxUIGV4dGVuZHMgQ29tbWFuZE1vZHVsZSwgRCA9IHVua25vd24+ID0gVCBleHRlbmRzIENvbW1hbmRNb2R1bGU8YW55LCBpbmZlciBVPiA/IFVcblx0OiBUIGV4dGVuZHMgQ29tbWFuZE1vZHVsZTxpbmZlciBVLCBhbnk+ID8gVVxuXHRcdDogRFxuXHQ7XG5cbmV4cG9ydCBjbGFzcyBZYXJnc0NvbW1hbmRNb2R1bGU8VCwgVT4gaW1wbGVtZW50cyBJQ29tbWFuZE1vZHVsZU9taXRcbntcblx0W1NZTV9DT05GSUddOiBJQ29tbWFuZE1vZHVsZUV4cG9ydHM8VCwgVT4gPSB7fSBhcyBhbnk7XG5cdFtTWU1fWUFSR1NdOiB7XG5cdFx0ZnJvbT86IEFyZ3Y8VD4sXG5cdFx0dG8/OiBBcmd2PElUb3JVPFQsIFU+Pixcblx0fSA9IHt9O1xuXG5cdC8qKlxuXHQgKiB0aGlzIGlzIGZha2UgcHJvcCBmb3IgdHlwZXNjcmlwdFxuXHQgKiBAZGVwcmVjYXRlZFxuXHQgKi9cblx0cmVhZG9ubHkgYXJndjogQXJndW1lbnRzPElUb3JVPFQsIFU+PjtcblxuXHRzdGF0aWMgY3JlYXRlPFQsIFU+KGNvbmZpZzogSUNvbW1hbmRNb2R1bGVFeHBvcnRzPFQsIFU+KTogWWFyZ3NDb21tYW5kTW9kdWxlPFQsIFU+XG5cdHtcblx0XHRyZXR1cm4gbmV3IHRoaXMoY29uZmlnKVxuXHR9XG5cblx0Y29uc3RydWN0b3IoY29uZmlnOiBJQ29tbWFuZE1vZHVsZUV4cG9ydHM8VCwgVT4pXG5cdHtcblx0XHR0aGlzW1NZTV9DT05GSUddID0gY29uZmlnO1xuXHR9XG5cblx0LyoqIHN0cmluZyAob3IgYXJyYXkgb2Ygc3RyaW5ncykgdGhhdCBleGVjdXRlcyB0aGlzIGNvbW1hbmQgd2hlbiBnaXZlbiBvbiB0aGUgY29tbWFuZCBsaW5lLCBmaXJzdCBzdHJpbmcgbWF5IGNvbnRhaW4gcG9zaXRpb25hbCBhcmdzICovXG5cdEBhdXRvYmluZFxuXHRnZXQgY29tbWFuZCgpOiBSZWFkb25seUFycmF5PHN0cmluZz4gfCBzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzW1NZTV9DT05GSUddLmNvbW1hbmQ7XG5cdH1cblxuXHRzZXQgY29tbWFuZCh2YWx1ZTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgc3RyaW5nKVxuXHR7XG5cdFx0dGhpc1tTWU1fQ09ORklHXS5jb21tYW5kID0gdmFsdWVcblx0fVxuXG5cdC8qKiBzdHJpbmcgdXNlZCBhcyB0aGUgZGVzY3JpcHRpb24gZm9yIHRoZSBjb21tYW5kIGluIGhlbHAgdGV4dCwgdXNlIGBmYWxzZWAgZm9yIGEgaGlkZGVuIGNvbW1hbmQgKi9cblx0QGF1dG9iaW5kXG5cdGdldCBkZXNjcmliZSgpOiBzdHJpbmcgfCBmYWxzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXNbU1lNX0NPTkZJR10uZGVzY3JpYmU7XG5cdH1cblxuXHRzZXQgZGVzY3JpYmUodmFsdWU6IHN0cmluZyB8IGZhbHNlKVxuXHR7XG5cdFx0dGhpc1tTWU1fQ09ORklHXS5kZXNjcmliZSA9IHZhbHVlXG5cdH1cblxuXHQvKiogYXJyYXkgb2Ygc3RyaW5ncyAob3IgYSBzaW5nbGUgc3RyaW5nKSByZXByZXNlbnRpbmcgYWxpYXNlcyBvZiBgZXhwb3J0cy5jb21tYW5kYCwgcG9zaXRpb25hbCBhcmdzIGRlZmluZWQgaW4gYW4gYWxpYXMgYXJlIGlnbm9yZWQgKi9cblx0QGF1dG9iaW5kXG5cdGdldCBhbGlhc2VzKCk6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB8IHN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXNbU1lNX0NPTkZJR10uYWxpYXNlcztcblx0fVxuXG5cdHNldCBhbGlhc2VzKHZhbHVlOiBSZWFkb25seUFycmF5PHN0cmluZz4gfCBzdHJpbmcpXG5cdHtcblx0XHR0aGlzW1NZTV9DT05GSUddLmFsaWFzZXMgPSB2YWx1ZVxuXHR9XG5cblx0LyoqIG9iamVjdCBkZWNsYXJpbmcgdGhlIG9wdGlvbnMgdGhlIGNvbW1hbmQgYWNjZXB0cywgb3IgYSBmdW5jdGlvbiBhY2NlcHRpbmcgYW5kIHJldHVybmluZyBhIHlhcmdzIGluc3RhbmNlICovXG5cdEBhdXRvYmluZFxuXHRnZXQgYnVpbGRlcigpOiBDb21tYW5kTW9kdWxlPFQsIElUb3JVPFQsIFU+PltcImJ1aWxkZXJcIl1cblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRsZXQgYnVpbGRlciA9IHRoaXNbU1lNX0NPTkZJR10uYnVpbGRlciBhcyBDb21tYW5kTW9kdWxlPFQsIElUb3JVPFQsIFU+PltcImJ1aWxkZXJcIl07XG5cblx0XHRpZiAodHlwZW9mIGJ1aWxkZXIgPT0gJ2Z1bmN0aW9uJylcblx0XHR7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiBidWlsZGVyKHlhcmdzOiBBcmd2PFQ+KVxuXHRcdFx0e1xuXHRcdFx0XHRzZWxmW1NZTV9ZQVJHU10uZnJvbSA9IHlhcmdzO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHNlbGZbU1lNX1lBUkdTXS50byA9IGJ1aWxkZXIuY2FsbCh0aGlzLCB5YXJncylcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cmV0dXJuIHRoaXNbU1lNX0NPTkZJR10uYnVpbGRlcjtcblx0fVxuXG5cdEBhdXRvYmluZFxuXHRnZXQgeWFyZ3MoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXNbU1lNX1lBUkdTXS50bztcblx0fVxuXG5cdC8qKiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRoZSBwYXJzZWQgYXJndi4gKi9cblx0QGF1dG9iaW5kXG5cdGdldCBoYW5kbGVyKCk6IDxSIGV4dGVuZHMgYW55IHwgdm9pZD4oYXJnczogQXJndW1lbnRzPElUb3JVPFQsIFU+PikgPT4gUlxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiB0aGlzLm5ld0hhbmRsZXIodGhpc1tTWU1fQ09ORklHXS5oYW5kbGVyKVxuXHR9XG5cblx0QGF1dG9iaW5kXG5cdHNldEhhbmRsZXI8UiBleHRlbmRzIGFueSB8IHZvaWQ+KGNiOiAoYXJnczogQXJndW1lbnRzPElUb3JVPFQsIFU+PiwgeWFyZ3M/OiBBcmd2PElUb3JVPFQsIFU+PiwgX3NlbGY/OiB0aGlzKSA9PiBSKVxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHRoaXNbU1lNX0NPTkZJR10uaGFuZGxlciA9IGNiO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRAYXV0b2JpbmRcblx0bmV3SGFuZGxlcjxSIGV4dGVuZHMgYW55IHwgdm9pZD4oY2I6IChhcmdzOiBBcmd1bWVudHM8SVRvclU8VCwgVT4+LCB5YXJncz86IEFyZ3Y8SVRvclU8VCwgVT4+LCBfc2VsZj86IHRoaXMpID0+IFIpXG5cdHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gKGFyZ3M6IEFyZ3VtZW50czxJVG9yVTxULCBVPj4pID0+XG5cdFx0e1xuXHRcdFx0cmV0dXJuIGNiKGFyZ3MsIHNlbGZbU1lNX1lBUkdTXS50bywgc2VsZikgYXMgUlxuXHRcdH1cblx0fVxuXG5cdEBhdXRvYmluZFxuXHR0b1ZhbHVlKClcblx0e1xuXHRcdHJldHVybiB0aGlzW1N5bWJvbC50b1ByaW1pdGl2ZV0oKTtcblx0fVxuXG5cdFtTeW1ib2wudG9QcmltaXRpdmVdKCk6IENvbW1hbmRNb2R1bGU8VCwgSVRvclU8VCwgVT4+XG5cdHtcblx0XHRsZXQgeyBjb21tYW5kLCBkZXNjcmliZSwgYWxpYXNlcyB9ID0gdGhpcztcblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGNvbW1hbmQpKVxuXHRcdHtcblx0XHRcdGNvbW1hbmQgPSBjb21tYW5kLnNsaWNlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoYWxpYXNlcykpXG5cdFx0e1xuXHRcdFx0YWxpYXNlcyA9IGFsaWFzZXMuc2xpY2UoKTtcblx0XHR9XG5cblx0XHRsZXQgYnVpbGRlciA9IHRoaXMuYnVpbGRlcjtcblx0XHRsZXQgaGFuZGxlciA9IHRoaXMuaGFuZGxlcjtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRjb21tYW5kLFxuXHRcdFx0YWxpYXNlcyxcblx0XHRcdGRlc2NyaWJlLFxuXHRcdFx0YnVpbGRlcixcblx0XHRcdGhhbmRsZXIsXG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBZYXJnc0NvbW1hbmRNb2R1bGVcbiJdfQ==