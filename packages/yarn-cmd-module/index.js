"use strict";
/**
 * Created by user on 2019/5/21.
 */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YargsCommandModule = exports.SYM_PROP = exports.SYM_YARGS = exports.SYM_CONFIG = void 0;
const tslib_1 = require("tslib");
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
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Object),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], YargsCommandModule.prototype, "command", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Object),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], YargsCommandModule.prototype, "describe", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Object),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], YargsCommandModule.prototype, "aliases", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Object),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], YargsCommandModule.prototype, "builder", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Object),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], YargsCommandModule.prototype, "yargs", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], YargsCommandModule.prototype, "handler", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Function]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], YargsCommandModule.prototype, "setHandler", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Function]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], YargsCommandModule.prototype, "newHandler", null);
(0, tslib_1.__decorate)([
    core_decorators_1.autobind,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], YargsCommandModule.prototype, "toValue", null);
exports.YargsCommandModule = YargsCommandModule;
exports.default = YargsCommandModule;
//# sourceMappingURL=index.js.map