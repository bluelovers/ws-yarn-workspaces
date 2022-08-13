import { Arguments, Argv, Omit } from 'yargs';
export type IYargsUnPackArgv<T extends Argv<any>> = T extends Argv<infer O> ? O : never;
export type IYargsArgumentsRecord<T> = {
    [key in keyof Arguments<T>]: Arguments<T>[key];
};
export type IYargsArgvSync<T> = Omit<Argv<T>, 'argv'> & {
    argv: Exclude<Argv<T>["argv"], Promise<any>>;
};
export type IYargsSync<T extends Argv<any>> = IYargsArgvSync<IYargsUnPackArgv<T>>;
