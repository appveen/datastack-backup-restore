"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
'log4js';
const version = require('../package.json').version;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
let d = (new Date()).toISOString().replace(/:/gi, '-');
let fileName = `dsBR_${version.split('.').join('_')}_${d}.log`;
(0, log4js_1.configure)({
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
const logger = (0, log4js_1.getLogger)(`[${version}]`);
logger.level = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'info';
global.logger = logger;
const lib_misc_1 = require("./lib.misc");
const manager_api_1 = require("./manager.api");
// const configManager = require('./lib.configManager');
const apiManager = require('./manager.api');
const backupManager = require('./manager.backup');
const restoreManager = require('./manager.restore');
const clearAllManager = require('./manager.clearAll');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        // let selection = await cli.pickMode();
        // if (selection.mode == 'Backup') await backupManager();
        // if (selection.mode == 'Restore') await restoreManager();
        // if (selection.mode == 'Clear All') await clearAllManager();
        let creds = {
            'host': "https://cloud.appveen.com",
            "username": "jerry@appveen.com",
            "password": "thisismysecret"
        };
        yield (0, manager_api_1.login)(creds);
        var apps = yield (0, manager_api_1.getApps)();
        console.log(apps);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, lib_misc_1.header)(`data.stack Backup and Restore Utility ${version}`);
    yield start();
}))();
