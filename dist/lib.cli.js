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
exports.selectApp = exports.startMenu = exports.validateCLIParams = void 0;
const lib_misc_1 = require("./lib.misc");
const inquirer_1 = require("inquirer");
const types_1 = require("@appveen/ds-sdk/dist/types");
(0, inquirer_1.registerPrompt)("autocomplete", require("inquirer-autocomplete-prompt"));
var logger = global.logger;
const mainMenu = [
    new inquirer_1.Separator(),
    "Backup",
    "Restore",
    new inquirer_1.Separator("--- Utils ---"),
    "Clear All",
];
function validateCLIParams() {
    return __awaiter(this, void 0, void 0, function* () {
        let credentials = new types_1.Credentials();
        let terminate = false;
        if ((0, lib_misc_1.isNotAnAcceptableValue)(process.env.DS_BR_HOST)) {
            logger.error("DS_BR_HOST is invalid.");
            terminate = true;
        }
        if ((0, lib_misc_1.isNotAnAcceptableValue)(process.env.DS_BR_USERNAME)) {
            logger.error("DS_BR_USERNAME is invalid.");
            terminate = true;
        }
        if (terminate)
            yield (0, lib_misc_1.killThySelf)(100);
        credentials.host = process.env.DS_BR_HOST;
        global.host = process.env.DS_BR_HOST || "";
        credentials.username = process.env.DS_BR_USERNAME;
        logger.info(`Host      : ${credentials.host}`);
        logger.info(`Username  : ${credentials.username}`);
        credentials.password = process.env.DS_BR_PASSWORD;
        if ((0, lib_misc_1.isNotAnAcceptableValue)(process.env.DS_BR_PASSWORD)) {
            yield (0, inquirer_1.prompt)([{
                    type: "password",
                    name: "password",
                    message: "Password>"
                }]).then(data => credentials.password = data.password);
        }
        return credentials;
    });
}
exports.validateCLIParams = validateCLIParams;
function startMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, inquirer_1.prompt)([{
                type: "list",
                name: "mode",
                message: ">",
                choices: mainMenu,
                pageSize: mainMenu.length
            }]);
    });
}
exports.startMenu = startMenu;
function selectApp(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, inquirer_1.prompt)([{
                type: "autocomplete",
                name: "appName",
                message: "Select app: ",
                pageSize: 5,
                source: (_ans, _input) => {
                    _input = _input || "";
                    return new Promise(_res => _res(apps.filter((_n) => _n.toLowerCase().indexOf(_input) > -1)));
                }
            }]).then(_d => {
            logger.info(`Selected app : ${_d.appName}`);
            return _d.appName;
        });
    });
}
exports.selectApp = selectApp;
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
