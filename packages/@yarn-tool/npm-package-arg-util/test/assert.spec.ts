import { basename, extname } from 'path';
import npa from '../index';

test(`should throw an error`, () =>
{

	expect(() => npa('botkit@jonchurch/botkit#multi-hears')).not.toThrowError();

	expect(() => npa('jonchurch/botkit#multi-hears')).toThrowError();

});
