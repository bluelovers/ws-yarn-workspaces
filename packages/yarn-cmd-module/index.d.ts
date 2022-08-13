/**
 * Created by user on 2019/5/21.
 */
import { Arguments, Argv, CommandModule, Options } from 'yargs';
interface ICommandModuleOmit {
    /** string (or array of strings) that executes this command when given on the command line, first string may contain positional args */
    command: ReadonlyArray<string> | string;
    /** string used as the description for the command in help text, use `false` for a hidden command */
    describe?: string | false;
    /** array of strings (or a single string) representing aliases of `exports.command`, positional args defined in an alias are ignored */
    aliases?: ReadonlyArray<string> | string;
}
export type ICommandModuleExports<T, U> = ICommandModuleOmit & ({
    /** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
    builder(yargs: Argv<T>): Argv<U>;
    /** a function which will be passed the parsed argv. */
    handler(args: Arguments<U>, yargs?: Argv<ITorU<T, U>>): any | void;
} | {
    /** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
    builder: {
        [key: string]: Options;
    };
    /** a function which will be passed the parsed argv. */
    handler(args: Arguments<U>, yargs?: Argv<ITorU<T, U>>): any | void;
} | {
    /** a function which will be passed the parsed argv. */
    handler(args: Arguments<T>, yargs?: Argv<ITorU<T, U>>): any | void;
} | {
    /** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
    builder(yargs: Argv<T>): Argv<U>;
});
export declare const SYM_CONFIG: unique symbol;
export declare const SYM_YARGS: unique symbol;
export declare const SYM_PROP: unique symbol;
export type ITorU<T, U> = U extends never ? T : U;
export type IUnpackCmdMod<T extends CommandModule, D = unknown> = T extends CommandModule<any, infer U> ? U : T extends CommandModule<infer U, any> ? U : D;
export declare class YargsCommandModule<T, U> implements ICommandModuleOmit {
    [SYM_CONFIG]: ICommandModuleExports<T, U>;
    [SYM_YARGS]: {
        from?: Argv<T>;
        to?: Argv<ITorU<T, U>>;
    };
    /**
     * this is fake prop for typescript
     * @deprecated
     */
    readonly argv: Arguments<ITorU<T, U>>;
    static create<T, U>(config: ICommandModuleExports<T, U>): YargsCommandModule<T, U>;
    constructor(config: ICommandModuleExports<T, U>);
    /** string (or array of strings) that executes this command when given on the command line, first string may contain positional args */
    get command(): ReadonlyArray<string> | string;
    set command(value: ReadonlyArray<string> | string);
    /** string used as the description for the command in help text, use `false` for a hidden command */
    get describe(): string | false;
    set describe(value: string | false);
    /** array of strings (or a single string) representing aliases of `exports.command`, positional args defined in an alias are ignored */
    get aliases(): ReadonlyArray<string> | string;
    set aliases(value: ReadonlyArray<string> | string);
    /** object declaring the options the command accepts, or a function accepting and returning a yargs instance */
    get builder(): CommandModule<T, ITorU<T, U>>["builder"];
    get yargs(): Argv<ITorU<T, U>>;
    /** a function which will be passed the parsed argv. */
    get handler(): <R extends any | void>(args: Arguments<ITorU<T, U>>) => R;
    setHandler<R extends any | void>(cb: (args: Arguments<ITorU<T, U>>, yargs?: Argv<ITorU<T, U>>, _self?: this) => R): this;
    newHandler<R extends any | void>(cb: (args: Arguments<ITorU<T, U>>, yargs?: Argv<ITorU<T, U>>, _self?: this) => R): (args: Arguments<ITorU<T, U>>) => R;
    toValue(): CommandModule<T, ITorU<T, U>>;
    [Symbol.toPrimitive](): CommandModule<T, ITorU<T, U>>;
}
export default YargsCommandModule;
