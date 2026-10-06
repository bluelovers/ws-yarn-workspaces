"use strict";
/**
 * Created by user on 2019/5/21.
 */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YargsCommandModule = exports.SYM_PROP = exports.SYM_YARGS = exports.SYM_CONFIG = void 0;
const tslib_1 = require("tslib");
/**
 * yargs 指令模組建立工具。
 *
 * Helper for building yargs command module objects.
 *
 * 以 class 匯出，讓建立出來的物件同時具備 getter/setter 與
 * toValue() 轉換，最終產出符合 yargs CommandModule 介面的純物件。
 *
 * The class wrapper adds getters/setters plus the toValue() conversion, so the
 * final object satisfies the yargs CommandModule interface.
 *
 * @module yarn-cmd-module
 */
const core_decorators_1 = require("core-decorators");
/**
 * 內部配置的 Symbol 鍵：存放原始 config 物件。
 *
 * Symbol key for the internal storage of the original config object.
 */
exports.SYM_CONFIG = Symbol.for('config');
/**
 * 內部的 Symbol 鍵：記錄 builder 呼叫前後的 yargs 實例（from/to）。
 *
 * Symbol key recording the yargs instance before/after builder runs (from/to).
 */
exports.SYM_YARGS = Symbol.for('yargs');
/**
 * 內部的 Symbol 鍵：TypeScript 假屬性用（見 YargsCommandModule.argv）。
 *
 * Symbol key used for the fake TypeScript-only property
 * (see YargsCommandModule.argv).
 */
exports.SYM_PROP = Symbol.for('fakeProp');
/**
 * yargs 指令模組的包裝類別 (Wrapper Class)。
 *
 * Wrapper class around a yargs command module.
 *
 * 內部以 Symbol 屬性保存設定，對外以 getter/setter 代理 yargs 所需的
 * 欄位，最後透過 toValue() 轉為 yargs 可直接使用的 CommandModule 物件。
 *
 * The configuration is kept in Symbol properties and exposed through
 * getters/setters matching the yargs fields; toValue() then converts it into a
 * plain CommandModule object that yargs can consume directly.
 *
 * @template T - builder 的輸入 yargs 型別 / Input yargs type of builder
 * @template U - builder 的輸出 yargs 型別 / Output yargs type of builder
 */
class YargsCommandModule {
    /**
     * 建立並回傳指令模組實例。
     *
     * Create and return a command module instance.
     *
     * @param config - 指令設定 / Command configuration
     */
    static create(config) {
        return new this(config);
    }
    /**
     * 將設定存入內部 Symbol 屬性。
     *
     * Store the config in the internal Symbol property.
     *
     * @param config - 指令設定 / Command configuration
     */
    constructor(config) {
        /**
         * 原始設定物件；以 Symbol 命名避免與使用者傳入的欄位衝突。
         *
         * The original config object; a Symbol name avoids clashing with any
         * user-supplied field.
         */
        this[_a] = {};
        /**
         * builder 執行前後的 yargs 實例：from 為輸入、to 為輸出。
         *
         * The yargs instances around builder execution: `from` is the input,
         * `to` the output.
         */
        this[_b] = {};
        this[exports.SYM_CONFIG] = config;
    }
    /**
     * 指令名稱：在命令列輸入時執行此指令的字串（或字串陣列），第一個字串可包含位置參數。
     *
     * The command name: string (or array of strings) that executes this command
     * when given on the command line; the first string may contain positional args.
     */
    get command() {
        return this[exports.SYM_CONFIG].command;
    }
    set command(value) {
        this[exports.SYM_CONFIG].command = value;
    }
    /**
     * help 文字中的說明字串；傳 `false` 可隱藏此指令。
     *
     * Description shown in help text; use `false` for a hidden command.
     */
    get describe() {
        return this[exports.SYM_CONFIG].describe;
    }
    set describe(value) {
        this[exports.SYM_CONFIG].describe = value;
    }
    /**
     * 指令別名（字串或字串陣列），別名中定義的位置參數會被忽略。
     *
     * Command aliases (string or array of strings); positional args defined in
     * an alias are ignored.
     */
    get aliases() {
        return this[exports.SYM_CONFIG].aliases;
    }
    set aliases(value) {
        this[exports.SYM_CONFIG].aliases = value;
    }
    /**
     * 宣告此指令接受的選項（物件），或接受並回傳 yargs 實例的函式。
     *
     * Declares the options this command accepts (object), or a function that
     * accepts and returns a yargs instance.
     */
    get builder() {
        // @ts-ignore
        let builder = this[exports.SYM_CONFIG].builder;
        /**
         * 為函式時包一層 wrapper：記錄呼叫前的 yargs（from）
         * 與回傳的 yargs（to），供後續 yargs getter 取用。
         *
         * When it is a function, wrap it to record the incoming yargs (`from`)
         * and the returned yargs (`to`) for the `yargs` getter.
         */
        if (typeof builder == 'function') {
            let self = this;
            return function builder(yargs) {
                self[exports.SYM_YARGS].from = yargs;
                // @ts-ignore
                return self[exports.SYM_YARGS].to = builder.call(this, yargs);
            };
        }
        /**
         * 物件形式直接回傳，不需記錄 yargs 實例。
         *
         * The object form is returned as-is; no yargs instance to record.
         */
        // @ts-ignore
        return this[exports.SYM_CONFIG].builder;
    }
    /**
     * builder 執行後的 yargs 實例；builder 尚未執行時為 undefined。
     *
     * The yargs instance after builder ran; undefined until then.
     */
    get yargs() {
        return this[exports.SYM_YARGS].to;
    }
    /**
     * 解析 argv 後呼叫的處理函式（經 newHandler 包裝）。
     *
     * The handler called with the parsed argv (wrapped by newHandler).
     */
    get handler() {
        // @ts-ignore
        return this.newHandler(this[exports.SYM_CONFIG].handler);
    }
    /**
     * 取代 handler 並回傳 this，以支援串連 (Chain) 呼叫。
     *
     * Replace the handler and return `this` to support chaining.
     *
     * @param cb - 新的處理函式 / The new handler function
     */
    setHandler(cb) {
        // @ts-ignore
        this[exports.SYM_CONFIG].handler = cb;
        return this;
    }
    /**
     * 回傳包裝後的 handler：呼叫時一併傳入目前的 yargs 實例與模組本身。
     *
     * Return a wrapped handler that also receives the current yargs instance
     * and the module itself.
     *
     * @param cb - 原始處理函式 / The original handler function
     */
    newHandler(cb) {
        /**
         * 以閉包 (Closure) 捕獲 self，避免此處的 `this` 被巢狀函式覆寫。
         *
         * A closure captures `self` so `this` here is not shadowed by the
         * nested function.
         */
        let self = this;
        return (args) => {
            return cb(args, self[exports.SYM_YARGS].to, self);
        };
    }
    /**
     * toValue() 為 toPrimitive 的別名，便於明確表達「取回純值」。
     *
     * `toValue()` aliases toPrimitive to make the "get a plain value" intent
     * explicit.
     */
    toValue() {
        return this[Symbol.toPrimitive]();
    }
    /**
     * 轉換為 yargs 可直接使用的 CommandModule 純物件。
     *
     * Convert into a plain CommandModule object usable by yargs.
     *
     * 陣列型的 command/aliases 先 slice 複製，避免外部後續修改影響已建立的設定。
     *
     * Array-shaped `command`/`aliases` are sliced first so later external
     * mutations do not affect the stored config.
     */
    [(_a = exports.SYM_CONFIG, _b = exports.SYM_YARGS, Symbol.toPrimitive)]() {
        let { command, describe, aliases } = this;
        if (Array.isArray(command)) {
            command = command.slice();
        }
        if (Array.isArray(aliases)) {
            aliases = aliases.slice();
        }
        /**
         * builder/handler 必須在此時取值，因為它們是 getter：
         * builder 會在此刻記錄 yargs 實例，handler 則會包裝成最終形態。
         *
         * `builder`/`handler` are read here because they are getters: reading
         * `builder` records the yargs instance at this moment, and reading
         * `handler` produces the final wrapped form.
         */
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
exports.YargsCommandModule = YargsCommandModule;
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], YargsCommandModule.prototype, "command", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], YargsCommandModule.prototype, "describe", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], YargsCommandModule.prototype, "aliases", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], YargsCommandModule.prototype, "builder", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], YargsCommandModule.prototype, "yargs", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [])
], YargsCommandModule.prototype, "handler", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", void 0)
], YargsCommandModule.prototype, "setHandler", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", void 0)
], YargsCommandModule.prototype, "newHandler", null);
tslib_1.__decorate([
    core_decorators_1.autobind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], YargsCommandModule.prototype, "toValue", null);
exports.default = YargsCommandModule;
//# sourceMappingURL=index.js.map