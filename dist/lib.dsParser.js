"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDependencyMatrix = exports.parseAndFixDataServices = exports.generateSampleDataSerivce = void 0;
const lib_db_1 = require("./lib.db");
const types_1 = require("./types");
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
function repairRelationWithLibrary(definition) {
    let stringifiedDefinition = JSON.stringify(definition);
    let librariesUsed = findLibraries(definition);
    librariesUsed = getUniqueElements(librariesUsed);
    if (librariesUsed.length == 0)
        logger.info("No libraries foud");
    logger.info(`Libraries used : ${librariesUsed.join(",")}`);
    let libraryMap = (0, lib_db_1.readRestoreMap)("library");
    librariesUsed.forEach(lib => {
        stringifiedDefinition = stringifiedDefinition.split(lib).join(libraryMap[lib]);
    });
    return JSON.parse(stringifiedDefinition);
}
function repairRelationWithUser(parent, definition) {
    definition.forEach((attr) => {
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
function parseAndFixDataServices(dataservices) {
    dataservices.forEach((dataservice) => {
        delete dataservice.versionValidity;
        logger.info(`${dataservice.name} : Find and repair libraries`);
        dataservice.definition = repairRelationWithLibrary(dataservice.definition);
        logger.info(`${dataservice.name} : Find and repair User relations`);
        dataservice.definition = repairRelationWithUser([], dataservice.definition);
    });
    return dataservices;
}
exports.parseAndFixDataServices = parseAndFixDataServices;
function buildDependencyMatrix(dataservices) {
    let dependencyMatrix = new types_1.DependencyMatrix();
    // INIT
    dataservices.forEach((dataservice) => {
        dependencyMatrix.matrix[dataservice._id] = [];
        dependencyMatrix.rank[dataservice._id] = 0;
    });
    // BUILD MATRIX
    dataservices.forEach((dataservice) => {
        if (!dataservice.relatedSchemas.outgoing)
            return;
        dataservice.relatedSchemas.outgoing.forEach((outgoing) => {
            if (dependencyMatrix.matrix[dataservice._id].indexOf(outgoing.service) == -1)
                dependencyMatrix.matrix[dataservice._id].push(outgoing.service);
            dependencyMatrix.rank[outgoing.service] += 1;
            if (dependencyMatrix.rank[outgoing.service] > dependencyMatrix.largest)
                dependencyMatrix.largest = dependencyMatrix.rank[outgoing.service];
        });
    });
    let largest = dependencyMatrix.largest;
    while (largest > -1) {
        dependencyMatrix.ordered[largest] = [];
        Object.keys(dependencyMatrix.rank).forEach((key) => {
            if (dependencyMatrix.rank[key] == largest)
                dependencyMatrix.ordered[largest].push(key);
        });
        largest -= 1;
    }
    return dependencyMatrix;
}
exports.buildDependencyMatrix = buildDependencyMatrix;
