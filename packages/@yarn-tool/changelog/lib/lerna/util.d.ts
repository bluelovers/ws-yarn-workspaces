import { IOptionsWithType, IOptionsUpdateChangelog, IOptionsRecommendVersion } from '../types';
export declare function handleOptions<T extends IOptionsRecommendVersion | IOptionsUpdateChangelog>(options?: IOptionsWithType<T>): IOptionsWithType<T>;
