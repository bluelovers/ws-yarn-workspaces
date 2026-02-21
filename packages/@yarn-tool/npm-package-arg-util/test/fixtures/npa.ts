import { IResult } from "../../lib/types";

export const tests: Record<string, Partial<IResult>> = {
	'foo@1.2': {
		name: 'foo',
		escapedName: 'foo',
		type: 'range',
		saveSpec: null,
		fetchSpec: '1.2',
		raw: 'foo@1.2',
		rawSpec: '1.2',
	},

	'foo@~1.2': {
		name: 'foo',
		escapedName: 'foo',
		type: 'range',
		saveSpec: null,
		fetchSpec: '~1.2',
		raw: 'foo@~1.2',
		rawSpec: '~1.2',
	},

	'@foo/bar': {
		raw: '@foo/bar',
		name: '@foo/bar',
		escapedName: '@foo%2fbar',
		scope: '@foo',
		rawSpec: '*',
		saveSpec: null,
		fetchSpec: '*',
		type: 'range',
	},

	'@foo/bar@': {
		raw: '@foo/bar@',
		name: '@foo/bar',
		escapedName: '@foo%2fbar',
		scope: '@foo',
		rawSpec: '*',
		saveSpec: null,
		fetchSpec: '*',
		type: 'range',
	},

	'@foo/bar@baz': {
		raw: '@foo/bar@baz',
		name: '@foo/bar',
		escapedName: '@foo%2fbar',
		scope: '@foo',
		rawSpec: 'baz',
		saveSpec: null,
		fetchSpec: 'baz',
		type: 'tag',
	},

	'@f fo o al/ a d s ;f': {
		raw: '@f fo o al/ a d s ;f',
		name: null,
		escapedName: null,
		rawSpec: '@f fo o al/ a d s ;f',
		saveSpec: 'file:@f fo o al/ a d s ;f',
		fetchSpec: '/test/a/b/@f fo o al/ a d s ;f',
		type: 'directory',
	},

	'foo@1.2.3': {
		name: 'foo',
		escapedName: 'foo',
		type: 'version',
		saveSpec: null,
		fetchSpec: '1.2.3',
		raw: 'foo@1.2.3',
	},

	'foo@=v1.2.3': {
		name: 'foo',
		escapedName: 'foo',
		type: 'version',
		saveSpec: null,
		fetchSpec: '=v1.2.3',
		raw: 'foo@=v1.2.3',
		rawSpec: '=v1.2.3',
	},

	'foo@npm:bar': {
		name: 'foo',
		escapedName: 'foo',
		type: 'alias',
		saveSpec: null,
		fetchSpec: null,
		raw: 'foo@npm:bar',
		rawSpec: 'npm:bar',
		subSpec: {
			registry: true,
			name: 'bar',
			escapedName: 'bar',
			type: 'range',
			raw: 'bar',
			rawSpec: '*',
			saveSpec: null,
			fetchSpec: '*',
		},
	},

	// sha-1
	'git+ssh://git@notgithub.com/user/foo#0d7bd85a85fa2571fa532d2fc842ed099b236ad2': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@notgithub.com/user/foo#0d7bd85a85fa2571fa532d2fc842ed099b236ad2',
		fetchSpec: 'ssh://git@notgithub.com/user/foo',
		gitCommittish: '0d7bd85a85fa2571fa532d2fc842ed099b236ad2',
		raw: 'git+ssh://git@notgithub.com/user/foo#0d7bd85a85fa2571fa532d2fc842ed099b236ad2',
	},

	// sha-256
	'git+ssh://git@notgithub.com/user/foo#8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@notgithub.com/user/foo#8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8',
		fetchSpec: 'ssh://git@notgithub.com/user/foo',
		gitCommittish: '8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8',
		raw: 'git+ssh://git@notgithub.com/user/foo#8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8',
	},

	'git+ssh://git@notgithub.com/user/foo#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@notgithub.com/user/foo#1.2.3',
		fetchSpec: 'ssh://git@notgithub.com/user/foo',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://git@notgithub.com/user/foo#1.2.3',
	},

	'git+ssh://git@notgithub.com/user/foo': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@notgithub.com/user/foo',
		fetchSpec: 'ssh://git@notgithub.com/user/foo',
		gitCommittish: null,
		raw: 'git+ssh://git@notgithub.com/user/foo',
	},

	'git+ssh://git@notgithub.com:user/foo': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@notgithub.com:user/foo',
		fetchSpec: 'git@notgithub.com:user/foo',
		gitCommittish: null,
		raw: 'git+ssh://git@notgithub.com:user/foo',
	},

	'git+ssh://mydomain.com:foo': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://mydomain.com:foo',
		fetchSpec: 'mydomain.com:foo',
		gitCommittish: null,
		raw: 'git+ssh://mydomain.com:foo',
	},

	'git+ssh://git@notgithub.com:user/foo#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@notgithub.com:user/foo#1.2.3',
		fetchSpec: 'git@notgithub.com:user/foo',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://git@notgithub.com:user/foo#1.2.3',
	},

	'git+ssh://mydomain.com:foo#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://mydomain.com:foo#1.2.3',
		fetchSpec: 'mydomain.com:foo',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://mydomain.com:foo#1.2.3',
	},

	'git+ssh://mydomain.com:foo/bar#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://mydomain.com:foo/bar#1.2.3',
		fetchSpec: 'mydomain.com:foo/bar',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://mydomain.com:foo/bar#1.2.3',
	},

	'git+ssh://mydomain.com:1234#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://mydomain.com:1234#1.2.3',
		fetchSpec: 'ssh://mydomain.com:1234',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://mydomain.com:1234#1.2.3',
	},

	'git+ssh://mydomain.com:1234/hey#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://mydomain.com:1234/hey#1.2.3',
		fetchSpec: 'ssh://mydomain.com:1234/hey',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://mydomain.com:1234/hey#1.2.3',
	},

	'git+ssh://mydomain.com:1234/hey': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://mydomain.com:1234/hey',
		fetchSpec: 'ssh://mydomain.com:1234/hey',
		gitCommittish: null,
		raw: 'git+ssh://mydomain.com:1234/hey',
	},

	'git+ssh://username:password@mydomain.com:1234/hey#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://username:password@mydomain.com:1234/hey#1.2.3',
		fetchSpec: 'ssh://username:password@mydomain.com:1234/hey',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://username:password@mydomain.com:1234/hey#1.2.3',
	},

	'git+ssh://git@github.com/user/foo#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@github.com/user/foo.git#1.2.3',
		fetchSpec: 'ssh://git@github.com/user/foo.git',
		gitCommittish: '1.2.3',
		raw: 'git+ssh://git@github.com/user/foo#1.2.3',
	},

	'git+ssh://git@notgithub.com/user/foo#semver:^1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		hosted: null,
		saveSpec: 'git+ssh://git@notgithub.com/user/foo#semver:^1.2.3',
		fetchSpec: 'ssh://git@notgithub.com/user/foo',
		gitCommittish: null,
		gitRange: '^1.2.3',
		raw: 'git+ssh://git@notgithub.com/user/foo#semver:^1.2.3',
	},

	'git+ssh://git@notgithub.com:user/foo#semver:^1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		hosted: null,
		saveSpec: 'git+ssh://git@notgithub.com:user/foo#semver:^1.2.3',
		fetchSpec: 'git@notgithub.com:user/foo',
		gitCommittish: null,
		gitRange: '^1.2.3',
		raw: 'git+ssh://git@notgithub.com:user/foo#semver:^1.2.3',
	},

	'git+ssh://git@github.com/user/foo#semver:^1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@github.com/user/foo.git#semver:^1.2.3',
		fetchSpec: 'ssh://git@github.com/user/foo.git',
		gitCommittish: null,
		gitRange: '^1.2.3',
		raw: 'git+ssh://git@github.com/user/foo#semver:^1.2.3',
	},

	'git+ssh://git@github.com:user/foo#semver:^1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+ssh://git@github.com/user/foo.git#semver:^1.2.3',
		fetchSpec: 'ssh://git@github.com/user/foo.git',
		gitCommittish: null,
		gitRange: '^1.2.3',
		raw: 'git+ssh://git@github.com:user/foo#semver:^1.2.3',
	},

	'user/foo#semver:^1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'github:user/foo#semver:^1.2.3',
		fetchSpec: null,
		gitCommittish: null,
		gitRange: '^1.2.3',
		raw: 'user/foo#semver:^1.2.3',
	},

	'user/foo#path:dist': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'github:user/foo#path:dist',
		fetchSpec: null,
		gitCommittish: null,
		gitSubdir: '/dist',
		raw: 'user/foo#path:dist',
	},

	'user/foo#1234::path:dist': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'github:user/foo#1234::path:dist',
		fetchSpec: null,
		gitCommittish: '1234',
		gitRange: null,
		gitSubdir: '/dist',
		raw: 'user/foo#1234::path:dist',
	},

	'user/foo#notimplemented:value': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'github:user/foo#notimplemented:value',
		fetchSpec: null,
		gitCommittish: null,
		gitRange: null,
		gitSubdir: null,
		raw: 'user/foo#notimplemented:value',
	},

	'git+file://path/to/repo#1.2.3': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git+file://path/to/repo#1.2.3',
		fetchSpec: 'file://path/to/repo',
		gitCommittish: '1.2.3',
		raw: 'git+file://path/to/repo#1.2.3',
	},

	'git://notgithub.com/user/foo': {
		name: null,
		escapedName: null,
		type: 'git',
		saveSpec: 'git://notgithub.com/user/foo',
		fetchSpec: 'git://notgithub.com/user/foo',
		raw: 'git://notgithub.com/user/foo',
	},

	'@foo/bar@git+ssh://notgithub.com/user/foo': {
		name: '@foo/bar',
		escapedName: '@foo%2fbar',
		scope: '@foo',
		saveSpec: 'git+ssh://notgithub.com/user/foo',
		fetchSpec: 'ssh://notgithub.com/user/foo',
		rawSpec: 'git+ssh://notgithub.com/user/foo',
		raw: '@foo/bar@git+ssh://notgithub.com/user/foo',
	},

	'git@npm:not-git': {
		name: 'git',
		type: 'alias',
		subSpec: {
			type: 'range',
			registry: true,
			name: 'not-git',
			fetchSpec: '*',
		},
		raw: 'git@npm:not-git',
	},

	'not-git@hostname.com:some/repo': {
		name: null,
		type: 'git',
		saveSpec: 'git+ssh://not-git@hostname.com:some/repo',
		fetchSpec: 'not-git@hostname.com:some/repo',
		raw: 'not-git@hostname.com:some/repo',
	},

	'/path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/path/to/foo',
		fetchSpec: '/path/to/foo',
		raw: '/path/to/foo',
	},

	'/path/to/foo.tar': {
		name: null,
		escapedName: null,
		type: 'file',
		saveSpec: 'file:/path/to/foo.tar',
		fetchSpec: '/path/to/foo.tar',
		raw: '/path/to/foo.tar',
	},

	'/path/to/foo.tgz': {
		name: null,
		escapedName: null,
		type: 'file',
		saveSpec: 'file:/path/to/foo.tgz',
		fetchSpec: '/path/to/foo.tgz',
		raw: '/path/to/foo.tgz',
	},
	'file:path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:path/to/foo',
		fetchSpec: '/test/a/b/path/to/foo',
		raw: 'file:path/to/foo',
	},
	'file:path/to/foo.tar.gz': {
		name: null,
		escapedName: null,
		type: 'file',
		saveSpec: 'file:path/to/foo',
		fetchSpec: '/test/a/b/path/to/foo.tar.gz',
		raw: 'file:path/to/foo.tar.gz',
	},

	'file:~/path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:~/path/to/foo',
		// fetchSpec: normalizePath(path.join(os.homedir(), '/path/to/foo')),
		raw: 'file:~/path/to/foo',
	},

	'file:/~/path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:~/path/to/foo',
		// fetchSpec: normalizePath(path.join(os.homedir(), '/path/to/foo')),
		raw: 'file:/~/path/to/foo',
	},

	'file:/~path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/~path/to/foo',
		fetchSpec: '/~path/to/foo',
		raw: 'file:/~path/to/foo',
	},

	'file:/.path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/.path/to/foo',
		fetchSpec: '/.path/to/foo',
		raw: 'file:/.path/to/foo',
	},

	'file:./path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:path/to/foo',
		fetchSpec: '/test/a/b/path/to/foo',
		raw: 'file:./path/to/foo',
	},

	'file:/./path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:path/to/foo',
		fetchSpec: '/test/a/b/path/to/foo',
		raw: 'file:/./path/to/foo',
	},

	'file://./path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:path/to/foo',
		fetchSpec: '/test/a/b/path/to/foo',
		raw: 'file://./path/to/foo',
	},

	'file:../path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:../path/to/foo',
		fetchSpec: '/test/a/path/to/foo',
		raw: 'file:../path/to/foo',
	},

	'file:/../path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:../path/to/foo',
		fetchSpec: '/test/a/path/to/foo',
		raw: 'file:/../path/to/foo',
	},

	'file://../path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:../path/to/foo',
		fetchSpec: '/test/a/path/to/foo',
		raw: 'file://../path/to/foo',
	},

	'file:///path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/path/to/foo',
		fetchSpec: '/path/to/foo',
		raw: 'file:///path/to/foo',
	},
	'file:/path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/path/to/foo',
		fetchSpec: '/path/to/foo',
		raw: 'file:/path/to/foo',
	},
	'file://path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/path/to/foo',
		fetchSpec: '/path/to/foo',
		raw: 'file://path/to/foo',
	},
	'file:////path/to/foo': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:/path/to/foo',
		fetchSpec: '/path/to/foo',
		raw: 'file:////path/to/foo',
	},

	'file://.': {
		name: null,
		escapedName: null,
		type: 'directory',
		saveSpec: 'file:',
		fetchSpec: '/test/a/b',
		raw: 'file://.',
	},

	'http://insecure.com/foo.tgz': {
		name: null,
		escapedName: null,
		type: 'remote',
		saveSpec: 'http://insecure.com/foo.tgz',
		fetchSpec: 'http://insecure.com/foo.tgz',
		raw: 'http://insecure.com/foo.tgz',
	},

	'https://server.com/foo.tgz': {
		name: null,
		escapedName: null,
		type: 'remote',
		saveSpec: 'https://server.com/foo.tgz',
		fetchSpec: 'https://server.com/foo.tgz',
		raw: 'https://server.com/foo.tgz',
	},

	'foo@latest': {
		name: 'foo',
		escapedName: 'foo',
		type: 'tag',
		saveSpec: null,
		fetchSpec: 'latest',
		raw: 'foo@latest',
	},

	foo: {
		name: 'foo',
		escapedName: 'foo',
		type: 'range',
		saveSpec: null,
		fetchSpec: '*',
		raw: 'foo',
	},

	'foo@ 1.2 ': {
		name: 'foo',
		escapedName: 'foo',
		type: 'range',
		saveSpec: null,
		fetchSpec: '1.2',
		raw: 'foo@ 1.2 ',
		rawSpec: ' 1.2 ',
	},

	'foo@ 1.2.3 ': {
		name: 'foo',
		escapedName: 'foo',
		type: 'version',
		saveSpec: null,
		fetchSpec: '1.2.3',
		raw: 'foo@ 1.2.3 ',
		rawSpec: ' 1.2.3 ',
	},

	'foo@1.2.3 ': {
		name: 'foo',
		escapedName: 'foo',
		type: 'version',
		saveSpec: null,
		fetchSpec: '1.2.3',
		raw: 'foo@1.2.3 ',
		rawSpec: '1.2.3 ',
	},

	'foo@ 1.2.3': {
		name: 'foo',
		escapedName: 'foo',
		type: 'version',
		saveSpec: null,
		fetchSpec: '1.2.3',
		raw: 'foo@ 1.2.3',
		rawSpec: ' 1.2.3',
	},
} as any
