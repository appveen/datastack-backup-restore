"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.restoreMapper = exports.backupMapper = exports.save = exports.restoreInit = exports.backupInit = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const lib_misc_1 = require("./lib.misc");
let logger = global.logger;
function backupInit() {
    (0, lib_misc_1.printInfo)(`Backup file - ${global.backupFileName}`);
    (0, lib_misc_1.printInfo)(`Map file    - ${global.backupMapFileName}`);
    writeJSON(global.backupFileName, `{"version":"${global.version}"}`);
    writeJSON(global.backupMapFileName, `{"version":"${global.version}"}`);
}
exports.backupInit = backupInit;
function restoreInit() {
    logger.debug(`Creating restore files - ${global.restoreFileName} and ${global.restoreMapFileName}`);
    writeJSON(global.restoreFileName, `{"version":"${global.version}"}`);
    writeJSON(global.restoreMapFileName, `{"version":"${global.version}"}`);
}
exports.restoreInit = restoreInit;
function save(key, data) {
    let backupData = readJSON(global.backupFileName);
    backupData[key] = data;
    writeJSON(global.backupFileName, backupData);
}
exports.save = save;
function backupMapper(token, key, data) {
    let backupData = readJSON(global.backupMapFileName);
    if (!backupData[token])
        backupData[token] = {};
    backupData[token][key] = data;
    writeJSON(global.backupMapFileName, backupData);
    logger.trace(`Updated ${global.backupMapFileName} : ${token} : ${key} : ${data}`);
}
exports.backupMapper = backupMapper;
function restoreMapper(token, key, data) {
    let restoreMapData = readJSON(global.restoreMapFileName);
    if (!restoreMapData[token])
        restoreMapData[token] = {};
    restoreMapData[token][key] = data;
    writeJSON(global.restoreMapFileName, restoreMapData);
    logger.trace(`Updated ${global.restoreMapFileName} : ${token} : ${key} : ${data}`);
}
exports.restoreMapper = restoreMapper;
function read(key) {
    let data = readJSON(global.backupFileName);
    return data[key];
}
exports.read = read;
function readJSON(filename) {
    const filePath = (0, path_1.join)(process.cwd(), filename);
    return JSON.parse((0, fs_1.readFileSync)(filePath).toString());
}
function writeJSON(filename, data) {
    if (typeof data == 'object') {
        data = JSON.stringify(data);
    }
    const filePath = (0, path_1.join)(process.cwd(), filename);
    (0, fs_1.writeFileSync)(filePath, data);
}
