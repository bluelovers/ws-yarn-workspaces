import pathUpToWorkspaces from '../index';
import __ from 'lodash/fp/__';

describe(`describe`, () =>
{

	test(`test`, () =>
	{

		let actual = pathUpToWorkspaces(__dirname);
		let expected;

		expect(actual.length).toBeGreaterThan(0);

	});

})
