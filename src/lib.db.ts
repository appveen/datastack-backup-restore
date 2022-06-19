import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { printInfo } from './lib.misc';

let logger = global.logger;

export function backupInit() {
	printInfo(`Backup file - ${global.backupFileName}`);
	printInfo(`Map file    - ${global.backupMapFileName}`);
	writeJSON(global.backupFileName, `{"version":"${global.version}"}`);
	writeJSON(global.backupMapFileName, `{"version":"${global.version}"}`);
}

export function restoreInit() {
	logger.debug(`Creating restore files - ${global.restoreFileName} and ${global.restoreMapFileName}`);
	writeJSON(global.restoreFileName, `{"version":"${global.version}"}`);
	writeJSON(global.restoreMapFileName, `{"version":"${global.version}"}`);
}

export function save(key: string, data: any[]) {
	let backupData = readJSON(global.backupFileName);
	backupData[key] = data;
	writeJSON(global.backupFileName, backupData);
}

export function backupMapper(token: string, key: string, data: string) {
	let backupData = readJSON(global.backupMapFileName);
	if (!backupData[token]) backupData[token] = {};
	backupData[token][key] = data;
	writeJSON(global.backupMapFileName, backupData);
	logger.trace(`Updated ${global.backupMapFileName} : ${token} : ${key} : ${data}`);
}

export function restoreMapper(token: string, key: string, data: string) {
	let restoreMapData = readJSON(global.restoreMapFileName);
	if (!restoreMapData[token]) restoreMapData[token] = {};
	restoreMapData[token][key] = data;
	writeJSON(global.restoreMapFileName, restoreMapData);
	logger.trace(`Updated ${global.restoreMapFileName} : ${token} : ${key} : ${data}`);
}

export function read(key: string) {
	let data = readJSON(global.backupFileName);
	return data[key];
}

function readJSON(filename: string) {
	const filePath = join(process.cwd(), filename);
	return JSON.parse(readFileSync(filePath).toString());
}

function writeJSON(filename: string, data: any) {
	if (typeof data == 'object') {
		data = JSON.stringify(data);
	}
	const filePath = join(process.cwd(), filename);
	writeFileSync(filePath, data);
}
