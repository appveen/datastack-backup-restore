"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndFixDataService = exports.generateDependencyMatrix = exports.generateSampleDataSerivce = void 0;
const lib_db_1 = require("./lib.db");
let logger = global.logger;
function generateSampleDataSerivce(name, selectedApp) {
    return { "name": name, "description": null, "app": selectedApp };
}
exports.generateSampleDataSerivce = generateSampleDataSerivce;
function generateDependencyMatrix(dataservice) {
}
exports.generateDependencyMatrix = generateDependencyMatrix;
function getUniqueElements(inputArray) {
    let outputArray = [];
    inputArray.forEach(elem => {
        if (outputArray.indexOf(elem) == -1)
            outputArray.push(elem);
    });
    return outputArray;
}
function findLibraries(parent, def) {
    let librariesUsed = [];
    def.forEach((attr) => {
        if (attr.properties.schema)
            return librariesUsed.push(attr.properties.schema);
        if (attr.type == "Object" || attr.type == "Array") {
            let returnValues = findLibraries(`${parent}->${attr.key}`, attr.definition);
            librariesUsed = librariesUsed.concat(returnValues);
        }
    });
    return librariesUsed;
}
function fixLibraries(stringifiedDefinition, librariesUsed) {
    let libraryMap = (0, lib_db_1.readRestoreMap)("library");
    librariesUsed.forEach(lib => {
        stringifiedDefinition = stringifiedDefinition.split(lib).join(libraryMap[lib]);
    });
    return stringifiedDefinition;
}
function parseAndFixDataService(ds) {
    let stringifiedDefinition = JSON.stringify(ds.definition);
    // 
    let librariesUsed = findLibraries("", ds.definition);
    librariesUsed = getUniqueElements(librariesUsed);
    logger.info(`${ds.name} : Libraries used : ${librariesUsed.join(",")}`);
    stringifiedDefinition = fixLibraries(stringifiedDefinition, librariesUsed);
    ds.definition = JSON.parse(stringifiedDefinition);
    return ds;
}
exports.parseAndFixDataService = parseAndFixDataService;
