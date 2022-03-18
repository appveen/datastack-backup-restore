import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { prompt, registerPrompt } from 'inquirer';
registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

import { header } from './lib.misc';
import { ConfigData } from './types';

const configDBFile = join(process.cwd(), 'config.db');

let logger = global.logger;

if (!existsSync(configDBFile)) {
	logger.info('No config.db found. Initializing a new one.');
	let configData = { 'data': [] };
	writeFileSync(configDBFile, JSON.stringify(configData));
}

let e = {};

export async function addConfig() {
	let data = await prompt([
		{
			type: 'input',
			name: 'name',
			message: 'Server name',
		},
		{
			type: 'input',
			name: 'url',
			message: 'URL',
		},
		{
			type: 'input',
			name: 'username',
			message: 'Username',
		}
	]);
	var configData = new ConfigData(JSON.parse(readFileSync(configDBFile).toString()));
	configData.push(data);
	writeFileSync(configDBFile, JSON.stringify(configData));
	return configData;
}

export async function deleteConfig() {
	var configData = new ConfigData(JSON.parse(readFileSync(configDBFile).toString()));
	if (configData.data.length < 1) configData = await addConfig();
	var names = configData.data.map(_d => _d.name);
	let selection = await prompt([{
		type: 'autocomplete',
		name: 'config',
		message: 'Config',
		pageSize: 5,
		source: async (_ans: string, _input: string) => {
			_input = _input || '';
			return await names.filter(_n => (_n || ' ').indexOf(_input) > -1);
		}
	}]);
	let index = names.indexOf(selection.config);
	let confirm = await prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: `Are you sure you want to remove "${selection.config}"?`,
			default: false
		}
	]);
	if (confirm.confirm) {
		configData.data.splice(index, 1);
		writeFileSync(configDBFile, JSON.stringify(configData));
	} else logger.info('Configurations left unchanged!');
}

export async function display() {
	var configData = new ConfigData(JSON.parse(readFileSync(configDBFile).toString()));
	if (configData.data.length < 1) {
		logger.info('No configuration found.');
		configData = await addConfig();
	}
	var names = configData.data.map(_d => _d.name);
	let selection = await prompt([{
		type: 'autocomplete',
		name: 'config',
		message: 'Configuration list',
		pageSize: 5,
		source: async (_ans: string, _input: string) => {
			_input = _input || '';
			return await names.filter(_n => (_n || ' ').indexOf(_input) > -1);
		}
	}]);
	logger.info(`Selected config :: ${selection.config}`);
	let config = configData.data.filter(d => selection.config == d.name)[0];
	header(`${config.name} (${config.url})`);
	let password = await prompt([
		{
			type: 'password',
			name: 'password',
			message: `Password for ${config.username}`,
		}
	]);
	config.password = password.password;
	return config;
}


module.exports = e;