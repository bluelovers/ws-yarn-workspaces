/// <reference types="node" />
import { IComputedPackage } from './types';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
export declare function buildComputedPackage(yarnLockContentList: ITSValueOrArray<Buffer | string>, alreadyComputedPackage?: IComputedPackage): IComputedPackage;
