module.exports = {
	clearMocks: true,
	moduleFileExtensions: ['ts', 'js'],
	testEnvironment: 'node',
	//testMatch: ['**/*.test.ts', '**/*.spec.ts'],
	testRegex: ['\\.(tests?|spec)\\.(ts|tsx)$'],
	//testRunner: 'jest-circus/runner',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	verbose: true,
	//collectCoverage: true,
}
