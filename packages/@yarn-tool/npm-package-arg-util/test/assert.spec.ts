import { basename, extname } from 'path';
import { npa, npa2 } from '../index';

test(`should throw an error`, () =>
{

	expect(() => npa2('botkit@jonchurch/botkit#multi-hears')).not.toThrow();

	expect(() => npa2('jonchurch/botkit#multi-hears')).not.toThrow();

	expect(() => npa('botkit@jonchurch/botkit#multi-hears')).not.toThrow();

	expect(() => npa('jonchurch/botkit#multi-hears')).toThrowErrorMatchingSnapshot();

});
