/// <reference types="node" />
export interface IReport {
    removed?: Record<string, {
        from: string;
        to: string;
    }>;
}
export declare function updateYarnLockTag(yarnlock_old: Buffer | string): Promise<{
    yarnlock_old: string | Buffer;
    yarnlock_new: any;
    yarnlock_changed: boolean;
    report: IReport;
}>;
