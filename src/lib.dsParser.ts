import { readRestoreMap, readDependencyMatrix } from "./lib.db";
import { DependencyMatrix } from "./types";

let logger = global.logger;

export function generateSampleDataSerivce(name: string, selectedApp: String) {
	return { "name": name, "description": null, "app": selectedApp };
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

function repairRelationWithLibrary(definition: any, libraryMap: any) {
	let stringifiedDefinition = JSON.stringify(definition);
	let librariesUsed = findLibraries(definition);
	librariesUsed = getUniqueElements(librariesUsed);
	if (librariesUsed.length == 0) logger.info("No libraries foud");
	logger.info(`Libraries used : ${librariesUsed.join(",")}`);
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

function repairRelationships(parent: any[], definition: any): any {
	definition.forEach((attr: any) => {
		if (attr.properties.relatedTo) {
			logger.info(`${parent.join(">")} : Default value of ${attr.properties.name} removed`);
			delete attr.properties.default;
		}
		if (attr.type == "Object" || attr.type == "Array") {
			attr.definition = repairRelationships(parent.concat(attr.properties.name), attr.definition);
		}
	});
	return definition;
}

function repairRelationshipIDs(definition: any, dependencies: string[], dataserviceMap: any): any {
	let stringifiedDefinition = JSON.stringify(definition);
	dependencies.forEach(dataserviceID => {
		stringifiedDefinition = stringifiedDefinition.split(dataserviceID).join(dataserviceMap[dataserviceID]);
	});
	return JSON.parse(stringifiedDefinition);
}

export function parseAndFixDataServices(dataservices: any[]): any[] {
	let libraryMap = readRestoreMap("library");
	let dataserviceMap = readRestoreMap("dataservice");
	logger.info(`Dataservice ID Map : ${JSON.stringify(dataserviceMap)}`);
	let dependencyMatrix = readDependencyMatrix().matrix;
	logger.info(`Dataservice dependency matrix : ${JSON.stringify(dependencyMatrix)}`);
	dataservices.forEach((dataservice: any) => {
		delete dataservice.versionValidity;

		logger.info(`${dataservice.name} : Find and repair libraries`);
		dataservice.definition = repairRelationWithLibrary(dataservice.definition, libraryMap);

		logger.info(`${dataservice.name} : Find and repair User relations`);
		dataservice.definition = repairRelationWithUser([], dataservice.definition);

		logger.info(`${dataservice.name} : Find and repair dataservice relationships with default values`);
		dataservice.definition = repairRelationships([], dataservice.definition);

		logger.info(`${dataservice.name} : Find and repair dataservice relationship IDs`);
		if (dependencyMatrix[dataservice._id].length > 0) dataservice.definition = repairRelationshipIDs(dataservice.definition, dependencyMatrix[dataservice._id], dataserviceMap);

		if (dataservice.relatedSchemas.incoming) dataservice.relatedSchemas.incoming = [];
		if (dataservice.relatedSchemas.outgoing) dataservice.relatedSchemas.outgoing = [];

	});
	return dataservices;
}

export function buildDependencyMatrix(dataservices: any[]) {
	let dependencyMatrix = new DependencyMatrix();
	// INIT
	dataservices.forEach((dataservice: any) => {
		dependencyMatrix.matrix[dataservice._id] = [];
		dependencyMatrix.rank[dataservice._id] = 0;
	});
	// BUILD MATRIX
	dataservices.forEach((dataservice: any) => {
		if (!dataservice.relatedSchemas.outgoing) return;
		dataservice.relatedSchemas.outgoing.forEach((outgoing: any) => {
			if (dependencyMatrix.matrix[dataservice._id].indexOf(outgoing.service) == -1) dependencyMatrix.matrix[dataservice._id].push(outgoing.service);
			dependencyMatrix.rank[outgoing.service] += 1;
			if (dependencyMatrix.rank[outgoing.service] > dependencyMatrix.largest) dependencyMatrix.largest = dependencyMatrix.rank[outgoing.service];
		});
	});
	let largest = dependencyMatrix.largest;
	while (largest > -1) {
		dependencyMatrix.ordered[largest] = [];
		Object.keys(dependencyMatrix.rank).forEach((key: string) => {
			if (dependencyMatrix.rank[key] == largest) dependencyMatrix.ordered[largest].push(key);
		});
		largest -= 1;
	}
	return dependencyMatrix;
}