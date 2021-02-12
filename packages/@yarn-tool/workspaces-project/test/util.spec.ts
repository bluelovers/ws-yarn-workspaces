import { checkPaths, EnumCheckPaths } from '../lib/util';
import { join } from 'path';

describe(`describe`, () =>
{
	let root = __dirname;

	test(`EnumCheckPaths.root`, () =>
	{
		let rootPath = join(root, 'xxxx');

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.root;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.rootPath;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`failed`, () =>
	{
		let rootPath = join(root, '..');

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.failed;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`root is empty return EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root: '',
			rootPath,
		});
		let expected = EnumCheckPaths.rootPath;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`rootPath is empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.failed;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root: '',
			rootPath,
		});
		let expected = EnumCheckPaths.failed;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

});

describe(`skipStrictCheck`, () =>
{
	let root = __dirname;

	let options = {
		skipStrictCheck: true,
	}

	test(`EnumCheckPaths.root`, () =>
	{
		let rootPath = join(root, 'xxxx');

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.root;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.rootPath;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`failed => rootPath`, () =>
	{
		let rootPath = join(root, '..');

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.rootPath

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`root is empty return EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root: '',
			rootPath,
		}, options);
		let expected = EnumCheckPaths.rootPath;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`rootPath is empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.failed;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

	test(`empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root: '',
			rootPath,
		}, options);
		let expected = EnumCheckPaths.failed;

		expect(actual).toStrictEqual(expected);
		//expect(actual).toBeInstanceOf(Date);
		expect(actual).toMatchSnapshot();

	});

})
