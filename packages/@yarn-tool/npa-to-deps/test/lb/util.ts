/**
 * Created by user on 2026/3/2.
 */
import { npaToDepsValue } from '../../index';
import { parseSimpleSemVerRange } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange';
import { reSemverRange } from '@lazy-node/semver-simple-parse/lib/const';
import _npa, { AliasResult, FileResult, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { npaTry2 } from '@yarn-tool/npm-package-arg-util';

export function _actualNpaToDepsValue(input: string)
{
	let depsResult = npaToDepsValue(input);

	let fetchSpec = depsResult.result?.fetchSpec;

	return {
		depsResult,
		npaOriginal: npaTry2(input, {
			npa: _npa,
		}),
		parseSimpleSemVerRange: fetchSpec?.length && parseSimpleSemVerRange(fetchSpec),
		re: fetchSpec?.length && reSemverRange.exec(fetchSpec),
	}
}
