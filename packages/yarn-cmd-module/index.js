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
exports.YargsCommandModule = YargsCommandModule;
exports.default = YargsCommandModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7Ozs7Ozs7OztBQUVILHFEQUEyQztBQXNDOUIsUUFBQSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLFFBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFhL0MsTUFBYSxrQkFBa0I7SUFtQjlCLFlBQVksTUFBbUM7UUFqQi9DLFFBQVksR0FBZ0MsRUFBUyxDQUFDO1FBQ3RELFFBQVcsR0FHUCxFQUFFLENBQUM7UUFlTixJQUFJLENBQUMsa0JBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMzQixDQUFDO0lBUkQsTUFBTSxDQUFDLE1BQU0sQ0FBTyxNQUFtQztRQUV0RCxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3hCLENBQUM7SUFPRCx1SUFBdUk7SUFFdkksSUFBSSxPQUFPO1FBRVYsT0FBTyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsS0FBcUM7UUFFaEQsSUFBSSxDQUFDLGtCQUFVLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0lBQ2pDLENBQUM7SUFFRCxvR0FBb0c7SUFFcEcsSUFBSSxRQUFRO1FBRVgsT0FBTyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsS0FBcUI7UUFFakMsSUFBSSxDQUFDLGtCQUFVLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0lBQ2xDLENBQUM7SUFFRCx1SUFBdUk7SUFFdkksSUFBSSxPQUFPO1FB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LDBCQUFROzs7O29EQVNSO0FBR0Q7SUFEQywwQkFBUTs7OztpREFJUjtBQTFIRixnREFxSkM7QUFFRCxrQkFBZSxrQkFBa0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvNS8yMS5cbiAqL1xuXG5pbXBvcnQgeyBhdXRvYmluZCB9IGZyb20gJ2NvcmUtZGVjb3JhdG9ycyc7XG5pbXBvcnQgeyBBcmd1bWVudHMsIEFyZ3YsIENvbW1hbmRNb2R1bGUsIE9wdGlvbnMsIENvbW1hbmRCdWlsZGVyIH0gZnJvbSAneWFyZ3MnO1xuXG5pbnRlcmZhY2UgSUNvbW1hbmRNb2R1bGVPbWl0XG57XG5cdC8qKiBzdHJpbmcgKG9yIGFycmF5IG9mIHN0cmluZ3MpIHRoYXQgZXhlY3V0ZXMgdGhpcyBjb21tYW5kIHdoZW4gZ2l2ZW4gb24gdGhlIGNvbW1hbmQgbGluZSwgZmlyc3Qgc3RyaW5nIG1heSBjb250YWluIHBvc2l0aW9uYWwgYXJncyAqL1xuXHRjb21tYW5kOiBSZWFkb25seUFycmF5PHN0cmluZz4gfCBzdHJpbmc7XG5cdC8qKiBzdHJpbmcgdXNlZCBhcyB0aGUgZGVzY3JpcHRpb24gZm9yIHRoZSBjb21tYW5kIGluIGhlbHAgdGV4dCwgdXNlIGBmYWxzZWAgZm9yIGEgaGlkZGVuIGNvbW1hbmQgKi9cblx0ZGVzY3JpYmU/OiBzdHJpbmcgfCBmYWxzZTtcblx0LyoqIGFycmF5IG9mIHN0cmluZ3MgKG9yIGEgc2luZ2xlIHN0cmluZykgcmVwcmVzZW50aW5nIGFsaWFzZXMgb2YgYGV4cG9ydHMuY29tbWFuZGAsIHBvc2l0aW9uYWwgYXJncyBkZWZpbmVkIGluIGFuIGFsaWFzIGFyZSBpZ25vcmVkICovXG5cdGFsaWFzZXM/OiBSZWFkb25seUFycmF5PHN0cmluZz4gfCBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIElDb21tYW5kTW9kdWxlRXhwb3J0czxULCBVPiA9XG5cdElDb21tYW5kTW9kdWxlT21pdFxuXHQmICh7XG5cdC8qKiBvYmplY3QgZGVjbGFyaW5nIHRoZSBvcHRpb25zIHRoZSBjb21tYW5kIGFjY2VwdHMsIG9yIGEgZnVuY3Rpb24gYWNjZXB0aW5nIGFuZCByZXR1cm5pbmcgYSB5YXJncyBpbnN0YW5jZSAqL1xuXHRidWlsZGVyKHlhcmdzOiBBcmd2PFQ+KTogQXJndjxVPjtcblx0LyoqIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBwYXNzZWQgdGhlIHBhcnNlZCBhcmd2LiAqL1xuXHRoYW5kbGVyKGFyZ3M6IEFyZ3VtZW50czxVPiwgeWFyZ3M/OiBBcmd2PElUb3JVPFQsIFU+Pik6IGFueSB8IHZvaWQ7XG5cdC8vaGFuZGxlcihhcmdzOiBBcmd1bWVudHM8VT4pOiB2b2lkO1xufSB8IHtcblx0LyoqIG9iamVjdCBkZWNsYXJpbmcgdGhlIG9wdGlvbnMgdGhlIGNvbW1hbmQgYWNjZXB0cywgb3IgYSBmdW5jdGlvbiBhY2NlcHRpbmcgYW5kIHJldHVybmluZyBhIHlhcmdzIGluc3RhbmNlICovXG5cdGJ1aWxkZXI6IHtcblx0XHRba2V5OiBzdHJpbmddOiBPcHRpb25zXG5cdH07XG5cdC8qKiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRoZSBwYXJzZWQgYXJndi4gKi9cblx0aGFuZGxlcihhcmdzOiBBcmd1bWVudHM8VT4sIHlhcmdzPzogQXJndjxJVG9yVTxULCBVPj4pOiBhbnkgfCB2b2lkO1xuXHQvL2hhbmRsZXIoYXJnczogQXJndW1lbnRzPFU+KTogdm9pZDtcbn0gfCB7XG5cdC8qKiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRoZSBwYXJzZWQgYXJndi4gKi9cblx0aGFuZGxlcihhcmdzOiBBcmd1bWVudHM8VD4sIHlhcmdzPzogQXJndjxJVG9yVTxULCBVPj4pOiBhbnkgfCB2b2lkO1xuXHQvL2hhbmRsZXIoYXJnczogQXJndW1lbnRzPFQ+KTogdm9pZDtcbn0gfCB7XG5cdC8qKiBvYmplY3QgZGVjbGFyaW5nIHRoZSBvcHRpb25zIHRoZSBjb21tYW5kIGFjY2VwdHMsIG9yIGEgZnVuY3Rpb24gYWNjZXB0aW5nIGFuZCByZXR1cm5pbmcgYSB5YXJncyBpbnN0YW5jZSAqL1xuXHRidWlsZGVyKHlhcmdzOiBBcmd2PFQ+KTogQXJndjxVPjtcbn0pO1xuXG5leHBvcnQgY29uc3QgU1lNX0NPTkZJRyA9IFN5bWJvbC5mb3IoJ2NvbmZpZycpO1xuZXhwb3J0IGNvbnN0IFNZTV9ZQVJHUyA9IFN5bWJvbC5mb3IoJ3lhcmdzJyk7XG5leHBvcnQgY29uc3QgU1lNX1BST1AgPSBTeW1ib2wuZm9yKCdmYWtlUHJvcCcpO1xuXG5leHBvcnQgdHlwZSBJVG9yVTxULCBVPiA9IFUgZXh0ZW5kcyBuZXZlciA/IFRcblx0Ly86IFUgZXh0ZW5kcyB1bmtub3duID8gVFxuXHQvLzogVSBleHRlbmRzIHt9ID8gVFxuXHRcdDogVVxuXHQ7XG5cbmV4cG9ydCB0eXBlIElVbnBhY2tDbWRNb2Q8VCBleHRlbmRzIENvbW1hbmRNb2R1bGUsIEQgPSB1bmtub3duPiA9IFQgZXh0ZW5kcyBDb21tYW5kTW9kdWxlPGFueSwgaW5mZXIgVT4gPyBVXG5cdDogVCBleHRlbmRzIENvbW1hbmRNb2R1bGU8aW5mZXIgVSwgYW55PiA/IFVcblx0XHQ6IERcblx0O1xuXG5leHBvcnQgY2xhc3MgWWFyZ3NDb21tYW5kTW9kdWxlPFQsIFU+IGltcGxlbWVudHMgSUNvbW1hbmRNb2R1bGVPbWl0XG57XG5cdFtTWU1fQ09ORklHXTogSUNvbW1hbmRNb2R1bGVFeHBvcnRzPFQsIFU+ID0ge30gYXMgYW55O1xuXHRbU1lNX1lBUkdTXToge1xuXHRcdGZyb20/OiBBcmd2PFQ+LFxuXHRcdHRvPzogQXJndjxJVG9yVTxULCBVPj4sXG5cdH0gPSB7fTtcblxuXHQvKipcblx0ICogdGhpcyBpcyBmYWtlIHByb3AgZm9yIHR5cGVzY3JpcHRcblx0ICogQGRlcHJlY2F0ZWRcblx0ICovXG5cdHJlYWRvbmx5IGFyZ3Y6IEFyZ3VtZW50czxJVG9yVTxULCBVPj47XG5cblx0c3RhdGljIGNyZWF0ZTxULCBVPihjb25maWc6IElDb21tYW5kTW9kdWxlRXhwb3J0czxULCBVPik6IFlhcmdzQ29tbWFuZE1vZHVsZTxULCBVPlxuXHR7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKGNvbmZpZylcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGNvbmZpZzogSUNvbW1hbmRNb2R1bGVFeHBvcnRzPFQsIFU+KVxuXHR7XG5cdFx0dGhpc1tTWU1fQ09ORklHXSA9IGNvbmZpZztcblx0fVxuXG5cdC8qKiBzdHJpbmcgKG9yIGFycmF5IG9mIHN0cmluZ3MpIHRoYXQgZXhlY3V0ZXMgdGhpcyBjb21tYW5kIHdoZW4gZ2l2ZW4gb24gdGhlIGNvbW1hbmQgbGluZSwgZmlyc3Qgc3RyaW5nIG1heSBjb250YWluIHBvc2l0aW9uYWwgYXJncyAqL1xuXHRAYXV0b2JpbmRcblx0Z2V0IGNvbW1hbmQoKTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgc3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpc1tTWU1fQ09ORklHXS5jb21tYW5kO1xuXHR9XG5cblx0c2V0IGNvbW1hbmQodmFsdWU6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB8IHN0cmluZylcblx0e1xuXHRcdHRoaXNbU1lNX0NPTkZJR10uY29tbWFuZCA9IHZhbHVlXG5cdH1cblxuXHQvKiogc3RyaW5nIHVzZWQgYXMgdGhlIGRlc2NyaXB0aW9uIGZvciB0aGUgY29tbWFuZCBpbiBoZWxwIHRleHQsIHVzZSBgZmFsc2VgIGZvciBhIGhpZGRlbiBjb21tYW5kICovXG5cdEBhdXRvYmluZFxuXHRnZXQgZGVzY3JpYmUoKTogc3RyaW5nIHwgZmFsc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzW1NZTV9DT05GSUddLmRlc2NyaWJlO1xuXHR9XG5cblx0c2V0IGRlc2NyaWJlKHZhbHVlOiBzdHJpbmcgfCBmYWxzZSlcblx0e1xuXHRcdHRoaXNbU1lNX0NPTkZJR10uZGVzY3JpYmUgPSB2YWx1ZVxuXHR9XG5cblx0LyoqIGFycmF5IG9mIHN0cmluZ3MgKG9yIGEgc2luZ2xlIHN0cmluZykgcmVwcmVzZW50aW5nIGFsaWFzZXMgb2YgYGV4cG9ydHMuY29tbWFuZGAsIHBvc2l0aW9uYWwgYXJncyBkZWZpbmVkIGluIGFuIGFsaWFzIGFyZSBpZ25vcmVkICovXG5cdEBhdXRvYmluZFxuXHRnZXQgYWxpYXNlcygpOiBSZWFkb25seUFycmF5PHN0cmluZz4gfCBzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzW1NZTV9DT05GSUddLmFsaWFzZXM7XG5cdH1cblxuXHRzZXQgYWxpYXNlcyh2YWx1ZTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgc3RyaW5nKVxuXHR7XG5cdFx0dGhpc1tTWU1fQ09ORklHXS5hbGlhc2VzID0gdmFsdWVcblx0fVxuXG5cdC8qKiBvYmplY3QgZGVjbGFyaW5nIHRoZSBvcHRpb25zIHRoZSBjb21tYW5kIGFjY2VwdHMsIG9yIGEgZnVuY3Rpb24gYWNjZXB0aW5nIGFuZCByZXR1cm5pbmcgYSB5YXJncyBpbnN0YW5jZSAqL1xuXHRAYXV0b2JpbmRcblx0Z2V0IGJ1aWxkZXIoKTogQ29tbWFuZE1vZHVsZTxULCBJVG9yVTxULCBVPj5bXCJidWlsZGVyXCJdXG5cdHtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0bGV0IGJ1aWxkZXIgPSB0aGlzW1NZTV9DT05GSUddLmJ1aWxkZXIgYXMgQ29tbWFuZE1vZHVsZTxULCBJVG9yVTxULCBVPj5bXCJidWlsZGVyXCJdO1xuXG5cdFx0aWYgKHR5cGVvZiBidWlsZGVyID09ICdmdW5jdGlvbicpXG5cdFx0e1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gYnVpbGRlcih5YXJnczogQXJndjxUPilcblx0XHRcdHtcblx0XHRcdFx0c2VsZltTWU1fWUFSR1NdLmZyb20gPSB5YXJncztcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBzZWxmW1NZTV9ZQVJHU10udG8gPSBidWlsZGVyLmNhbGwodGhpcywgeWFyZ3MpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiB0aGlzW1NZTV9DT05GSUddLmJ1aWxkZXI7XG5cdH1cblxuXHRAYXV0b2JpbmRcblx0Z2V0IHlhcmdzKClcblx0e1xuXHRcdHJldHVybiB0aGlzW1NZTV9ZQVJHU10udG87XG5cdH1cblxuXHQvKiogYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHBhc3NlZCB0aGUgcGFyc2VkIGFyZ3YuICovXG5cdEBhdXRvYmluZFxuXHRnZXQgaGFuZGxlcigpOiA8UiBleHRlbmRzIGFueSB8IHZvaWQ+KGFyZ3M6IEFyZ3VtZW50czxJVG9yVTxULCBVPj4pID0+IFJcblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRyZXR1cm4gdGhpcy5uZXdIYW5kbGVyKHRoaXNbU1lNX0NPTkZJR10uaGFuZGxlcilcblx0fVxuXG5cdEBhdXRvYmluZFxuXHRzZXRIYW5kbGVyPFIgZXh0ZW5kcyBhbnkgfCB2b2lkPihjYjogKGFyZ3M6IEFyZ3VtZW50czxJVG9yVTxULCBVPj4sIHlhcmdzPzogQXJndjxJVG9yVTxULCBVPj4sIF9zZWxmPzogdGhpcykgPT4gUilcblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzW1NZTV9DT05GSUddLmhhbmRsZXIgPSBjYjtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0QGF1dG9iaW5kXG5cdG5ld0hhbmRsZXI8UiBleHRlbmRzIGFueSB8IHZvaWQ+KGNiOiAoYXJnczogQXJndW1lbnRzPElUb3JVPFQsIFU+PiwgeWFyZ3M/OiBBcmd2PElUb3JVPFQsIFU+PiwgX3NlbGY/OiB0aGlzKSA9PiBSKVxuXHR7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIChhcmdzOiBBcmd1bWVudHM8SVRvclU8VCwgVT4+KSA9PlxuXHRcdHtcblx0XHRcdHJldHVybiBjYihhcmdzLCBzZWxmW1NZTV9ZQVJHU10udG8sIHNlbGYpIGFzIFJcblx0XHR9XG5cdH1cblxuXHRAYXV0b2JpbmRcblx0dG9WYWx1ZSgpXG5cdHtcblx0XHRyZXR1cm4gdGhpc1tTeW1ib2wudG9QcmltaXRpdmVdKCk7XG5cdH1cblxuXHRbU3ltYm9sLnRvUHJpbWl0aXZlXSgpOiBDb21tYW5kTW9kdWxlPFQsIElUb3JVPFQsIFU+PlxuXHR7XG5cdFx0bGV0IHsgY29tbWFuZCwgZGVzY3JpYmUsIGFsaWFzZXMgfSA9IHRoaXM7XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShjb21tYW5kKSlcblx0XHR7XG5cdFx0XHRjb21tYW5kID0gY29tbWFuZC5zbGljZSgpO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGFsaWFzZXMpKVxuXHRcdHtcblx0XHRcdGFsaWFzZXMgPSBhbGlhc2VzLnNsaWNlKCk7XG5cdFx0fVxuXG5cdFx0bGV0IGJ1aWxkZXIgPSB0aGlzLmJ1aWxkZXI7XG5cdFx0bGV0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXI7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29tbWFuZCxcblx0XHRcdGFsaWFzZXMsXG5cdFx0XHRkZXNjcmliZSxcblx0XHRcdGJ1aWxkZXIsXG5cdFx0XHRoYW5kbGVyLFxuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWWFyZ3NDb21tYW5kTW9kdWxlXG4iXX0=