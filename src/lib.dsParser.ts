import { readRestoreMap } from "./lib.db";

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


function findLibraries(def: any) {
	let librariesUsed: string[] = [];
	def.forEach((attr: any) => {
		if (attr.properties.schema) return librariesUsed.push(attr.properties.schema);
		if (attr.type == "Object" || attr.type == "Array") {
			let returnValues = findLibraries(attr.definition);
			librariesUsed = librariesUsed.concat(returnValues);
		}
	});
	return librariesUsed;
}

function repairRelationWithLibrary(definition: any) {
	let stringifiedDefinition = JSON.stringify(definition);
	let librariesUsed = findLibraries(definition);
	librariesUsed = getUniqueElements(librariesUsed);
	if (librariesUsed.length == 0) logger.info("No libraries foud");
	logger.info(`Libraries used : ${librariesUsed.join(",")}`);
	let libraryMap = readRestoreMap("library");
	librariesUsed.forEach(lib => {
		stringifiedDefinition = stringifiedDefinition.split(lib).join(libraryMap[lib]);
	});
	return JSON.parse(stringifiedDefinition);
}

function repairRelationWithUser(parent: string[], definition: any) {
	definition.forEach((attr: any) => {
		if (attr.type == "User") {
			logger.info(`${parent.join(">")} : Default value of ${attr.properties.name} removed.`);
			delete attr.properties.default;
		}
		if (attr.type == "Object" || attr.type == "Array") {
			attr.definition = repairRelationWithUser(parent.concat(attr.properties.name), attr.definition);
		}
	});
	return definition;
}

export function parseAndFixDataServices(dataservices: any[]) {
	dataservices.forEach((dataservice: any) => {
		delete dataservice.versionValidity;

		logger.info(`${dataservice.name} : Find and repair libraries`);
		dataservice.definition = repairRelationWithLibrary(dataservice.definition);

		logger.info(`${dataservice.name} : Find and repair User relations`);
		dataservice.definition = repairRelationWithUser([], dataservice.definition);
	});
	return dataservices;
}