import { Range } from '../lib/Range';

test(`check cache is work`, () =>
{
	let range = '>01.02.03';

	expect(new Range(range, true)).toMatchSnapshot();
	//expect(actual).toBeInstanceOf(Date);
	expect(() => new Range(range)).toThrowErrorMatchingSnapshot();

});


