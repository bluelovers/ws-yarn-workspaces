/// <reference types="node" />
export interface IReport {
    removed?: Record<string, {
        from: string;
        to: string;
    }>;
}
export declare function updateYarnLockTag(yarnlock_old: Buffer | string): Promise<{
    yarnlock_old: string;
    yarnlock_new: string;
    yarnlock_changed: boolean;
    report: IReport;
}>;
