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
exports.parseCliParams = exports.printDone = exports.printError = exports.printInfo = exports.isNotAnAcceptableValue = exports.stringComparison = exports.header = exports.killThySelf = void 0;
const log4js_1 = require("log4js");
let logger = global.logger;
function killThySelf(killCode) {
    return __awaiter(this, void 0, void 0, function* () {
        printError(`Terminating with exit code(${killCode})`);
        // process.exit(killCode);
        yield (0, log4js_1.shutdown)(function () { process.exit(killCode); });
    });
}
exports.killThySelf = killThySelf;
function header(_s) {
    let totalWidth = 32;
    let fitLength = _s.length;
    if (_s.length % 2 != 0) {
        fitLength += 1;
        _s += " ";
    }
    let sideWidth = (totalWidth - fitLength) / 2;
    let middle = "";
    let i = 0;
    while (i < fitLength) {
        middle += "─";
        i++;
    }
    let liner = "";
    let spacer = "";
    i = 0;
    while (i < sideWidth) {
        liner += "─";
        spacer += " ";
        i++;
    }
    let top = "┌" + liner + middle + liner + "┐";
    let bottom = "└" + liner + middle + liner + "┘";
    let center = "│" + spacer + _s + spacer + "│";
    printInfo(top);
    printInfo(center);
    printInfo(bottom);
}
exports.header = header;
function stringComparison(a, b) {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();
    if (nameA < nameB)
        return -1;
    if (nameA > nameB)
        return 1;
    return 0;
}
exports.stringComparison = stringComparison;
function isNotAnAcceptableValue(i) {
    if (typeof i == "object")
        return true;
    if (i == null)
        return true;
    return false;
}
exports.isNotAnAcceptableValue = isNotAnAcceptableValue;
function printInfo(message) {
    logger.info(message);
    console.log(message);
}
exports.printInfo = printInfo;
function printError(message) {
    logger.error(message);
    console.error(`!!! ${message} !!!`);
}
exports.printError = printError;
function printDone(_msg, _count) {
    console.log(`  ${padCount(_count)} ${_msg}`);
    logger.info(`${_msg} -> ${_count}`);
}
exports.printDone = printDone;
function padCount(_d) {
    if (_d > 9)
        return ` ${_d} `;
    return `  ${_d} `;
}
function parseCliParams(options, timestamp) {
    // ENV VAR > CLI PARAM > RUNTIME
    global.backupFileName = `backup-${timestamp}.json`;
    if (options.backupfile)
        global.backupFileName = options.backupfile;
    global.backupFileName = process.env.DS_BR_BACKUPFILE ? process.env.DS_BR_BACKUPFILE : global.backupFileName;
    global.restoreFileName = `restore-${timestamp}.json`;
    if (process.env.DS_BR_SINGLELOGFILE) {
        global.backupFileName = "backup.json";
        global.restoreFileName = "restore.json";
    }
    if (options.host)
        process.env.DS_BR_HOST = options.host;
    if (options.username)
        process.env.DS_BR_USERNAME = options.username;
    if (options.password)
        process.env.DS_BR_PASSWORD = options.password;
}
exports.parseCliParams = parseCliParams;
