/// <reference types="node" />
import { IYarnLockUpdate } from './types';
export declare function updateYarnLockTag(yarnlock_old: Buffer | string): Promise<IYarnLockUpdate>;
