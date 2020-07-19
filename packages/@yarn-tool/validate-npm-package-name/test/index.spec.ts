import validate from '../lib/validateNpmPackageNameCore';

test('validate-npm-package-name', () =>
{
	// Traditional

	expect(validate('some-package')).toEqual({ validForNewPackages: true, validForOldPackages: true })
	expect(validate('example.com')).toEqual({ validForNewPackages: true, validForOldPackages: true })
	expect(validate('under_score')).toEqual({ validForNewPackages: true, validForOldPackages: true })
	expect(validate('period.js')).toEqual({ validForNewPackages: true, validForOldPackages: true })
	expect(validate('123numeric')).toEqual({ validForNewPackages: true, validForOldPackages: true })
	expect(validate('crazy!')).toEqual({
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain special characters ("~\'!()*")'],
	})

	// Scoped (npm 2+)

	expect(validate('@npm/thingy')).toEqual({ validForNewPackages: true, validForOldPackages: true })
	expect(validate('@npm-zors/money!time.js')).toEqual({
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain special characters ("~\'!()*")'],
	})

	// Invalid

	expect(validate('')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name length must be greater than zero'],
	})

	expect(validate('')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name length must be greater than zero'],
	})

	expect(validate('.start-with-period')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot start with a period'],
	})

	expect(validate('_start-with-underscore')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot start with an underscore'],
	})

	expect(validate('contain:colons')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name can only contain URL-friendly characters'],
	})

	expect(validate(' leading-space')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot contain leading or trailing spaces', 'name can only contain URL-friendly characters'],
	})

	expect(validate('trailing-space ')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name cannot contain leading or trailing spaces', 'name can only contain URL-friendly characters'],
	})

	expect(validate('s/l/a/s/h/e/s')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['name can only contain URL-friendly characters'],
	})

	expect(validate('node_modules')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['node_modules is a blacklisted name'],
	})

	expect(validate('favicon.ico')).toEqual({
		validForNewPackages: false,
		validForOldPackages: false,
		errors: ['favicon.ico is a blacklisted name'],
	})

	// Node/IO Core

	expect(validate('http')).toEqual({
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['http is a core module name'],
	})

	// Long Package Names

	expect(
		validate('ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou-'),
	).toEqual({
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain more than 214 characters'],
	})

	expect(
		validate('ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou'),
	).toEqual({
		validForNewPackages: true,
		validForOldPackages: true,
	})

	// Legacy Mixed-Case

	expect(validate('CAPITAL-LETTERS')).toEqual({
		validForNewPackages: false,
		validForOldPackages: true,
		warnings: ['name can no longer contain capital letters'],
	})

})
