/**
 * 示範如何以 create() + setHandler() + toValue()
 * 建立可直接交給 yargs 的指令模組物件。
 *
 * Demonstrates create() + setHandler() + toValue() to build a command module
 * object that can be handed straight to yargs.
 *
 * @module yarn-cmd-module/test/demo
 */
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

