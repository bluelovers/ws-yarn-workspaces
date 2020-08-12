
export interface IYarnLockUpdateReport
{
	removed?: Record<string, {
		from: string,
		to: string,
	}>
}

export interface IYarnLockUpdate
{
	yarnlock_old: string,
	yarnlock_new: string,
	yarnlock_changed: boolean,
	report: IYarnLockUpdateReport,
}
