import { registerPrompt, Separator, prompt } from 'inquirer';
registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const options = [
	new Separator(),
	'Backup',
	'Restore',
	new Separator('--- Utils ---'),
	'Clear All',
];

const mainMenu = [
	new Separator('--- CONFIG ---'),
	'Show',
	'Add',
	'Delete',
	new Separator(),
	'Quit',
];

export async function startMenu() {
	return await prompt([{
		type: 'list',
		name: 'mode',
		message: '>',
		choices: mainMenu,
		pageSize: mainMenu.length
	}]);
}

export async function pickMode() {
	return await prompt([{
		type: 'list',
		name: 'mode',
		message: '>',
		choices: options,
		pageSize: options.length
	}]);
}

// e.pickApp = _apps => {
// 	var names = _apps.map(_d => _d._id);
// 	names = names.sort();
// 	return inquirer.prompt([{
// 		type: 'autocomplete',
// 		name: 'appName',
// 		message: 'Select app: ',
// 		pageSize: 5,
// 		source: (_ans, _input) => {
// 			_input = _input || '';
// 			return new Promise(_res => _res(names.filter(_n => _n.indexOf(_input) > -1)));
// 		}
// 	}]).then(_d => {
// 		misc.print('Selected app', _d.appName);
// 		logger.info(`Selected app : ${_d.appName}`);
// 		return _d.appName;
// 	});
// };

// e.customise = () => {
// 	return inquirer.prompt([{
// 		type: 'confirm',
// 		name: 'mode',
// 		message: 'Do you want to customise the backup?',
// 		default: false
// 	}]).then(_d => {
// 		logger.info(`Customization -  : ${_d.mode}`);
// 		if (_d.mode) return Promise.resolve();
// 		return Promise.reject();
// 	});
// };

// e.selections = (_type, _options) => {
// 	if (_options.length == 0) return Promise.resolve([]);
// 	return inquirer.prompt([{
// 		type: 'checkbox',
// 		name: 'selections',
// 		message: `Select ${_type} to backup`,
// 		choices: _options
// 	}]).then(_d => {
// 		logger.info(`Selected : ${_d.selections}`);
// 		return _d.selections;
// 	});
// };

// module.exports = e;