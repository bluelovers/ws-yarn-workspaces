/**
 * Created by user on 2019/6/4.
 */
import HostedGitInfo from 'hosted-git-info';
import { parseConfig } from '@git-lazy/info';
export declare function getHostedGitInfo(o: ReturnType<typeof parseConfig>): HostedGitInfo;
export declare function npmHostedGitInfo(cwd?: string): {
    homepage: string;
    bugs: string;
    repository: string;
    _: HostedGitInfo;
};
export declare function npmHostedGitInfoCore(info: HostedGitInfo): {
    homepage: string;
    bugs: string;
    repository: string;
    _: HostedGitInfo;
};
export default npmHostedGitInfo;
