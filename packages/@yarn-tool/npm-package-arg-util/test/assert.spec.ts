
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { npa, npa2 } from '../index';

test(`should throw an error`, (t) =>
{

	assert.doesNotThrow(() => npa2('botkit@jonchurch/botkit#multi-hears'));

	assert.doesNotThrow(() => npa2('jonchurch/botkit#multi-hears'));

	assert.doesNotThrow(() => npa('botkit@jonchurch/botkit#multi-hears'));

	assert.throws(() => npa('jonchurch/botkit#multi-hears'), (err: any) => {
		t.assert.snapshot(err.message);
		return true;
	});

});
