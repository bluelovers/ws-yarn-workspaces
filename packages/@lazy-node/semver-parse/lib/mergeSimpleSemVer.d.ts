/**
 * Created by user on 2020/8/12.
 */
import { ISimpleSemVer, ISimpleSemVerObjectBase } from './types';
import { ITSPartialPick } from 'ts-type/lib/type/record';
export declare function mergeSimpleSemVer<T extends ISimpleSemVer>(target: T, b: ISimpleSemVerObjectBase): {
    target: import("./types").IToSimpleSemVerObject<T>;
    changed: ITSPartialPick<ISimpleSemVerObjectBase, "major" | "minor" | "patch" | "release" | "build">;
};
export default mergeSimpleSemVer;
