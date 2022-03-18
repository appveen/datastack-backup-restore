import { Credentials } from '@appveen/ds-sdk/dist/types';
import { getLogger as GetLogger, configure as Log4JSConfig } from 'log4js'; 'log4js';
const version = require('../package.json').version;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

let d = (new Date()).toISOString().replace(/:/gi, '-');
let fileName = `dsBR_${version.split('.').join('_')}_${d}.log`;
Log4JSConfig({
	appenders: {
		fileOut: {
			type: 'file',
			filename: fileName,
			maxLogSize: 500000,
			layout: {
				type: 'basic'
			}
		},
		out: {
			type: 'stdout',
			layout: {
				type: 'messagePassThrough'
			}
		}
	},
	categories: {
		default: {
			appenders: ['out', 'fileOut'],
			level: 'error'
		}
	}
});
const logger = GetLogger(`[${version}]`);
logger.level = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'info';
global.logger = logger;

import { header } from './lib.misc';
import { login, getApps } from './manager.api'
// const configManager = require('./lib.configManager');
const apiManager = require('./manager.api');
const backupManager = require('./manager.backup');
const restoreManager = require('./manager.restore');
const clearAllManager = require('./manager.clearAll');

async function start() {
	// let selection = await cli.pickMode();
	// if (selection.mode == 'Backup') await backupManager();
	// if (selection.mode == 'Restore') await restoreManager();
	// if (selection.mode == 'Clear All') await clearAllManager();

	await login(creds);
	var apps = await getApps();
	console.log(apps)
}

(async () => {
	header(`data.stack Backup and Restore Utility ${version}`);
	await start();
})();