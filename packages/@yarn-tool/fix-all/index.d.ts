export interface INpmAutoFixAll {
    overwriteHostedGitInfo?: boolean;
    branch?: string;
}
export declare function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll): void;
export default npmAutoFixAll;
