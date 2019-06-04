/**
 * Created by user on 2019/5/21.
 */

import { autobind } from 'core-decorators';
import { Arguments, Argv, CommandModule, Options, CommandBuilder } from 'yargs';

interface ICommandModuleOmit
{
	/** string (or array of strings) that executes this command when given on the command line, first string may contain positional args */
	command: ReadonlyArray<string> | string;
	/** string used as the description for the command in help text, use `false` for a hidden command */
	describe?: string | false;
	/** array of strings (or a single string) representing aliases of `exports.command`, positional args defined in an alias are ignored */
	aliases?: ReadonlyArray<string> | string;
}

export type ICommandModuleExports<T, U> =
	ICommandModuleOmit
	& ({
	/** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
	builder(yargs: Argv<T>): Argv<U>;
	/** a function which will be passed the parsed argv. */
	handler(args: Arguments<U>, yargs?: Argv<ITorU<T, U>>): any | void;
	//handler(args: Arguments<U>): void;
} | {
	/** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
	builder: {
		[key: string]: Options
	};
	/** a function which will be passed the parsed argv. */
	handler(args: Arguments<U>, yargs?: Argv<ITorU<T, U>>): any | void;
	//handler(args: Arguments<U>): void;
} | {
	/** a function which will be passed the parsed argv. */
	handler(args: Arguments<T>, yargs?: Argv<ITorU<T, U>>): any | void;
	//handler(args: Arguments<T>): void;
} | {
	/** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
	builder(yargs: Argv<T>): Argv<U>;
});

export const SYM_CONFIG = Symbol.for('config');
export const SYM_YARGS = Symbol.for('yargs');
export const SYM_PROP = Symbol.for('fakeProp');

export type ITorU<T, U> = U extends never ? T
	//: U extends unknown ? T
	//: U extends {} ? T
		: U
	;

export type IUnpackCmdMod<T extends CommandModule, D = unknown> = T extends CommandModule<any, infer U> ? U
	: T extends CommandModule<infer U, any> ? U
		: D
	;

export class YargsCommandModule<T, U> implements ICommandModuleOmit
{
	[SYM_CONFIG]: ICommandModuleExports<T, U> = {} as any;
	[SYM_YARGS]: {
		from?: Argv<T>,
		to?: Argv<ITorU<T, U>>,
	} = {};

	/**
	 * this is fake prop for typescript
	 * @deprecated
	 */
	readonly argv: Arguments<ITorU<T, U>>;

	static create<T, U>(config: ICommandModuleExports<T, U>): YargsCommandModule<T, U>
	{
		return new this(config)
	}

	constructor(config: ICommandModuleExports<T, U>)
	{
		this[SYM_CONFIG] = config;
	}

	/** string (or array of strings) that executes this command when given on the command line, first string may contain positional args */
	@autobind
	get command(): ReadonlyArray<string> | string
	{
		return this[SYM_CONFIG].command;
	}

	set command(value: ReadonlyArray<string> | string)
	{
		this[SYM_CONFIG].command = value
	}

	/** string used as the description for the command in help text, use `false` for a hidden command */
	@autobind
	get describe(): string | false
	{
		return this[SYM_CONFIG].describe;
	}

	set describe(value: string | false)
	{
		this[SYM_CONFIG].describe = value
	}

	/** array of strings (or a single string) representing aliases of `exports.command`, positional args defined in an alias are ignored */
	@autobind
	get aliases(): ReadonlyArray<string> | string
	{
		return this[SYM_CONFIG].aliases;
	}

	set aliases(value: ReadonlyArray<string> | string)
	{
		this[SYM_CONFIG].aliases = value
	}

	/** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
	@autobind
	get builder(): CommandModule<T, ITorU<T, U>>["builder"]
	{
		// @ts-ignore
		let builder = this[SYM_CONFIG].builder as CommandModule<T, ITorU<T, U>>["builder"];

		if (typeof builder == 'function')
		{
			let self = this;

			return function builder(yargs: Argv<T>)
			{
				self[SYM_YARGS].from = yargs;

				return self[SYM_YARGS].to = builder.call(this, yargs)
			}
		}

		// @ts-ignore
		return this[SYM_CONFIG].builder;
	}

	@autobind
	get yargs()
	{
		return this[SYM_YARGS].to;
	}

	/** a function which will be passed the parsed argv. */
	@autobind
	get handler(): <R extends any | void>(args: Arguments<ITorU<T, U>>) => R
	{
		// @ts-ignore
		return this.newHandler(this[SYM_CONFIG].handler)
	}

	@autobind
	setHandler<R extends any | void>(cb: (args: Arguments<ITorU<T, U>>, yargs?: Argv<ITorU<T, U>>, _self?: this) => R)
	{
		// @ts-ignore
		this[SYM_CONFIG].handler = cb;

		return this;
	}

	@autobind
	newHandler<R extends any | void>(cb: (args: Arguments<ITorU<T, U>>, yargs?: Argv<ITorU<T, U>>, _self?: this) => R)
	{
		let self = this;

		return (args: Arguments<ITorU<T, U>>) =>
		{
			return cb(args, self[SYM_YARGS].to, self) as R
		}
	}

	@autobind
	toValue()
	{
		return this[Symbol.toPrimitive]();
	}

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
