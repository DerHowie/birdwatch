# Birdwatch :baby_chick::watch:

> Get raw tweets from one or more specific twitter feeds.

[![Build Status](https://travis-ci.org/radiovisual/birdwatch.svg?branch=master)](https://travis-ci.org/radiovisual/birdwatch)

Birdwatch will help you grab tweets from specific twitter accounts, and cache the tweets on-disk and in-memory on your server, 
thus avoiding any request limits set by the Twitter API, and giving you more control over the data that is saved.
You can filter tweets by hashtags, or ignore retweets.  

**Note:** This is a work in progress. *Pull requests welcome!*

## Installation

**Step 1:** Install the package via npm
```
$ npm install --save birdwatch
```

**Step 2:** Add your twitter app credentials to the configuration file
  1. Open the file: `node_modules/birdwatch/configure/configure.js`
  2. Replace the placeholder values with your twitter app credentials
  3. Rename the `configure.js` file to `local_configure.js` 
  4. *Now you are ready to birdwatch!*

*Note: Skipping step #3, results in error: `Cannot find module './configure/local_configure.js'`*

## Usage

```js

var Birdwatch = require('birdwatch');

var birdwatch = new Birdwatch({refreshTime: 500})
    .feed('gulpjs')
    .feed('reactjs', {filter_tags: /#reactjs/i })
    .feed('nodejs',  {filter_tags: /#nodejs/i, remove_retweets:true  });

birdwatch.start(function (err) {
    if(err) { console.log(err); }
});

// Now get your tweets in JSON format to serve or print
birdwatch.getCachedTweets().then(function(tweetdata){
    console.log(tweetdata);
});

```

## API

### Birdwatch([options])

#### options

##### refreshTime

Type: `number` *(seconds)*<br>
Default: `600` *(10 minutes)*

The number of seconds to wait before the cache updates again.
 
Use this to update your cache frequently, but not frequent enough to hit any [Twitter API Rate Limits](https://dev.twitter.com/rest/public/rate-limits).
  
##### logReports

Type: `boolean`<br>
Default: `false`

Shows a pretty-printed update to the console. Useful for debugging and logging.

##### useTestData

Type: `boolean`<br>
Default: `false`

Use the test tweet data instead of making a network requests. Useful for testing/debugging.

# ![birdwatch](media/screenshot-v.0.0.1.png)

### birdwatch.feed(screenname, options)

Add a twitter feed.

#### screenname

*Required*<br>
Type: `string`

The screenname of the twitter account you want to watch.

#### options

Type: `object`

Options set here will override the defaults in the constructor.

##### Possible Options:

`filter_tags`<br>
  The regular expression containing the tags you want to filter with.<br>
  Type: `Regex`<br>
  Default: `null (filters off by default)
  
  **Tip:** If you need help writing your regular expressions, try: [regexpal.com](http://regexpal.com/)
   
`remove_retweets`<br>
  Use this if you want to remove retweets from the feed you are watching.<br>
  Type: `boolean`<br>
  Default: `false`


### birdwatch.start(callback)

Start the Birdwatch process.

#### callback(error)

Type: `function`

The callback gets sent to birdwatch.start() when complete

### birdwatch.getCachedTweets()

Use this to access the birdwatch cache of tweets in the JSON format

Returns: `Promise`


### Coming Soon:

- [ ] Better serving solution
- [ ] Allow custom sorting rules
- [ ] HTML-ify the cached tweets
- [ ] More caching options (currently on-disk/in-memory only)

### License

The MIT License (MIT)

Copyright (c) 2015 Michael Wuergler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
