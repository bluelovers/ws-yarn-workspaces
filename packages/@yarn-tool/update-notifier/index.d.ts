export declare type IUpdateNotifier = typeof import('update-notifier');
export declare type IUpdateNotifierObject = ReturnType<IUpdateNotifier>;
import { NotifyOptions, Settings } from 'update-notifier';
export declare function notNpxMaybe(__dirname: string): boolean;
export declare function updateNotifier(__dirname: string | string[], force?: boolean, inputNoticeOptions?: Settings & NotifyOptions): IUpdateNotifierObject;
export default updateNotifier;
