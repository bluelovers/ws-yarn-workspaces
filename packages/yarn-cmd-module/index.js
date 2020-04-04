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
exports.YargsCommandModule = exports.SYM_PROP = exports.SYM_YARGS = exports.SYM_CONFIG = void 0;
const core_decorators_1 = require("core-decorators");
exports.SYM_CONFIG = Symbol.for('config');
exports.SYM_YARGS = Symbol.for('yargs');
exports.SYM_PROP = Symbol.for('fakeProp');
let YargsCommandModule = /** @class */ (() => {
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
//# sourceMappingURL=index.js.map