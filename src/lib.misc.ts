import { shutdown } from "log4js";

var logger = global.logger;

export async function killThySelf(killCode: number) {
	printError(`Terminating with exit code(${killCode})`);
	await shutdown(function () { process.exit(killCode); });
}

export function header(_s: string) {
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
	var top = "┌" + liner + middle + liner + "┐";
	var bottom = "└" + liner + middle + liner + "┘";
	var center = "│" + spacer + _s + spacer + "│";
	console.log("");
	printInfo(top);
	printInfo(center);
	printInfo(bottom);
}

export function stringComparison(a: string, b: string) {
	let nameA = a.toUpperCase();
	let nameB = b.toUpperCase();
	if (nameA < nameB) return -1;
	if (nameA > nameB) return 1;
	return 0;
}

export function isNotAnAcceptableValue(i: any) {
	if (typeof i == "object") return true;
	if (i == null) return true;
	return false;
}

export function printInfo(message: string) {
	logger.info(message);
	console.log(message);
}

export function printError(message: string) {
	logger.error(message);
	console.error(message);
}

export function printDone(_msg: string, _count: number) {
	console.log(`  ${padCount(_count)} ${_msg}`);
	logger.info(`${_msg} -> ${_count}`);
}

function padCount(_d: number) {
	if (_d > 9) return ` ${_d} `;
	return `  ${_d} `;
}