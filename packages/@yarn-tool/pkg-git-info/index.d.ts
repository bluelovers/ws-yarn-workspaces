/**
 * Created by user on 2019/6/4.
 */
import HostedGitInfo from 'hosted-git-info';
import { parseConfig } from '@git-lazy/info';
export declare function getHostedGitInfo(o: ReturnType<typeof parseConfig>): HostedGitInfo;
export interface INpmHostedGitInfo {
    bugs: string;
    repository: string;
    homepage: string;
    _: HostedGitInfo;
}
export declare function npmHostedGitInfoLazy(cwd?: string): INpmHostedGitInfo;
export declare function npmHostedGitInfo(cwd?: string): INpmHostedGitInfo;
export declare function npmHostedGitInfoCore(info: HostedGitInfo): INpmHostedGitInfo;
export default npmHostedGitInfo;
