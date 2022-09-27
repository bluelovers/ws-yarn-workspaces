import { wsPkgListable } from 'ws-pkg-list';
import Bluebird from 'bluebird';
import { isPublishedByPackageJSON } from '@yarn-tool/is-published';
import { async as crossSpawn } from 'cross-spawn-extra';
import { consoleLogger as console } from 'debug-color2/logger';

export async function publishRetry(cwd?: string)
{
	return Bluebird.resolve(wsPkgListable(cwd))
		.mapSeries(async (row) => {
			const { location: cwd } = row;

			let bool = await isPublishedByPackageJSON(row);

			if (!bool)
			{
				console.bgYellow.red.info(`try to publish ${row.name}@${row.version}`);

				const cp = await crossSpawn('npm', [
					'publish',
				], {
					cwd,
					stdio: 'inherit',
				});

				console.log(cp.status, cp.error);

				await Bluebird.delay(1000);
			}

		})
	;
}

export default publishRetry
