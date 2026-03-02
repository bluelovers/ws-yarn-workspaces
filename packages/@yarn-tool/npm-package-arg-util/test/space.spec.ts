import { _lazyTestNpaTypeGuard } from './lib/test';

beforeAll(async () =>
{

});

const FAKE_NAME = '@fake/fake' as const

describe(`Any`, () =>
{
	[
		'',
		' ',
		'*',
	].forEach(value =>
	{
		const title = value === '' ? 'empty' : value === ' ' ? 'space' : 'star';

		describe(title, () =>
		{
			const isInputSpecIsStar = value === '*';
			let expected = {
				isInputSpecIsEmpty: !isInputSpecIsStar,
				isInputSpecIsStar,
			} satisfies Partial<ReturnType<typeof _lazyTestNpaTypeGuard>>;

			test(title, () =>
			{
				let actual = _lazyTestNpaTypeGuard(value);
				expect(actual).toMatchSnapshot(expected);
			});

			test(`${FAKE_NAME}@${value}`, () =>
			{
				let actual = _lazyTestNpaTypeGuard(`${FAKE_NAME}@${value}`);
				expect(actual).toMatchSnapshot(expected);
			});

			test(`fake@${value}`, () =>
			{
				let actual = _lazyTestNpaTypeGuard(`fake@${value}`);
				expect(actual).toMatchSnapshot(expected);
			});
		})

	});

})
