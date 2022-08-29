import { basename, extname } from 'path';
import { fillPkgHostedInfo } from '../index';

test(`{}`, () =>
{

	let actual = fillPkgHostedInfo({});

	console.dir(actual);

	expect(actual).toMatchObject({
		homepage: expect.any(String),
		bugs: { url: expect.any(String) },
		repository: {
			type: expect.any(String),
			url: expect.any(String),
			directory: 'packages/@yarn-tool/pkg-hosted-info',
		},
	});

});
