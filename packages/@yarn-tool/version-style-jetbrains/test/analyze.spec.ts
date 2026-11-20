/// <reference types="jest" />
/// <reference types="node" />

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { analyzeVersionStyles, parseVersion, selectVersionStyles } from '../index';
import { EnumVersionStyle } from '../lib/types';

describe('analyzeVersionStyles', () => {

	for (const { version, matchedStyles, priorityStyle } of [
		/**
		 * 同時符合 JetBrains 與 y2k 時間樣式與短樣式，以 JetBrains 為優先
		 */
		{
			version: '264.1120.1744-1',
			matchedStyles: [
				EnumVersionStyle.JetbrainsDateTime,
				EnumVersionStyle.Y2KDateTime,
				EnumVersionStyle.JetbrainsShortMD,
			],
			priorityStyle: EnumVersionStyle.JetbrainsDateTime,
		},
		/**
		 * 226 末位非季度，僅符合 y2k 時間樣式
		 */
		{
			version: '226.1120.1744-1',
			matchedStyles: [EnumVersionStyle.Y2KDateTime],
			priorityStyle: EnumVersionStyle.Y2KDateTime,
		},
		/**
		 * 四位年份僅符合標準樣式，不會被誤判成 JetBrains 短樣式
		 */
		{
			version: '2026.101.1',
			matchedStyles: [EnumVersionStyle.StandardFullMD],
			priorityStyle: EnumVersionStyle.StandardFullMD,
		},
		{
			version: '2026.1.1-1',
			matchedStyles: [EnumVersionStyle.StandardFull],
			priorityStyle: EnumVersionStyle.StandardFull,
		},
		{
			version: '261.1.1-1',
			matchedStyles: [EnumVersionStyle.JetbrainsShort],
			priorityStyle: EnumVersionStyle.JetbrainsShort,
		},
		{
			version: '261.101.1',
			matchedStyles: [EnumVersionStyle.JetbrainsShortMD],
			priorityStyle: EnumVersionStyle.JetbrainsShortMD,
		},
		/**
		 * 完全不符合任何風格
		 */
		{
			version: 'invalid',
			matchedStyles: [],
			priorityStyle: null,
		},
	]) {
		it(`should analyze ${version}`, () => {
			const analysis = analyzeVersionStyles(version);

			assert.deepStrictEqual(analysis.matchedStyles, matchedStyles);
			assert.strictEqual(analysis.priorityStyle, priorityStyle);
		});
	}

	it('should provide the priority parse result', () => {
		const analysis = analyzeVersionStyles('264.1120.1744-1');

		assert.deepStrictEqual(analysis.priorityResult, {
			year: 2026,
			month: 11,
			day: 20,
			dailyVersion: 1,
			hour: 17,
			minute: 44,
			isJetbrainsShort: true,
			isMDCombined: true,
			isDateTime: true,
		});
	});

	it('should provide null priority result when nothing matches', () => {
		const analysis = analyzeVersionStyles('invalid');

		assert.strictEqual(analysis.priorityResult, null);
		assert.deepStrictEqual(analysis.matchedResults, {});
	});

	it('should index matched results by style', () => {
		const analysis = analyzeVersionStyles('264.1120.1744-1');

		/** key 集合與符合清單一致，且依同一優先序建立 */
		assert.deepStrictEqual(Object.keys(analysis.matchedResults), analysis.matchedStyles);

		/** 各風格可直接取回自己的解析結果，同一版本在不同風格下年份解讀不同 */
		assert.deepStrictEqual(analysis.matchedResults[EnumVersionStyle.JetbrainsDateTime], analysis.priorityResult);
		assert.strictEqual(analysis.matchedResults[EnumVersionStyle.Y2KDateTime]?.year, 2064);
		assert.strictEqual(analysis.matchedResults[EnumVersionStyle.StandardFull], undefined);
	});

	describe('selectVersionStyles', () => {

		it('should return the original analysis when no list is given', () => {
			const analysis = analyzeVersionStyles('264.1120.1744-1');

			assert.strictEqual(selectVersionStyles(analysis, undefined), analysis);
			assert.strictEqual(selectVersionStyles(analysis, {}), analysis);
		});

		it('should prefer the given style as priority', () => {
			const analysis = selectVersionStyles(analyzeVersionStyles('264.1120.1744-1'), {
				prefer: [EnumVersionStyle.Y2KDateTime],
			});

			assert.deepStrictEqual(analysis.matchedStyles, [
				EnumVersionStyle.Y2KDateTime,
				EnumVersionStyle.JetbrainsDateTime,
				EnumVersionStyle.JetbrainsShortMD,
			]);
			assert.strictEqual(analysis.priorityStyle, EnumVersionStyle.Y2KDateTime);
			assert.strictEqual(analysis.priorityResult?.year, 2064);
		});

		it('should exclude the given styles even when they match', () => {
			const analysis = selectVersionStyles(analyzeVersionStyles('264.1120.1744-1'), {
				exclude: [EnumVersionStyle.Y2KDateTime, EnumVersionStyle.JetbrainsShortMD],
			});

			assert.deepStrictEqual(analysis.matchedStyles, [EnumVersionStyle.JetbrainsDateTime]);
			assert.strictEqual(analysis.priorityStyle, EnumVersionStyle.JetbrainsDateTime);
			assert.strictEqual(analysis.matchedResults[EnumVersionStyle.Y2KDateTime], undefined);
		});

		it('should let exclude win over prefer', () => {
			const analysis = selectVersionStyles(analyzeVersionStyles('264.1120.1744-1'), {
				prefer: [EnumVersionStyle.JetbrainsShortMD],
				exclude: [EnumVersionStyle.JetbrainsShortMD],
			});

			assert.deepStrictEqual(analysis.matchedStyles, [
				EnumVersionStyle.JetbrainsDateTime,
				EnumVersionStyle.Y2KDateTime,
			]);
		});

		it('should ignore a preferred style that does not match', () => {
			const analysis = selectVersionStyles(analyzeVersionStyles('264.1120.1744-1'), {
				prefer: [EnumVersionStyle.StandardFull],
			});

			assert.strictEqual(analysis.priorityStyle, EnumVersionStyle.JetbrainsDateTime);
		});

		it('should keep an empty analysis empty', () => {
			const analysis = selectVersionStyles(analyzeVersionStyles('invalid'), {
				prefer: [EnumVersionStyle.Y2KDateTime],
			});

			assert.deepStrictEqual(analysis.matchedStyles, []);
			assert.strictEqual(analysis.priorityStyle, null);
			assert.strictEqual(analysis.priorityResult, null);
		});

	});

	it('should parse with the selected style', () => {
		/** 預設以解析優先序取 JetBrains；指定 prefer / exclude 後改以 y2k 解讀同一位址 */
		assert.strictEqual(parseVersion('264.1120.1744-1')?.year, 2026);
		assert.strictEqual(parseVersion('264.1120.1744-1', { prefer: [EnumVersionStyle.Y2KDateTime] })?.year, 2064);
		assert.strictEqual(parseVersion('264.1120.1744-1', { exclude: [EnumVersionStyle.JetbrainsDateTime] })?.year, 2064);
	});

});
