import { IListableRow } from 'ws-pkg-list';
import { IOptionsRecommendVersion, IOptionsWithType } from '../types';
export declare function recommendVersion(pkg: IListableRow, options?: IOptionsWithType<IOptionsRecommendVersion>): Promise<string>;
export default recommendVersion;
