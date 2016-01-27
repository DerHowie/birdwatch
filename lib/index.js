import objectAssign from 'object-assign';
import {EventEmitter} from 'events';
import hashRegex from 'hash-regex';
import isRegexp from 'is-regexp';
import report from './report';

export default class Birdwatch {
	/**
	 * Initialize a new Birdwatch
	 *
	 * @param {Object} options
	 * @api public
	 */

	constructor(options) {
		const defaults = {
			logReports: false,
			server: true,
			port: 8417,
			testData: null,
			refreshTime: 600
		};

		this.options = objectAssign(defaults, options);

		console.log('new options: ', this.options);

		this.feeds = [];
		this.filteredTweets = [];
		this.tweets = [];
	}

	/**
	 * Get or set the feeds to monitor
	 *
	 * @param {String} screenname
	 * @param {Object} options
	 * @api public
	 */

	feed(screenname, options) {
		if (!arguments.length) {
			return this._feed;
		}

		this._feed = this._feed || [];
		options = options || {};
		this._feed.push({screenname, options});

		return this;
	}

	/**
	 * Start the birdwatch process.
	 *
	 * @api public
	 */

	async start() {
		const self = this;

		if (!this.feed() || this.feed().length === 0) {
			throw new Error('You must supply at least one feed to Birdwatch');
		}

		await Promise.all(this.feed().map(feed => {
			const options = objectAssign({}, self.options, feed.options);

			if (!feed.screenname) {
				throw new Error('Screenname required');
			}

			if (options.filterTags) {
				if (Array.isArray(options.filterTags)) {
					options.filterTags = hashRegex(options.filterTags);
				} else if (!isRegexp(options.filterTags)) {
					throw new Error(`Invalid regex: ${options.filterTags} for ${feed.screenname}`);
				}
			}

			self.feeds.push({screenname: feed.screenname, options});
		}));

		if (self.options.logReports) {
			report.logStartMessage(this.refreshTime, this);
		}

		await self.processFeeds(self.feeds, self.options);
		self.tweets = await self.sortTweets();
		await self.saveToCacheFile();
		self.startTimer(self.feeds, self.options);

		if (self.options.server) {
			self.startServer();
		}

		return Promise.resolve(self.tweets);
	}
}

objectAssign(Birdwatch.prototype, EventEmitter.prototype);
objectAssign(Birdwatch.prototype, require('./utils.js'));
objectAssign(Birdwatch.prototype, require('./report.js'));
