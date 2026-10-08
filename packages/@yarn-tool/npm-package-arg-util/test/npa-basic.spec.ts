import { describe, test } from 'node:test';
import { _lazyTestNpaTypeGuard } from "./lib/test";
import { tests as _tests } from "./fixtures/npa";


describe('basic', () =>
{
	/**
	 * @see {@link https://github.com/npm/npm/blob/latest/test/lib/npa.js}
	 */
	Object.entries(_tests).forEach(([raw, propertyMatchers]) =>
	{
		test(raw, () =>
		{
			_lazyTestNpaTypeGuard(raw, {
				propertyMatchers,
			});
		});
	});
});
