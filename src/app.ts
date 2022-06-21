import { getLogger as GetLogger, configure as Log4JSConfig } from "log4js"; "log4js";
const version = require("../package.json").version;
global.version = version;

// import { Command } from 'commander';
// const program = new Command();

// program
// 	.name('string-util')
// 	.description('CLI to some JavaScript string utilities')
// 	.version('0.8.0');

// program.parse();

let d = (new Date()).toISOString().replace(/:/gi, "-");
// global.globalId = d;
global.backupFileName = `backup-${d}.json`;
global.restoreFileName = `restore-${d}.json`;
let fileName = `dsBR_${version.split(".").join("_")}_${d}.log`;
if (process.env.DS_BR_SINGLELOGFILE) {
	fileName = "out.log";
	global.backupFileName = "backup.json";
	global.restoreFileName = "restore.json";
}

Log4JSConfig({
	appenders: {
		fileOut: {
			type: "file",
			filename: fileName,
			maxLogSize: 500000,
			layout: {
				type: "basic"
			}
		}
	},
	categories: {
		default: {
			appenders: ["fileOut"],
			level: "error"
		}
	}
});
const logger = GetLogger(`[${version}]`);
logger.level = process.env.LOGLEVEL ? process.env.LOGLEVEL : "info";
global.logger = logger;

import { header } from "./lib.misc";
import { startMenu, validateCLIParams } from "./lib.cli";
import { getApps, login } from "./manager.api";
import { backupManager } from "./manager.backup";
import { restoreManager } from "./manager.restore";
import { clearAllManager } from "./manager.clearAll";

(async () => {
	header(`data.stack Backup and Restore Utility ${version}`);
	let dsConfig = await validateCLIParams();
	await login(dsConfig);

	let apps = await getApps();

	var selection = await startMenu();
	logger.info(`Selected mode :: ${selection.mode}`);

	if (selection.mode == "Backup") await backupManager(apps);
	if (selection.mode == "Restore") await restoreManager(apps);
	if (selection.mode == "Clear All") await clearAllManager(apps);

	// Logout cleanly
	global.dataStack.Logout();
})();