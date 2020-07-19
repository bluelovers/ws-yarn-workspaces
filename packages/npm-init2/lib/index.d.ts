/**
 * Created by user on 2018/11/28/028.
 */
import { defaultCopyStaticFiles } from '@yarn-tool/static-file';
export declare function npmVersion(npmClient?: string, cwd?: string): any;
export { defaultCopyStaticFiles };
export declare function copyStaticFiles(file_map: Record<string, string> | [string, string, string?][], options: {
    cwd: string;
    staticRoot?: string;
    overwrite?: boolean;
}): [string, string, string?][];
