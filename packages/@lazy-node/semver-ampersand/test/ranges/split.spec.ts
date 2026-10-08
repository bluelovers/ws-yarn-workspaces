import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { filterRangeListForComparator } from '../../lib/range/parseRange';
import { buildRangeSet } from '../../lib/range/buildRangeSet';
import { stringifyRangeSet } from '../../lib/range/stringifyRangeSet';

describe(`describe`, () =>
{

	let input = '>x 2.x || * || <x || ~1.2.3beta ^4.0.0-dev.20200615 && 4.0.0-dev.20200615 < 4.0.0-dev.20200800 || 4.0.x - 4.0.2 || (4.0.x - 4.0.2) || >= 1 || =1 || ~> 2.0.0 || 1.2.3 - 1.2.4 - 1.2.5 || >=1.2.3 <=1.2.4';

	test(input, (t) =>
	{

		let actual = buildRangeSet(input, {
			loose: true,
		});

		t.assert.snapshot(actual);

		let actual2 = buildRangeSet(input, {
			loose: false,
		});

		t.assert.snapshot(actual2);

		assert.deepStrictEqual(actual, actual2)

		t.assert.snapshot(stringifyRangeSet(actual2));
	});

})
