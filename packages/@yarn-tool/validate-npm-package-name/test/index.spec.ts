import assert from 'node:assert/strict';
import { test } from 'node:test';
import validate from '../lib/validateNpmPackageNameCore';

test('validate-npm-package-name', () =>
{
	// Traditional

	assert.deepStrictEqual(validate('some-package'), { validForNewPackages: true, validForOldPackages: true })
	assert.deepStrictEqual(validate('example.com'), { validForNewPackages: true, validForOldPackages: true })
	assert.deepStrictEqual(validate('under_score'), { validForNewPackages: true, validForOldPackages: true })
	assert.deepStrictEqual(validate('period.js'), { validForNewPackages: true, validForOldPackages: true })
	assert.deepStrictEqual(validate('123numeric'), { validForNewPackages: true, validForOldPackages: true })
	assert.deepStrictEqual(validate('crazy!'), {
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain special characters ("~\'!()*")'],
	})

	// Scoped (npm 2+)

	assert.deepStrictEqual(validate('@npm/thingy'), { validForNewPackages: true, validForOldPackages: true })
	assert.deepStrictEqual(validate('@npm-zors/money!time.js'), {
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain special characters ("~\'!()*")'],
	})

	// Invalid

	assert.deepStrictEqual(validate(''), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name length must be greater than zero'],
	})

	assert.deepStrictEqual(validate(''), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name length must be greater than zero'],
	})

	assert.deepStrictEqual(validate('.start-with-period'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot start with a period'],
	})

	assert.deepStrictEqual(validate('_start-with-underscore'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot start with an underscore'],
	})

	assert.deepStrictEqual(validate('contain:colons'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name can only contain URL-friendly characters'],
	})

	assert.deepStrictEqual(validate(' leading-space'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot contain leading or trailing spaces', 'name can only contain URL-friendly characters'],
	})

	assert.deepStrictEqual(validate('trailing-space '), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot contain leading or trailing spaces', 'name can only contain URL-friendly characters'],
	})

	assert.deepStrictEqual(validate('s/l/a/s/h/e/s'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name can only contain URL-friendly characters'],
	})

	assert.deepStrictEqual(validate('node_modules'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['node_modules is a blacklisted name'],
	})

	assert.deepStrictEqual(validate('favicon.ico'), {
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['favicon.ico is a blacklisted name'],
	})

	// Node/IO Core

	assert.deepStrictEqual(validate('http'), {
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['http is a core module name'],
	})

	// Long Package Names

	assert.deepStrictEqual(
		validate('ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou-'),
		{
			validForNewPackages: false,
			validForOldPackages: true,
			warnings: ['name can no longer contain more than 214 characters'],
		}
	)

	assert.deepStrictEqual(
		validate('ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou'),
		{
			validForNewPackages: true,
			validForOldPackages: true,
		}
	)

	// Legacy Mixed-Case

	assert.deepStrictEqual(validate('CAPITAL-LETTERS'), {
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain capital letters'],
	})

})
