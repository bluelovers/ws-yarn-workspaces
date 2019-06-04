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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const core_decorators_1 = require("core-decorators");
exports.SYM_CONFIG = Symbol.for('config');
exports.SYM_YARGS = Symbol.for('yargs');
exports.SYM_PROP = Symbol.for('fakeProp');
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
exports.YargsCommandModule = YargsCommandModule;
exports.default = YargsCommandModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7Ozs7Ozs7OztBQUVILHFEQUEyQztBQXNDOUIsUUFBQSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLFFBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFhL0MsTUFBYSxrQkFBa0I7SUFtQjlCLFlBQVksTUFBbUM7UUFqQi9DLFFBQVksR0FBZ0MsRUFBUyxDQUFDO1FBQ3RELFFBQVcsR0FHUCxFQUFFLENBQUM7UUFlTixJQUFJLENBQUMsa0JBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMzQixDQUFDO0lBUkQsTUFBTSxDQUFDLE1BQU0sQ0FBTyxNQUFtQztRQUV0RCxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3hCLENBQUM7SUFPRCx1SUFBdUk7SUFFdkksSUFBSSxPQUFPO1FBRVYsT0FBTyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsS0FBcUM7UUFFaEQsSUFBSSxDQUFDLGtCQUFVLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0lBQ2pDLENBQUM7SUFFRCxvR0FBb0c7SUFFcEcsSUFBSSxRQUFRO1FBRVgsT0FBTyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsS0FBcUI7UUFFakMsSUFBSSxDQUFDLGtCQUFVLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0lBQ2xDLENBQUM7SUFFRCx1SUFBdUk7SUFFdkksSUFBSSxPQUFPO1FB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REFTUjtBQUdEO0lBREMsMEJBQVE7Ozs7aURBSVI7QUF6SEYsZ0RBb0pDO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzUvMjEuXG4gKi9cblxuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICdjb3JlLWRlY29yYXRvcnMnO1xuaW1wb3J0IHsgQXJndW1lbnRzLCBBcmd2LCBDb21tYW5kTW9kdWxlLCBPcHRpb25zLCBDb21tYW5kQnVpbGRlciB9IGZyb20gJ3lhcmdzJztcblxuaW50ZXJmYWNlIElDb21tYW5kTW9kdWxlT21pdFxue1xuXHQvKiogc3RyaW5nIChvciBhcnJheSBvZiBzdHJpbmdzKSB0aGF0IGV4ZWN1dGVzIHRoaXMgY29tbWFuZCB3aGVuIGdpdmVuIG9uIHRoZSBjb21tYW5kIGxpbmUsIGZpcnN0IHN0cmluZyBtYXkgY29udGFpbiBwb3NpdGlvbmFsIGFyZ3MgKi9cblx0Y29tbWFuZDogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgc3RyaW5nO1xuXHQvKiogc3RyaW5nIHVzZWQgYXMgdGhlIGRlc2NyaXB0aW9uIGZvciB0aGUgY29tbWFuZCBpbiBoZWxwIHRleHQsIHVzZSBgZmFsc2VgIGZvciBhIGhpZGRlbiBjb21tYW5kICovXG5cdGRlc2NyaWJlPzogc3RyaW5nIHwgZmFsc2U7XG5cdC8qKiBhcnJheSBvZiBzdHJpbmdzIChvciBhIHNpbmdsZSBzdHJpbmcpIHJlcHJlc2VudGluZyBhbGlhc2VzIG9mIGBleHBvcnRzLmNvbW1hbmRgLCBwb3NpdGlvbmFsIGFyZ3MgZGVmaW5lZCBpbiBhbiBhbGlhcyBhcmUgaWdub3JlZCAqL1xuXHRhbGlhc2VzPzogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBJQ29tbWFuZE1vZHVsZUV4cG9ydHM8VCwgVT4gPVxuXHRJQ29tbWFuZE1vZHVsZU9taXRcblx0JiAoe1xuXHQvKiogb2JqZWN0IGRlY2xhcmluZyB0aGUgb3B0aW9ucyB0aGUgY29tbWFuZCBhY2NlcHRzLCBvciBhIGZ1bmN0aW9uIGFjY2VwdGluZyBhbmQgcmV0dXJuaW5nIGEgeWFyZ3MgaW5zdGFuY2UgKi9cblx0YnVpbGRlcih5YXJnczogQXJndjxUPik6IEFyZ3Y8VT47XG5cdC8qKiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRoZSBwYXJzZWQgYXJndi4gKi9cblx0aGFuZGxlcihhcmdzOiBBcmd1bWVudHM8VT4sIHlhcmdzPzogQXJndjxJVG9yVTxULCBVPj4pOiBhbnkgfCB2b2lkO1xuXHQvL2hhbmRsZXIoYXJnczogQXJndW1lbnRzPFU+KTogdm9pZDtcbn0gfCB7XG5cdC8qKiBvYmplY3QgZGVjbGFyaW5nIHRoZSBvcHRpb25zIHRoZSBjb21tYW5kIGFjY2VwdHMsIG9yIGEgZnVuY3Rpb24gYWNjZXB0aW5nIGFuZCByZXR1cm5pbmcgYSB5YXJncyBpbnN0YW5jZSAqL1xuXHRidWlsZGVyOiB7XG5cdFx0W2tleTogc3RyaW5nXTogT3B0aW9uc1xuXHR9O1xuXHQvKiogYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHBhc3NlZCB0aGUgcGFyc2VkIGFyZ3YuICovXG5cdGhhbmRsZXIoYXJnczogQXJndW1lbnRzPFU+LCB5YXJncz86IEFyZ3Y8SVRvclU8VCwgVT4+KTogYW55IHwgdm9pZDtcblx0Ly9oYW5kbGVyKGFyZ3M6IEFyZ3VtZW50czxVPik6IHZvaWQ7XG59IHwge1xuXHQvKiogYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHBhc3NlZCB0aGUgcGFyc2VkIGFyZ3YuICovXG5cdGhhbmRsZXIoYXJnczogQXJndW1lbnRzPFQ+LCB5YXJncz86IEFyZ3Y8SVRvclU8VCwgVT4+KTogYW55IHwgdm9pZDtcblx0Ly9oYW5kbGVyKGFyZ3M6IEFyZ3VtZW50czxUPik6IHZvaWQ7XG59IHwge1xuXHQvKiogb2JqZWN0IGRlY2xhcmluZyB0aGUgb3B0aW9ucyB0aGUgY29tbWFuZCBhY2NlcHRzLCBvciBhIGZ1bmN0aW9uIGFjY2VwdGluZyBhbmQgcmV0dXJuaW5nIGEgeWFyZ3MgaW5zdGFuY2UgKi9cblx0YnVpbGRlcih5YXJnczogQXJndjxUPik6IEFyZ3Y8VT47XG59KTtcblxuZXhwb3J0IGNvbnN0IFNZTV9DT05GSUcgPSBTeW1ib2wuZm9yKCdjb25maWcnKTtcbmV4cG9ydCBjb25zdCBTWU1fWUFSR1MgPSBTeW1ib2wuZm9yKCd5YXJncycpO1xuZXhwb3J0IGNvbnN0IFNZTV9QUk9QID0gU3ltYm9sLmZvcignZmFrZVByb3AnKTtcblxuZXhwb3J0IHR5cGUgSVRvclU8VCwgVT4gPSBVIGV4dGVuZHMgbmV2ZXIgPyBUXG5cdC8vOiBVIGV4dGVuZHMgdW5rbm93biA/IFRcblx0Ly86IFUgZXh0ZW5kcyB7fSA/IFRcblx0XHQ6IFVcblx0O1xuXG5leHBvcnQgdHlwZSBJVW5wYWNrQ21kTW9kPFQgZXh0ZW5kcyBDb21tYW5kTW9kdWxlLCBEID0gdW5rbm93bj4gPSBUIGV4dGVuZHMgQ29tbWFuZE1vZHVsZTxhbnksIGluZmVyIFU+ID8gVVxuXHQ6IFQgZXh0ZW5kcyBDb21tYW5kTW9kdWxlPGluZmVyIFUsIGFueT4gPyBVXG5cdFx0OiBEXG5cdDtcblxuZXhwb3J0IGNsYXNzIFlhcmdzQ29tbWFuZE1vZHVsZTxULCBVPiBpbXBsZW1lbnRzIElDb21tYW5kTW9kdWxlT21pdFxue1xuXHRbU1lNX0NPTkZJR106IElDb21tYW5kTW9kdWxlRXhwb3J0czxULCBVPiA9IHt9IGFzIGFueTtcblx0W1NZTV9ZQVJHU106IHtcblx0XHRmcm9tPzogQXJndjxUPixcblx0XHR0bz86IEFyZ3Y8SVRvclU8VCwgVT4+LFxuXHR9ID0ge307XG5cblx0LyoqXG5cdCAqIHRoaXMgaXMgZmFrZSBwcm9wIGZvciB0eXBlc2NyaXB0XG5cdCAqIEBkZXByZWNhdGVkXG5cdCAqL1xuXHRyZWFkb25seSBhcmd2OiBBcmd1bWVudHM8SVRvclU8VCwgVT4+O1xuXG5cdHN0YXRpYyBjcmVhdGU8VCwgVT4oY29uZmlnOiBJQ29tbWFuZE1vZHVsZUV4cG9ydHM8VCwgVT4pOiBZYXJnc0NvbW1hbmRNb2R1bGU8VCwgVT5cblx0e1xuXHRcdHJldHVybiBuZXcgdGhpcyhjb25maWcpXG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihjb25maWc6IElDb21tYW5kTW9kdWxlRXhwb3J0czxULCBVPilcblx0e1xuXHRcdHRoaXNbU1lNX0NPTkZJR10gPSBjb25maWc7XG5cdH1cblxuXHQvKiogc3RyaW5nIChvciBhcnJheSBvZiBzdHJpbmdzKSB0aGF0IGV4ZWN1dGVzIHRoaXMgY29tbWFuZCB3aGVuIGdpdmVuIG9uIHRoZSBjb21tYW5kIGxpbmUsIGZpcnN0IHN0cmluZyBtYXkgY29udGFpbiBwb3NpdGlvbmFsIGFyZ3MgKi9cblx0QGF1dG9iaW5kXG5cdGdldCBjb21tYW5kKCk6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB8IHN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXNbU1lNX0NPTkZJR10uY29tbWFuZDtcblx0fVxuXG5cdHNldCBjb21tYW5kKHZhbHVlOiBSZWFkb25seUFycmF5PHN0cmluZz4gfCBzdHJpbmcpXG5cdHtcblx0XHR0aGlzW1NZTV9DT05GSUddLmNvbW1hbmQgPSB2YWx1ZVxuXHR9XG5cblx0LyoqIHN0cmluZyB1c2VkIGFzIHRoZSBkZXNjcmlwdGlvbiBmb3IgdGhlIGNvbW1hbmQgaW4gaGVscCB0ZXh0LCB1c2UgYGZhbHNlYCBmb3IgYSBoaWRkZW4gY29tbWFuZCAqL1xuXHRAYXV0b2JpbmRcblx0Z2V0IGRlc2NyaWJlKCk6IHN0cmluZyB8IGZhbHNlXG5cdHtcblx0XHRyZXR1cm4gdGhpc1tTWU1fQ09ORklHXS5kZXNjcmliZTtcblx0fVxuXG5cdHNldCBkZXNjcmliZSh2YWx1ZTogc3RyaW5nIHwgZmFsc2UpXG5cdHtcblx0XHR0aGlzW1NZTV9DT05GSUddLmRlc2NyaWJlID0gdmFsdWVcblx0fVxuXG5cdC8qKiBhcnJheSBvZiBzdHJpbmdzIChvciBhIHNpbmdsZSBzdHJpbmcpIHJlcHJlc2VudGluZyBhbGlhc2VzIG9mIGBleHBvcnRzLmNvbW1hbmRgLCBwb3NpdGlvbmFsIGFyZ3MgZGVmaW5lZCBpbiBhbiBhbGlhcyBhcmUgaWdub3JlZCAqL1xuXHRAYXV0b2JpbmRcblx0Z2V0IGFsaWFzZXMoKTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgc3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpc1tTWU1fQ09ORklHXS5hbGlhc2VzO1xuXHR9XG5cblx0c2V0IGFsaWFzZXModmFsdWU6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB8IHN0cmluZylcblx0e1xuXHRcdHRoaXNbU1lNX0NPTkZJR10uYWxpYXNlcyA9IHZhbHVlXG5cdH1cblxuXHQvKiogb2JqZWN0IGRlY2xhcmluZyB0aGUgb3B0aW9ucyB0aGUgY29tbWFuZCBhY2NlcHRzLCBvciBhIGZ1bmN0aW9uIGFjY2VwdGluZyBhbmQgcmV0dXJuaW5nIGEgeWFyZ3MgaW5zdGFuY2UgKi9cblx0QGF1dG9iaW5kXG5cdGdldCBidWlsZGVyKCk6IENvbW1hbmRNb2R1bGU8VCwgSVRvclU8VCwgVT4+W1wiYnVpbGRlclwiXVxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGxldCBidWlsZGVyID0gdGhpc1tTWU1fQ09ORklHXS5idWlsZGVyIGFzIENvbW1hbmRNb2R1bGU8VCwgSVRvclU8VCwgVT4+W1wiYnVpbGRlclwiXTtcblxuXHRcdGlmICh0eXBlb2YgYnVpbGRlciA9PSAnZnVuY3Rpb24nKVxuXHRcdHtcblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIGJ1aWxkZXIoeWFyZ3M6IEFyZ3Y8VD4pXG5cdFx0XHR7XG5cdFx0XHRcdHNlbGZbU1lNX1lBUkdTXS5mcm9tID0geWFyZ3M7XG5cblx0XHRcdFx0cmV0dXJuIHNlbGZbU1lNX1lBUkdTXS50byA9IGJ1aWxkZXIuY2FsbCh0aGlzLCB5YXJncylcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cmV0dXJuIHRoaXNbU1lNX0NPTkZJR10uYnVpbGRlcjtcblx0fVxuXG5cdEBhdXRvYmluZFxuXHRnZXQgeWFyZ3MoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXNbU1lNX1lBUkdTXS50bztcblx0fVxuXG5cdC8qKiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRoZSBwYXJzZWQgYXJndi4gKi9cblx0QGF1dG9iaW5kXG5cdGdldCBoYW5kbGVyKCk6IDxSIGV4dGVuZHMgYW55IHwgdm9pZD4oYXJnczogQXJndW1lbnRzPElUb3JVPFQsIFU+PikgPT4gUlxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiB0aGlzLm5ld0hhbmRsZXIodGhpc1tTWU1fQ09ORklHXS5oYW5kbGVyKVxuXHR9XG5cblx0QGF1dG9iaW5kXG5cdHNldEhhbmRsZXI8UiBleHRlbmRzIGFueSB8IHZvaWQ+KGNiOiAoYXJnczogQXJndW1lbnRzPElUb3JVPFQsIFU+PiwgeWFyZ3M/OiBBcmd2PElUb3JVPFQsIFU+PiwgX3NlbGY/OiB0aGlzKSA9PiBSKVxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHRoaXNbU1lNX0NPTkZJR10uaGFuZGxlciA9IGNiO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRAYXV0b2JpbmRcblx0bmV3SGFuZGxlcjxSIGV4dGVuZHMgYW55IHwgdm9pZD4oY2I6IChhcmdzOiBBcmd1bWVudHM8SVRvclU8VCwgVT4+LCB5YXJncz86IEFyZ3Y8SVRvclU8VCwgVT4+LCBfc2VsZj86IHRoaXMpID0+IFIpXG5cdHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gKGFyZ3M6IEFyZ3VtZW50czxJVG9yVTxULCBVPj4pID0+XG5cdFx0e1xuXHRcdFx0cmV0dXJuIGNiKGFyZ3MsIHNlbGZbU1lNX1lBUkdTXS50bywgc2VsZikgYXMgUlxuXHRcdH1cblx0fVxuXG5cdEBhdXRvYmluZFxuXHR0b1ZhbHVlKClcblx0e1xuXHRcdHJldHVybiB0aGlzW1N5bWJvbC50b1ByaW1pdGl2ZV0oKTtcblx0fVxuXG5cdFtTeW1ib2wudG9QcmltaXRpdmVdKCk6IENvbW1hbmRNb2R1bGU8VCwgSVRvclU8VCwgVT4+XG5cdHtcblx0XHRsZXQgeyBjb21tYW5kLCBkZXNjcmliZSwgYWxpYXNlcyB9ID0gdGhpcztcblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGNvbW1hbmQpKVxuXHRcdHtcblx0XHRcdGNvbW1hbmQgPSBjb21tYW5kLnNsaWNlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoYWxpYXNlcykpXG5cdFx0e1xuXHRcdFx0YWxpYXNlcyA9IGFsaWFzZXMuc2xpY2UoKTtcblx0XHR9XG5cblx0XHRsZXQgYnVpbGRlciA9IHRoaXMuYnVpbGRlcjtcblx0XHRsZXQgaGFuZGxlciA9IHRoaXMuaGFuZGxlcjtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRjb21tYW5kLFxuXHRcdFx0YWxpYXNlcyxcblx0XHRcdGRlc2NyaWJlLFxuXHRcdFx0YnVpbGRlcixcblx0XHRcdGhhbmRsZXIsXG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBZYXJnc0NvbW1hbmRNb2R1bGVcbiJdfQ==