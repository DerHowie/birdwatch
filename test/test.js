import configuration from './../birdwatch-config.js';
import Birdwatch from '../dist';
import test from 'ava';
import condense from 'selective-whitespace';
import fs from 'fs';
import testData from './testTweets.json';


test('should expose a constructor', t => {
	t.is(typeof Birdwatch, 'function');
});

test('should add a feed with .feed()', t => {
	const birdwatch = new Birdwatch({server: false}).feed('testfeed');
	t.is(birdwatch._feed[0].screenname, 'testfeed');
});

test('should fail when a screenname is not supplied to .feed()', async t => {
	const birdwatch = new Birdwatch({server: false}).feed('');
	await t.throws(birdwatch.start(), 'Screenname required');
});

test('should add a feed with options', t => {
	const birdwatch = new Birdwatch({server: false}).feed('testfeed', { filterTags:/test/i });
	t.true(birdwatch._feed[0].options.hasOwnProperty('filterTags'));
});

test('should fail if no feed is supplied', async t => {
	const birdwatch = new Birdwatch({server: false});
	await t.throws(birdwatch.start(), "You must supply at least one feed to Birdwatch");
});

test('should get tweet data returned', async t => {
	await new Birdwatch({testData:testData, server: true, port:0})
		.feed('test', {})
		.start().then(tweets => {
			t.is(typeof tweets[0].text, 'string');
		});
});

test('should fail when filterTags is not a valid regex', async t => {
	const bw = await new Birdwatch({testData:testData, server:false}).feed('test', {filterTags: 'a'});
	t.throws(bw.start(), 'Invalid regex: a for test');
});

test('should filter hashtags', async t => {
	await new Birdwatch({testData:testData, server:false})
		.feed('test', {filterTags: /#01|#02|#03/})
		.start().then(tweets => {
			t.is(tweets.length, 3);
		});
});

test('should remove retweets with removeRetweets:true', async t => {
	await new Birdwatch({testData:testData, server:false})
		.feed('test', {removeRetweets:true})
		.start().then(tweets => {
			t.is(tweets.length, 5);
		});
});

test('should allow multiple feeds with options', async t => {
	await new Birdwatch({testData:testData, server:false})
		.feed('noretweets', {removeRetweets:true})
		.feed('specifichashtags', {filterTags: /#01|#02|#03/})
		.start().then(tweets => {
			t.is(tweets.length, 8);
		});
});

test('should sort the tweets', async t => {
	await new Birdwatch({testData:testData, server:false})
		.feed('test')
		.start().then(tweets => {
			t.is(tweets.length, 10);
			t.is(tweets[9].created_at, 'Mon Jul 01 14:14:42 +0000 2015');
			t.is(tweets[0].created_at, 'Mon Jul 10 14:14:42 +0000 2015');
		});
});

test('should sort tweets from multiple feeds', async t => {
	const bw = await new Birdwatch({testData:testData, server:false})
		.feed('test1', 	{filterTags: /#01|#02/})
		.feed('test2', 	{filterTags: /#01|#02/})
		.start().then(tweets => {
			t.is(tweets.length, 4);
			t.is(tweets[0].created_at, 'Mon Jul 02 14:14:42 +0000 2015');
			t.is(tweets[1].created_at, 'Mon Jul 02 14:14:42 +0000 2015');
		});
});

test('should allow custom sorting', async t => {
	const fn = function(x,y) { var n = parseInt(x.text.substring(12)); if (n % 2 === 0) { return 1; } return -1 };
	const bw = await new Birdwatch({testData:testData, sortBy:fn, server:false})
		.feed('test1')
		.start().then(tweets => {
			t.is(tweets[0].text, 'test tweet #09');
			t.is(tweets[9].text, 'test tweet #02');
		});
});

test('should fail if custom sorting function is not a valid function', async t => {
	const bw = await new Birdwatch({testData:testData, sortBy:[], server:false }).feed('test1');
	t.throws(bw.start(), 'sortBy value must be a function.');
});

test('should not expose private keys in birdwatch-config.js', t => {
	t.true(
		configuration.consumerKey         === 'YOUR_CONSUMER_KEY' &&
		configuration.consumerSecret      === 'YOUR_CONSUMER_SECRET' &&
		configuration.accessToken         === 'YOUR_ACCESS_TOKEN' &&
		configuration.accessTokenSecret   === 'YOUR_ACCESS_TOKEN_SECRET'
	);
});

test('filterTags should accept an array of strings', async t => {
	await new Birdwatch({testData:testData, server:false})
		.feed('test', {filterTags:['01','02']})
		.start().then(tweets => {
			t.is(tweets.length, 2);
		});
});




