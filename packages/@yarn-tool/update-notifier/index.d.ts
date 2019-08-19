export declare type IUpdateNotifier = typeof import('update-notifier');
export declare type IUpdateNotifierObject = ReturnType<IUpdateNotifier>;
export declare function notNpxMaybe(__dirname: string): boolean;
export declare function updateNotifier(__dirname: string, force?: boolean): IUpdateNotifierObject;
export default updateNotifier;
