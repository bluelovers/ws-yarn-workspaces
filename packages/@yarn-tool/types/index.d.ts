import { Arguments, Argv, Omit } from 'yargs';
export declare type IYargsUnPackArgv<T extends Argv<any>> = T extends Argv<infer O> ? O : never;
export declare type IYargsArgumentsRecord<T> = {
    [key in keyof Arguments<T>]: Arguments<T>[key];
};
export declare type IYargsArgvSync<T> = Omit<Argv<T>, 'argv'> & {
    argv: Exclude<Argv<T>["argv"], Promise<any>>;
};
export declare type IYargsSync<T extends Argv<any>> = IYargsArgvSync<IYargsUnPackArgv<T>>;
