/**
 * Created by user on 2020/6/11.
 */

export type { Operator, Options } from 'semver';

export * from './lib/_core';

export * from './lib/compare';

export * from './lib/parse';

export default exports as typeof import('./index');
