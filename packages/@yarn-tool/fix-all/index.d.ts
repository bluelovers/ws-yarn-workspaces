import Bluebird from 'bluebird';
export interface INpmAutoFixAll {
    overwriteHostedGitInfo?: boolean;
    branch?: string;
}
export declare function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll): Bluebird<void>;
export default npmAutoFixAll;
