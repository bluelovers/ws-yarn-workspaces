/**
 * Created by user on 2019/5/21.
 */

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

import { autobind } from 'core-decorators';
import { Arguments, Argv, CommandModule, Options, CommandBuilder } from 'yargs';

/**
 * yargs CommandModule 中可由本模組直接代理的欄位集合。
 *
 * The subset of the yargs CommandModule fields that this module proxies.
 *
 * 刻意省略 builder/handler：兩者在 ICommandModuleExports 中有函式與
 * 物件兩種形態，需以 union 表達，故放在匯出型別內處理。
 *
 * `builder`/`handler` are omitted on purpose: each has both a function and an
 * object form, expressed as a union inside the exported type instead.
 */
interface ICommandModuleOmit
{
	/**
	 * 在命令列輸入時執行此指令的字串（或字串陣列），第一個字串可包含位置參數。
	 *
	 * String (or array of strings) that executes this command when given on the
	 * command line; the first string may contain positional args.
	 */
	command: ReadonlyArray<string> | string;
	/**
	 * help 文字中顯示的說明字串；傳 `false` 可隱藏此指令。
	 *
	 * String used as the description for the command in help text; use `false`
	 * for a hidden command.
	 */
	describe?: string | false;
	/**
	 * `command` 的別名（字串或字串陣列），別名中定義的位置參數會被忽略。
	 *
	 * Aliases of `command` as a string or array of strings; positional args
	 * defined in an alias are ignored.
	 */
	aliases?: ReadonlyArray<string> | string;
}

/**
 * 完整的指令模組設定型別。
 *
 * Full command-module configuration type.
 *
 * 以 union 表達 yargs 允許的四種 builder/handler 組合，
 * 讓未提供 builder 時仍能得到正確的推導結果。
 *
 * A union covering the four builder/handler combinations yargs allows, so
 * inference stays correct even when `builder` is omitted.
 *
 * @template T - builder 的輸入 yargs 型別 / Input yargs type of builder
 * @template U - builder 的輸出 yargs 型別 / Output yargs type of builder
 */
export type ICommandModuleExports<T, U> =
	ICommandModuleOmit
	& ({
	/**
	 * 宣告此指令接受的選項（物件），或接受並回傳 yargs 實例的函式。
	 *
	 * Declares the options this command accepts (object), or a function that
	 * accepts and returns a yargs instance.
	 */
	builder(yargs: Argv<T>): Argv<U>;
	/**
	 * 解析 argv 後呼叫的處理函式。
	 *
	 * Handler called with the parsed argv.
	 */
	handler(args: Arguments<U>, yargs?: Argv<ITorU<T, U>>): any | void;
	//handler(args: Arguments<U>): void;
} | {
	/**
	 * 以選項物件形式宣告此指令接受的選項。
	 *
	 * Declares the options this command accepts as an options object.
	 */
	builder: {
		[key: string]: Options
	};
	/**
	 * 解析 argv 後呼叫的處理函式。
	 *
	 * Handler called with the parsed argv.
	 */
	handler(args: Arguments<U>, yargs?: Argv<ITorU<T, U>>): any | void;
	//handler(args: Arguments<U>): void;
} | {
	/**
	 * 未提供 builder 時的處理函式，參數型別退回 T。
	 *
	 * Handler used when no builder is given; the argument type falls back to T.
	 */
	handler(args: Arguments<T>, yargs?: Argv<ITorU<T, U>>): any | void;
	//handler(args: Arguments<T>): void;
} | {
	/**
	 * 只有 builder 而暫不提供 handler 的形態。
	 *
	 * Builder-only form, used when the handler is not provided yet.
	 */
	builder(yargs: Argv<T>): Argv<U>;
});

/**
 * 內部配置的 Symbol 鍵：存放原始 config 物件。
 *
 * Symbol key for the internal storage of the original config object.
 */
export const SYM_CONFIG = Symbol.for('config');

/**
 * 內部的 Symbol 鍵：記錄 builder 呼叫前後的 yargs 實例（from/to）。
 *
 * Symbol key recording the yargs instance before/after builder runs (from/to).
 */
export const SYM_YARGS = Symbol.for('yargs');

/**
 * 內部的 Symbol 鍵：TypeScript 假屬性用（見 YargsCommandModule.argv）。
 *
 * Symbol key used for the fake TypeScript-only property
 * (see YargsCommandModule.argv).
 */
export const SYM_PROP = Symbol.for('fakeProp');

/**
 * builder 輸出未明確給出時，回退到輸入型別 T。
 *
 * Falls back to the input type T when the builder output is not specified.
 *
 * 以 `U extends never` 判斷而非 `unknown`，
 * 因為 `never` 代表呼叫端完全沒有指定 U。
 *
 * `U extends never` (rather than `unknown`) is used because `never` means the
 * caller did not specify U at all.
 *
 * @template T - 輸入 yargs 型別 / Input yargs type
 * @template U - 輸出 yargs 型別 / Output yargs type
 */
export type ITorU<T, U> = U extends never ? T
	//: U extends unknown ? T
	//: U extends {} ? T
		: U
	;

/**
 * 從 yargs CommandModule 型別中解包 (Unpack) 出 handler 的 argv 型別。
 *
 * Unpacks the handler argv type out of a yargs CommandModule type.
 *
 * 優先從第二個型別參數推導，取不到時退回第一個，最後才回退到 D，
 * 以相容 yargs 各版本對 CommandModule 泛型參數順序的差異。
 *
 * Tries the second type parameter first, then the first one, and finally D,
 * staying compatible with the differing generic orders across yargs versions.
 *
 * @template T - CommandModule 型別 / CommandModule type
 * @template D - 推導失敗時的回退型別 / Fallback type when inference fails
 */
export type IUnpackCmdMod<T extends CommandModule, D = unknown> = T extends CommandModule<any, infer U> ? U
	: T extends CommandModule<infer U, any> ? U
		: D
	;

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
export class YargsCommandModule<T, U> implements ICommandModuleOmit
{
	/**
	 * 原始設定物件；以 Symbol 命名避免與使用者傳入的欄位衝突。
	 *
	 * The original config object; a Symbol name avoids clashing with any
	 * user-supplied field.
	 */
	[SYM_CONFIG]: ICommandModuleExports<T, U> = {} as any;

	/**
	 * builder 執行前後的 yargs 實例：from 為輸入、to 為輸出。
	 *
	 * The yargs instances around builder execution: `from` is the input,
	 * `to` the output.
	 */
	[SYM_YARGS]: {
		from?: Argv<T>,
		to?: Argv<ITorU<T, U>>,
	} = {};

	/**
	 * 僅供 TypeScript 推導用的假屬性，執行期不存在。
	 *
	 * Fake property used only for TypeScript inference; absent at runtime.
	 *
	 * @deprecated 由 handler 內取得的 yargs 取代 / superseded by the yargs
	 * passed into the handler
	 */
	readonly argv: Arguments<ITorU<T, U>>;

	/**
	 * 建立並回傳指令模組實例。
	 *
	 * Create and return a command module instance.
	 *
	 * @param config - 指令設定 / Command configuration
	 */
	static create<T, U>(config: ICommandModuleExports<T, U>): YargsCommandModule<T, U>
	{
		return new this(config)
	}

	/**
	 * 將設定存入內部 Symbol 屬性。
	 *
	 * Store the config in the internal Symbol property.
	 *
	 * @param config - 指令設定 / Command configuration
	 */
	constructor(config: ICommandModuleExports<T, U>)
	{
		this[SYM_CONFIG] = config;
	}

	/**
	 * 指令名稱：在命令列輸入時執行此指令的字串（或字串陣列），第一個字串可包含位置參數。
	 *
	 * The command name: string (or array of strings) that executes this command
	 * when given on the command line; the first string may contain positional args.
	 */
	@autobind
	get command(): ReadonlyArray<string> | string
	{
		return this[SYM_CONFIG].command;
	}

	set command(value: ReadonlyArray<string> | string)
	{
		this[SYM_CONFIG].command = value
	}

	/**
	 * help 文字中的說明字串；傳 `false` 可隱藏此指令。
	 *
	 * Description shown in help text; use `false` for a hidden command.
	 */
	@autobind
	get describe(): string | false
	{
		return this[SYM_CONFIG].describe;
	}

	set describe(value: string | false)
	{
		this[SYM_CONFIG].describe = value
	}

	/**
	 * 指令別名（字串或字串陣列），別名中定義的位置參數會被忽略。
	 *
	 * Command aliases (string or array of strings); positional args defined in
	 * an alias are ignored.
	 */
	@autobind
	get aliases(): ReadonlyArray<string> | string
	{
		return this[SYM_CONFIG].aliases;
	}

	set aliases(value: ReadonlyArray<string> | string)
	{
		this[SYM_CONFIG].aliases = value
	}

	/**
	 * 宣告此指令接受的選項（物件），或接受並回傳 yargs 實例的函式。
	 *
	 * Declares the options this command accepts (object), or a function that
	 * accepts and returns a yargs instance.
	 */
	@autobind
	get builder(): CommandModule<T, ITorU<T, U>>["builder"]
	{
		// @ts-ignore
		let builder = this[SYM_CONFIG].builder as CommandModule<T, ITorU<T, U>>["builder"];

		/**
		 * 為函式時包一層 wrapper：記錄呼叫前的 yargs（from）
		 * 與回傳的 yargs（to），供後續 yargs getter 取用。
		 *
		 * When it is a function, wrap it to record the incoming yargs (`from`)
		 * and the returned yargs (`to`) for the `yargs` getter.
		 */
		if (typeof builder == 'function')
		{
			let self = this;

			return function builder(yargs: Argv<T>)
			{
				self[SYM_YARGS].from = yargs;

				// @ts-ignore
				return self[SYM_YARGS].to = builder.call(this, yargs)
			}
		}

		/**
		 * 物件形式直接回傳，不需記錄 yargs 實例。
		 *
		 * The object form is returned as-is; no yargs instance to record.
		 */
		// @ts-ignore
		return this[SYM_CONFIG].builder;
	}

	/**
	 * builder 執行後的 yargs 實例；builder 尚未執行時為 undefined。
	 *
	 * The yargs instance after builder ran; undefined until then.
	 */
	@autobind
	get yargs()
	{
		return this[SYM_YARGS].to;
	}

	/**
	 * 解析 argv 後呼叫的處理函式（經 newHandler 包裝）。
	 *
	 * The handler called with the parsed argv (wrapped by newHandler).
	 */
	@autobind
	get handler(): <R extends any | void>(args: Arguments<ITorU<T, U>>) => R
	{
		// @ts-ignore
		return this.newHandler(this[SYM_CONFIG].handler)
	}

	/**
	 * 取代 handler 並回傳 this，以支援串連 (Chain) 呼叫。
	 *
	 * Replace the handler and return `this` to support chaining.
	 *
	 * @param cb - 新的處理函式 / The new handler function
	 */
	@autobind
	setHandler<R extends any | void>(cb: (args: Arguments<ITorU<T, U>>, yargs?: Argv<ITorU<T, U>>, _self?: this) => R)
	{
		// @ts-ignore
		this[SYM_CONFIG].handler = cb;

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
	@autobind
	newHandler<R extends any | void>(cb: (args: Arguments<ITorU<T, U>>, yargs?: Argv<ITorU<T, U>>, _self?: this) => R)
	{
		/**
		 * 以閉包 (Closure) 捕獲 self，避免此處的 `this` 被巢狀函式覆寫。
		 *
		 * A closure captures `self` so `this` here is not shadowed by the
		 * nested function.
		 */
		let self = this;

		return (args: Arguments<ITorU<T, U>>) =>
		{
			return cb(args, self[SYM_YARGS].to, self) as R
		}
	}

	/**
	 * toValue() 為 toPrimitive 的別名，便於明確表達「取回純值」。
	 *
	 * `toValue()` aliases toPrimitive to make the "get a plain value" intent
	 * explicit.
	 */
	@autobind
	toValue()
	{
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
	[Symbol.toPrimitive](): CommandModule<T, ITorU<T, U>>
	{
		let { command, describe, aliases } = this;

		if (Array.isArray(command))
		{
			command = command.slice();
		}

		if (Array.isArray(aliases))
		{
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

export default YargsCommandModule
