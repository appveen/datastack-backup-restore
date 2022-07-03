"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDependencyMatrix = exports.parseAndFixDataServices = exports.generateSampleDataSerivce = void 0;
const lib_db_1 = require("./lib.db");
let logger = global.logger;
function generateSampleDataSerivce(name, selectedApp) {
    return { "name": name, "description": null, "app": selectedApp };
}
exports.generateSampleDataSerivce = generateSampleDataSerivce;
function getUniqueElements(inputArray) {
    let outputArray = [];
    inputArray.forEach(elem => {
        if (outputArray.indexOf(elem) == -1)
            outputArray.push(elem);
    });
    return outputArray;
}
function findLibraries(def) {
    let librariesUsed = [];
    def.forEach((attr) => {
        if (attr.properties.schema)
            return librariesUsed.push(attr.properties.schema);
        if (attr.type == "Object" || attr.type == "Array") {
            let returnValues = findLibraries(attr.definition);
            librariesUsed = librariesUsed.concat(returnValues);
        }
    });
    return librariesUsed;
}
function repairRelationWithLibrary(definition, librariesUsed, libraryMap) {
    let stringifiedDefinition = JSON.stringify(definition);
    if (librariesUsed.length == 0)
        logger.info("No libraries foud");
    logger.info(`Libraries used : ${librariesUsed.join(",")}`);
    librariesUsed.forEach(lib => {
        stringifiedDefinition = stringifiedDefinition.split(lib).join(libraryMap[lib]);
    });
    return JSON.parse(stringifiedDefinition);
}
function repairRelationWithUser(parent, definition) {
    definition.forEach((attr) => {
        if (attr.type == "User") {
            logger.info(`${parent.join(">")} : Default value of '${attr.properties.name}' removed.`);
            delete attr.properties.default;
        }
        if (attr.type == "Object" || attr.type == "Array") {
            attr.definition = repairRelationWithUser(parent.concat(attr.properties.name), attr.definition);
        }
    });
    return definition;
}
function repairRelationships(parent, definition) {
    definition.forEach((attr) => {
        if (attr.properties.relatedTo) {
            logger.info(`${parent.join(">")} : Default value of '${attr.properties.name}' removed`);
            delete attr.properties.default;
        }
        if (attr.type == "Object" || attr.type == "Array") {
            attr.definition = repairRelationships(parent.concat(attr.properties.name), attr.definition);
        }
    });
    return definition;
}
function repairRelationshipIDs(definition, dependencies, dataserviceMap) {
    let stringifiedDefinition = JSON.stringify(definition);
    dependencies.forEach(dataserviceID => {
        stringifiedDefinition = stringifiedDefinition.split(dataserviceID).join(dataserviceMap[dataserviceID]);
    });
    return JSON.parse(stringifiedDefinition);
}
function parseAndFixDataServices(dataservices) {
    let libraryMap = (0, lib_db_1.readRestoreMap)("library");
    let dataserviceMap = (0, lib_db_1.readRestoreMap)("dataservice");
    logger.info(`Dataservice ID Map : ${JSON.stringify(dataserviceMap)}`);
    let dependencyMatrix = (0, lib_db_1.readDependencyMatrix)();
    logger.info(`Dataservice dependency matrix : ${JSON.stringify(dependencyMatrix)}`);
    dataservices.forEach((dataservice) => {
        delete dataservice.versionValidity;
        logger.info(`${dataservice.name} : Find and repair libraries`);
        dataservice.definition = repairRelationWithLibrary(dataservice.definition, dependencyMatrix[dataservice._id].libraries, libraryMap);
        logger.info(`${dataservice.name} : Find and repair User relations`);
        dataservice.definition = repairRelationWithUser([], dataservice.definition);
        logger.info(`${dataservice.name} : Find and repair dataservice relationships with default values`);
        dataservice.definition = repairRelationships([], dataservice.definition);
        logger.info(`${dataservice.name} : Find and repair dataservice relationship IDs`);
        if (dependencyMatrix[dataservice._id].length > 0)
            dataservice.definition = repairRelationshipIDs(dataservice.definition, dependencyMatrix[dataservice._id].dataservices, dataserviceMap);
        if (dataservice.relatedSchemas.incoming)
            dataservice.relatedSchemas.incoming = [];
        if (dataservice.relatedSchemas.outgoing)
            dataservice.relatedSchemas.outgoing = [];
    });
    return dataservices;
}
exports.parseAndFixDataServices = parseAndFixDataServices;
function buildDependencyMatrix(dataservices) {
    let dependencyMatrix = {};
    dataservices.forEach((dataservice) => {
        dependencyMatrix[dataservice._id] = { dataservices: [], libraries: [] };
        dataservice.relatedSchemas.outgoing.forEach((outgoing) => {
            if (dependencyMatrix[dataservice._id].dataservices.indexOf(outgoing.service) == -1)
                dependencyMatrix[dataservice._id].dataservices.push(outgoing.service);
        });
        let libraries = findLibraries(dataservice.definition);
        libraries = getUniqueElements(libraries);
        dependencyMatrix[dataservice._id].libraries = libraries;
    });
    return dependencyMatrix;
}
exports.buildDependencyMatrix = buildDependencyMatrix;
