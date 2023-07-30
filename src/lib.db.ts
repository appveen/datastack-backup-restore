import { join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { killThySelf, printInfo } from "./lib.misc";

let logger = global.logger;

let sampleBackupData = {
	"version": `${global.version}`,
	"map": {
		"mapperformula": {},
		"mapperformula_lookup": {},
		"plugin": {},
		"plugin_lookup": {},
		"npmlibrary": {},
		"npmlibrary_lookup": {},
		"dataservice": {},
		"dataservice_lookup": {},
		"library": {},
		"library_lookup": {},
		"function": {},
		"function_lookup": {},
		"connectors": {},
		"connectors_lookup": {},
		"dataformats": {},
		"dataformats_lookup": {},
		"agents": {},
		"agents_lookup": {},
		"datapipes": {},
		"datapipes_lookup": {},
		"group": {},
		"group_lookup": {}
	},
	"data": {
		"mapperformula": [],
		"plugin": [],
		"npmlibrary": [],
		"dataservice": [],
		"library": [],
		"function": [],
		"connectors": [],
		"dataformats": [],
		"agents": [],
		"datapipes": [],
		"group": []
	},
	"dependencyMatrixOfDataService": {},
	"dependencyMatrixOfDataPipe": {}
};

export function backupInit() {
	printInfo(`Backup file - ${global.backupFileName}`);
	writeJSON(global.backupFileName, JSON.stringify(sampleBackupData));
}

export function restoreInit() {
	logger.debug(`Restore file - ${global.restoreFileName}`);
	if (!existsSync(global.backupFileName)) {
		printInfo(`Backup file ${global.backupFileName} doesn't exist!`);
		killThySelf(400);
	}
	writeJSON(global.restoreFileName, `{"version":"${global.version}"}`);
}

export function save(key: string, data: any[]) {
	let backupData = readJSON(global.backupFileName);
	backupData.data[key] = data;
	writeJSON(global.backupFileName, backupData);
}

export function backupMapper(token: string, key: string, value: string) {
	let backupData = readJSON(global.backupFileName);
	if (!backupData.map[token]) backupData.map[token] = {};
	backupData.map[token][key] = value;
	writeJSON(global.backupFileName, backupData);
	logger.trace(`Updated ${global.backupFileName} : ${token} : ${key} : ${value}`);
}

export function backupDependencyMatrixOfDataService(data: any) {
	let backupData = readJSON(global.backupFileName);
	if (!backupData.dependencyMatrixOfDataService) backupData["dependencyMatrixOfDataService"] = {};
	backupData.dependencyMatrixOfDataService = data;
	writeJSON(global.backupFileName, backupData);
	logger.trace(`Updated ${global.backupFileName} : dependencyMatrixOfDataService`);
}

export function backupDependencyMatrixOfDataPipe(data: any) {
	let backupData = readJSON(global.backupFileName);
	if (!backupData.dependencyMatrixOfDataPipe) backupData["dependencyMatrixOfDataPipe"] = {};
	backupData.dependencyMatrixOfDataPipe = data;
	writeJSON(global.backupFileName, backupData);
	logger.trace(`Updated ${global.backupFileName} : dependencyMatrixOfDataPipe`);
}

export function restoreMapper(token: string, key: string, value: string) {
	let restoreMapData = readJSON(global.restoreFileName);
	if (!restoreMapData[token]) restoreMapData[token] = {};
	restoreMapData[token][key] = value;
	writeJSON(global.restoreFileName, restoreMapData);
	logger.trace(`Updated ${global.restoreFileName} : ${token} : ${key} : ${value}`);
}

export function read(key: string) {
	let backupData = readJSON(global.backupFileName);
	return backupData.data[key];
}

export function readBackupMap(token: string) {
	let backupData = readJSON(global.backupFileName);
	return backupData.map[token];
}

export function readDependencyMatrixofDataService() {
	let backupData = readJSON(global.backupFileName);
	return backupData.dependencyMatrixOfDataService;
}

export function readDependencyMatrixofDataPipe() {
	let backupData = readJSON(global.backupFileName);
	return backupData.dependencyMatrixOfDataPipe;
}

export function readRestoreMap(token: string) {
	let restoreMapData = readJSON(global.restoreFileName);
	return restoreMapData[token];
}

function readJSON(filename: string) {
	const filePath = join(process.cwd(), filename);
	return JSON.parse(readFileSync(filePath).toString());
}

function writeJSON(filename: string, data: any) {
	if (typeof data == "object") {
		data = JSON.stringify(data);
	}
	const filePath = join(process.cwd(), filename);
	writeFileSync(filePath, data);
}
