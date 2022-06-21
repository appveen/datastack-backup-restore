import { readRestoreMap } from "./lib.db";
import { printInfo } from "./lib.misc";
import { DependencyMatrix } from "./types";

let logger = global.logger;

export function generateSampleDataSerivce(name: string, selectedApp: String) {
	return { "name": name, "description": null, "app": selectedApp };
}

export function generateDependencyMatrix(dataservice: any[]) {
}

function getUniqueElements(inputArray: any[]) {
	let outputArray: any[] = [];
	inputArray.forEach(elem => {
		if (outputArray.indexOf(elem) == -1) outputArray.push(elem);
	});
	return outputArray;
}


function findLibraries(parent: string, def: any) {
	let librariesUsed: string[] = [];
	def.forEach((attr: any) => {
		if (attr.properties.schema) return librariesUsed.push(attr.properties.schema);
		if (attr.type == "Object" || attr.type == "Array") {
			let returnValues = findLibraries(`${parent}->${attr.key}`, attr.definition);
			librariesUsed = librariesUsed.concat(returnValues);
		}
	});
	return librariesUsed;
}

function fixLibraries(stringifiedDefinition: string, librariesUsed: string[]): string {
	let libraryMap = readRestoreMap("library");
	librariesUsed.forEach(lib => {
		stringifiedDefinition = stringifiedDefinition.split(lib).join(libraryMap[lib]);
	});
	return stringifiedDefinition;
}

export function parseAndFixDataService(ds: any) {
	let stringifiedDefinition = JSON.stringify(ds.definition);
	// 
	let librariesUsed = findLibraries("", ds.definition);
	librariesUsed = getUniqueElements(librariesUsed);
	logger.info(`${ds.name} : Libraries used : ${librariesUsed.join(",")}`);
	stringifiedDefinition = fixLibraries(stringifiedDefinition, librariesUsed);
	ds.definition = JSON.parse(stringifiedDefinition);
	return ds;
}