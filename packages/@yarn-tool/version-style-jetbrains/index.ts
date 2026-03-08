/**
 * 基於日期的版本編號生成器
 * Date-based version style generator
 *
 * @see https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/version-style-jetbrains
 */

// 重新導出所有 lib 模組
export * from './lib';

// 重新導出以方便使用
export {
	EnumVersionStyle,
	IVersionStyleOptions,
	IParseVersionResult,
	parseVersion,
	dateToVersion,
	dateToVersionByStyle,
	getNextDayVersion,
	incrementVersion,
	isTodayVersion,
	getNextVersion,
	generateAllStyleVersions,
	// 新增的輔助函數
	getQuarterFromMonth,
	getJetbrainsYearCode,
	_handleVersionStyleOptions,
	_getDateInfoFromOptions,
} from './lib';
