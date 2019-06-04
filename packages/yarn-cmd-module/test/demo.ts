import YargsCommandModule from '../index';
import { Argv } from 'yargs';

export = YargsCommandModule.create({
	command: 'aaa',
	builder(yargs)
	{
		return yargs
			.option('kkk', {
				string: true,
			})
	},
}).setHandler(	function(argv, yargs, self)
{



}).toValue();

