import { isNotAnAcceptableValue, killThySelf } from "./lib.misc";
import { registerPrompt, Separator, prompt } from "inquirer";
import { Credentials } from "@appveen/ds-sdk/dist/types";
registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));

var logger = global.logger;

const mainMenu = [
	new Separator(),
	"Backup",
	"Restore",
	new Separator("--- Utils ---"),
	"Clear All",
];

export async function validateCLIParams(): Promise<Credentials> {
	let credentials = new Credentials();
	let terminate = false;
	if (isNotAnAcceptableValue(process.env.DS_BR_HOST)) {
		logger.error("DS_BR_HOST is invalid.");
		terminate = true;
	}

	if (isNotAnAcceptableValue(process.env.DS_BR_USERNAME)) {
		logger.error("DS_BR_USERNAME is invalid.");
		terminate = true;
	}

	if (terminate) await killThySelf(100);

	credentials.host = process.env.DS_BR_HOST;
	global.host = process.env.DS_BR_HOST || "";
	credentials.username = process.env.DS_BR_USERNAME;
	logger.info(`Host      : ${credentials.host}`);
	logger.info(`Username  : ${credentials.username}`);
	credentials.password = process.env.DS_BR_PASSWORD;
	if (isNotAnAcceptableValue(process.env.DS_BR_PASSWORD)) {
		await prompt([{
			type: "password",
			name: "password",
			message: "Password>"
		}]).then(data => credentials.password = data.password);
	}

	return credentials;
}

export async function startMenu() {
	return await prompt([{
		type: "list",
		name: "mode",
		message: ">",
		choices: mainMenu,
		pageSize: mainMenu.length
	}]);
}

export async function selectApp(apps: any) {
	return await prompt([{
		type: "autocomplete",
		name: "appName",
		message: "Select app: ",
		pageSize: 5,
		source: (_ans: any, _input: string) => {
			_input = _input || "";
			return new Promise(_res => _res(apps.filter((_n: string) => _n.toLowerCase().indexOf(_input) > -1)));
		}
	}]).then(_d => {
		logger.info(`Selected app : ${_d.appName}`);
		return _d.appName;
	});
}

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