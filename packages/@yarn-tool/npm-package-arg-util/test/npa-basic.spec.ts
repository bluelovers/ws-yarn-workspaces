import { _lazyTestNpaTypeGuard } from "./lib/test";
import { tests as _tests } from "./fixtures/npa";


describe('basic', () =>
{
	/**
 * @see {@link https://github.com/npm/npm/blob/latest/test/lib/npa.js}
 */
	test.each(Object.entries(_tests))('%s', (raw, propertyMatchers) =>
	{
		_lazyTestNpaTypeGuard(raw, {
			propertyMatchers,
		});
	});
});
