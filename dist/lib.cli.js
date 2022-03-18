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
exports.pickMode = exports.startMenu = void 0;
const inquirer_1 = require("inquirer");
(0, inquirer_1.registerPrompt)('autocomplete', require('inquirer-autocomplete-prompt'));
const options = [
    new inquirer_1.Separator(),
    'Backup',
    'Restore',
    new inquirer_1.Separator('--- Utils ---'),
    'Clear All',
];
const mainMenu = [
    new inquirer_1.Separator('--- CONFIG ---'),
    'Show',
    'Add',
    'Delete',
    new inquirer_1.Separator(),
    'Quit',
];
function startMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, inquirer_1.prompt)([{
                type: 'list',
                name: 'mode',
                message: '>',
                choices: mainMenu,
                pageSize: mainMenu.length
            }]);
    });
}
exports.startMenu = startMenu;
function pickMode() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, inquirer_1.prompt)([{
                type: 'list',
                name: 'mode',
                message: '>',
                choices: options,
                pageSize: options.length
            }]);
    });
}
exports.pickMode = pickMode;
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
