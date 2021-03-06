"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRestoreMap = exports.readDependencyMatrix = exports.readBackupMap = exports.read = exports.restoreMapper = exports.backupDependencyMatrix = exports.backupMapper = exports.save = exports.restoreInit = exports.backupInit = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const lib_misc_1 = require("./lib.misc");
let logger = global.logger;
let sampleBackupData = {
    "version": `${global.version}`,
    "map": {
        "dataservice": {},
        "dataservice_lookup": {},
        "library": {},
        "library_lookup": {},
        "function": {},
        "function_lookup": {},
        "group": {},
        "group_lookup": {}
    },
    "data": {
        "dataservice": [],
        "library": [],
        "function": [],
        "group": []
    },
    "dependencyMatrix": {}
};
function backupInit() {
    (0, lib_misc_1.printInfo)(`Backup file - ${global.backupFileName}`);
    writeJSON(global.backupFileName, JSON.stringify(sampleBackupData));
}
exports.backupInit = backupInit;
function restoreInit() {
    logger.debug(`Restore file - ${global.restoreFileName}`);
    if (!(0, fs_1.existsSync)(global.backupFileName)) {
        (0, lib_misc_1.printInfo)(`Backup file ${global.backupFileName} doesn't exist!`);
        (0, lib_misc_1.killThySelf)(400);
    }
    writeJSON(global.restoreFileName, `{"version":"${global.version}"}`);
}
exports.restoreInit = restoreInit;
function save(key, data) {
    let backupData = readJSON(global.backupFileName);
    backupData.data[key] = data;
    writeJSON(global.backupFileName, backupData);
}
exports.save = save;
function backupMapper(token, key, value) {
    let backupData = readJSON(global.backupFileName);
    if (!backupData.map[token])
        backupData.map[token] = {};
    backupData.map[token][key] = value;
    writeJSON(global.backupFileName, backupData);
    logger.trace(`Updated ${global.backupFileName} : ${token} : ${key} : ${value}`);
}
exports.backupMapper = backupMapper;
function backupDependencyMatrix(data) {
    let backupData = readJSON(global.backupFileName);
    if (!backupData.dependencyMatrix)
        backupData["dependencyMatrix"] = {};
    backupData.dependencyMatrix = data;
    writeJSON(global.backupFileName, backupData);
    logger.trace(`Updated ${global.backupFileName} : dependencyMatrix`);
}
exports.backupDependencyMatrix = backupDependencyMatrix;
function restoreMapper(token, key, value) {
    let restoreMapData = readJSON(global.restoreFileName);
    if (!restoreMapData[token])
        restoreMapData[token] = {};
    restoreMapData[token][key] = value;
    writeJSON(global.restoreFileName, restoreMapData);
    logger.trace(`Updated ${global.restoreFileName} : ${token} : ${key} : ${value}`);
}
exports.restoreMapper = restoreMapper;
function read(key) {
    let backupData = readJSON(global.backupFileName);
    return backupData.data[key];
}
exports.read = read;
function readBackupMap(token) {
    let backupData = readJSON(global.backupFileName);
    return backupData.map[token];
}
exports.readBackupMap = readBackupMap;
function readDependencyMatrix() {
    let backupData = readJSON(global.backupFileName);
    return backupData.dependencyMatrix;
}
exports.readDependencyMatrix = readDependencyMatrix;
function readRestoreMap(token) {
    let restoreMapData = readJSON(global.restoreFileName);
    return restoreMapData[token];
}
exports.readRestoreMap = readRestoreMap;
function readJSON(filename) {
    const filePath = (0, path_1.join)(process.cwd(), filename);
    return JSON.parse((0, fs_1.readFileSync)(filePath).toString());
}
function writeJSON(filename, data) {
    if (typeof data == "object") {
        data = JSON.stringify(data);
    }
    const filePath = (0, path_1.join)(process.cwd(), filename);
    (0, fs_1.writeFileSync)(filePath, data);
}
