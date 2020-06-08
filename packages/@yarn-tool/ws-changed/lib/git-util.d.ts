/**
 * Created by user on 2020/6/9.
 */
export declare function wsRootWithGitRoot(cwd: string): string;
export declare function wsGitDiffStagedFiles(cwd: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: string[];
};
export declare function wsGitDiffStagedDir(cwd: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: string[];
};
