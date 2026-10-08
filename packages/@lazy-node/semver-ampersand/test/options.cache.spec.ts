import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Range } from '../lib/Range';

test(`check cache is work`, (t) =>
{
	let range = '>01.02.03';

	t.assert.snapshot(new Range(range, true));
	//expect(actual).toBeInstanceOf(Date);

	toThrowErrorMatchingSnapshot(t, () => new Range(range));

});

export function _errorSnapshotSerializerToObject(err: any)
{
	return {
		[err.name ?? 'Unnamed Error']: err.message,
	};
}

export function _errorSnapshotSerializerToMessageOnly(err: any)
{
	return err.message;
}

export function toThrowErrorMatchingSnapshot(t: test.TestContext, block: () => unknown, message?: string)
{
	t.assert.throws(block, (err: any) =>
	{
		/**
		 * 可以根據需求調整 snapshot 的格式
		 *
		 * TODO: add message/error check
		 */
		t.assert.snapshot(_errorSnapshotSerializerToObject(err));
		return true;
	});
}
