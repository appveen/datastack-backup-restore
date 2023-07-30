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
exports.backupManager = void 0;
const lib_cli_1 = require("./lib.cli");
const lib_misc_1 = require("./lib.misc");
const manager_api_1 = require("./manager.api");
const lib_db_1 = require("./lib.db");
const lib_parser_ds_1 = require("./lib.parser.ds");
const lib_parser_pipe_1 = require("./lib.parser.pipe");
let logger = global.logger;
let selectedApp = "";
function getURLParamsForCount() {
    let searchParams = new URLSearchParams();
    searchParams.append("filter", JSON.stringify({ app: selectedApp }));
    return searchParams;
}
function getURLParamsForData(count) {
    let searchParams = new URLSearchParams();
    searchParams.append("filter", JSON.stringify({ app: selectedApp }));
    searchParams.append("count", count.toString());
    searchParams.append("select", "-_metadata,-allowedFileTypes,-port,-__v,-users");
    searchParams.append("sort", "_id");
    return searchParams;
}
function backupManager(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Backup configurations");
        selectedApp = yield (0, lib_cli_1.selectApp)(apps);
        (0, lib_db_1.backupInit)();
        (0, lib_misc_1.printInfo)("Scanning the configurations within the app...");
        if (global.dataStack.authData.isSuperAdmin) {
            yield fetchMapperFormulas();
            yield fetchPlugins();
            yield fetchNPMLibraries();
        }
        yield fetchDataServices();
        yield fetchLibrary();
        yield fetchFunctions();
        yield fetchConnectors();
        yield fetchDataFormats();
        yield fetchAgents();
        yield fetchDataPipes();
        yield fetchGroups();
        yield customiseBackup();
        (0, lib_misc_1.header)("Backup complete!");
    });
}
exports.backupManager = backupManager;
function fetchMapperFormulas() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_COUNT = "/api/a/rbac/admin/metadata/mapper/formula/count";
        const URL_DATA = "/api/a/rbac/admin/metadata/mapper/formula";
        const mapperFormulaCount = yield (0, manager_api_1.get)(URL_COUNT, new URLSearchParams());
        const searchParams = new URLSearchParams();
        searchParams.append("count", mapperFormulaCount);
        const mapperFormulas = yield (0, manager_api_1.get)(URL_DATA, searchParams);
        (0, lib_db_1.save)("mapperformula", mapperFormulas);
        mapperFormulas.forEach((mf) => {
            (0, lib_db_1.backupMapper)("mapperformula", mf._id, mf.name);
            (0, lib_db_1.backupMapper)("mapperformula_lookup", mf.name, mf._id);
        });
        (0, lib_misc_1.printDone)("Mapper Formulas(!)", mapperFormulaCount);
    });
}
function fetchPlugins() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_COUNT = "/api/a/bm/admin/node/utils/count";
        const URL_DATA = "/api/a/bm/admin/node";
        const pluginCount = yield (0, manager_api_1.get)(URL_COUNT, new URLSearchParams());
        const searchParams = new URLSearchParams();
        searchParams.append("count", pluginCount);
        const plugins = yield (0, manager_api_1.get)(URL_DATA, searchParams);
        (0, lib_db_1.save)("plugin", plugins);
        plugins.forEach((plugin) => {
            (0, lib_db_1.backupMapper)("plugin", plugin._id, plugin.name);
            (0, lib_db_1.backupMapper)("plugin_lookup", plugin.name, plugin._id);
        });
        (0, lib_misc_1.printDone)("Plugins(!)", pluginCount);
    });
}
function fetchNPMLibraries() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_DATA = "/api/a/bm/admin/flow/utils/node-library";
        const npmLibraries = yield (0, manager_api_1.get)(URL_DATA, new URLSearchParams());
        (0, lib_db_1.save)("npmlibrary", npmLibraries);
        npmLibraries.forEach((lib) => {
            (0, lib_db_1.backupMapper)("npmlibrary", lib._id, lib.name);
            (0, lib_db_1.backupMapper)("npmlibrary_lookup", lib.name, lib._id);
        });
        (0, lib_misc_1.printDone)("NPM Library(!)", npmLibraries.length);
    });
}
function fetchDataServices() {
    return __awaiter(this, void 0, void 0, function* () {
        var URL_COUNT = `/api/a/sm/${selectedApp}/service/utils/count`;
        var URL_DATA = `/api/a/sm/${selectedApp}/service`;
        const dataservicesCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        let dataservices = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(dataservicesCount));
        (0, lib_db_1.save)("dataservice", dataservices);
        dataservices.forEach((ds) => {
            (0, lib_db_1.backupMapper)("dataservice", ds._id, ds.name);
            (0, lib_db_1.backupMapper)("dataservice_lookup", ds.name, ds._id);
        });
        (0, lib_db_1.backupDependencyMatrixOfDataService)((0, lib_parser_ds_1.buildDependencyMatrixForDataServices)(dataservices));
        (0, lib_misc_1.printDone)("Data services", dataservicesCount);
    });
}
function fetchLibrary() {
    return __awaiter(this, void 0, void 0, function* () {
        var URL_COUNT = `/api/a/sm/${selectedApp}/globalSchema/utils/count`;
        var URL_DATA = `/api/a/sm/${selectedApp}/globalSchema`;
        const librariesCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        let libraries = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(librariesCount));
        (0, lib_db_1.save)("library", libraries);
        libraries.forEach((library) => {
            library.services = [];
            (0, lib_db_1.backupMapper)("library", library._id, library.name);
            (0, lib_db_1.backupMapper)("library_lookup", library.name, library._id);
        });
        (0, lib_misc_1.printDone)("Libraries", librariesCount);
    });
}
function fetchFunctions() {
    return __awaiter(this, void 0, void 0, function* () {
        let URL_COUNT = `/api/a/bm/${selectedApp}/faas/utils/count`;
        let URL_DATA = `/api/a/bm/${selectedApp}/faas`;
        let functionsCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        let functions = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(functionsCount));
        (0, lib_db_1.save)("function", functions);
        functions.forEach((fn) => {
            fn.services = [];
            (0, lib_db_1.backupMapper)("function", fn._id, fn.name);
            (0, lib_db_1.backupMapper)("function_lookup", fn.name, fn._id);
        });
        (0, lib_misc_1.printDone)("Functions", functionsCount);
    });
}
function fetchConnectors() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_DATA = `/api/a/rbac/${selectedApp}/connector`;
        const URL_COUNT = `/api/a/rbac/${selectedApp}/connector/utils/count`;
        const connectorsCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        const connectors = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(connectorsCount));
        (0, lib_db_1.save)("connectors", connectors);
        connectors.forEach((connector) => {
            (0, lib_db_1.backupMapper)("connectors", connector._id, connector.name);
            (0, lib_db_1.backupMapper)("connectors_lookup", connector.name, connector._id);
        });
        (0, lib_misc_1.printDone)("Connectors", connectorsCount);
    });
}
function fetchDataFormats() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_DATA = `/api/a/bm/${selectedApp}/dataFormat`;
        const URL_COUNT = `/api/a/bm/${selectedApp}/dataFormat`;
        let searchParams = getURLParamsForCount();
        searchParams.append("countOnly", "true");
        const dataFormatsCount = yield (0, manager_api_1.get)(URL_COUNT, searchParams);
        const dataFormats = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(dataFormatsCount));
        (0, lib_db_1.save)("dataformats", dataFormats);
        dataFormats.forEach((dataFormat) => {
            (0, lib_db_1.backupMapper)("dataformats", dataFormat._id, dataFormat.name);
            (0, lib_db_1.backupMapper)("dataformats_lookup", dataFormat.name, dataFormat._id);
        });
        (0, lib_misc_1.printDone)("Data Formats", dataFormatsCount);
    });
}
function fetchAgents() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_DATA = `/api/a/bm/${selectedApp}/agent`;
        const URL_COUNT = `/api/a/bm/${selectedApp}/agent/utils/count`;
        const agentsCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        const agents = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(agentsCount));
        (0, lib_db_1.save)("agents", agents);
        agents.forEach((agent) => {
            (0, lib_db_1.backupMapper)("agents", agent._id, agent.name);
            (0, lib_db_1.backupMapper)("agents_lookup", agent.name, agent._id);
        });
        (0, lib_misc_1.printDone)("Agents", agentsCount);
    });
}
function fetchDataPipes() {
    return __awaiter(this, void 0, void 0, function* () {
        const URL_DATA = `/api/a/bm/${selectedApp}/flow`;
        const URL_COUNT = `/api/a/bm/${selectedApp}/flow/utils/count`;
        const dataPipesCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        const dataPipes = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(dataPipesCount));
        (0, lib_db_1.save)("datapipes", dataPipes);
        dataPipes.forEach((dataPipe) => {
            (0, lib_db_1.backupMapper)("datapipes", dataPipe._id, dataPipe.name);
            (0, lib_db_1.backupMapper)("datapipes_lookup", dataPipe.name, dataPipe._id);
        });
        (0, lib_db_1.backupDependencyMatrixOfDataPipe)((0, lib_parser_pipe_1.buildDependencyMatrixForDataPipe)(dataPipes));
        (0, lib_misc_1.printDone)("Data Pipes", dataPipesCount);
    });
}
function fetchGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        let URL_COUNT = `/api/a/rbac/${selectedApp}/group/count`;
        let URL_DATA = `/api/a/rbac/${selectedApp}/group`;
        const groupsCount = yield (0, manager_api_1.get)(URL_COUNT, getURLParamsForCount());
        let groups = yield (0, manager_api_1.get)(URL_DATA, getURLParamsForData(groupsCount));
        groups = groups.filter((group) => group.name != "#");
        (0, lib_db_1.save)("group", groups);
        groups.forEach((group) => {
            (0, lib_db_1.backupMapper)("group", group._id, group.name);
            (0, lib_db_1.backupMapper)("group_lookup", group.name, group._id);
        });
        (0, lib_misc_1.printDone)("Groups", groups.length);
    });
}
function customiseBackup() {
    return __awaiter(this, void 0, void 0, function* () {
        let customisationRequired = yield (0, lib_cli_1.customise)();
        if (!customisationRequired) {
            (0, lib_misc_1.printInfo)("No backup customizations done.");
            return;
        }
        (0, lib_misc_1.header)("Customizing the backup");
        let dataserviceLookup = (0, lib_db_1.readBackupMap)("dataservice_lookup");
        let selectedDataservices = [];
        (yield (0, lib_cli_1.selections)("dataservices", Object.keys(dataserviceLookup))).forEach((ds) => selectedDataservices.push(dataserviceLookup[ds]));
        let libraryLookup = (0, lib_db_1.readBackupMap)("library_lookup");
        let selectedLibraries = [];
        (yield (0, lib_cli_1.selections)("libraries", Object.keys(libraryLookup))).forEach((lib) => selectedLibraries.push(libraryLookup[lib]));
        let functionLookup = (0, lib_db_1.readBackupMap)("function_lookup");
        let selectedFunctions = [];
        (yield (0, lib_cli_1.selections)("functions", Object.keys(functionLookup))).forEach((fn) => selectedFunctions.push(functionLookup[fn]));
        let groupLookup = (0, lib_db_1.readBackupMap)("group_lookup");
        let selectedGroups = [];
        (yield (0, lib_cli_1.selections)("groups", Object.keys(groupLookup))).forEach((group) => selectedGroups.push(groupLookup[group]));
        logger.info(`Dataservices : ${selectedDataservices.join(", ") || "Nil"}`);
        logger.info(`Libraries    : ${selectedLibraries.join(", ") || "Nil"}`);
        logger.info(`Functions    : ${selectedFunctions.join(", ") || "Nil"}`);
        logger.info(`Groups       : ${selectedGroups.join(", ") || "Nil"}`);
        let dependencyMatrix = (0, lib_db_1.readDependencyMatrixofDataService)();
        let superSetOfDataservices = selectedDataservices;
        selectedDataservices.forEach((dataserviceID) => {
            selectAllRelated(dataserviceID, dependencyMatrix)
                .filter(ds => superSetOfDataservices.indexOf(ds) == -1)
                .forEach(ds => superSetOfDataservices.push(ds));
            dependencyMatrix[dataserviceID].libraries.forEach((library) => {
                if (selectedLibraries.indexOf(library) == -1)
                    selectedLibraries.push(library);
            });
            dependencyMatrix[dataserviceID].functions.forEach((fn) => {
                if (selectedFunctions.indexOf(fn) == -1)
                    selectedFunctions.push(fn);
            });
        });
        logger.info(`Superset Dataservices : ${superSetOfDataservices.join(", ")}`);
        logger.info(`Superset Libraries    : ${selectedLibraries.join(", ")}`);
        logger.info(`Superset Functions    : ${selectedFunctions.join(", ")}`);
        let dataservices = (0, lib_db_1.read)("dataservice").filter((dataservice) => superSetOfDataservices.indexOf(dataservice._id) != -1);
        let libraries = (0, lib_db_1.read)("library").filter((library) => selectedLibraries.indexOf(library._id) != -1);
        let functions = (0, lib_db_1.read)("function").filter((fn) => selectedFunctions.indexOf(fn._id) != -1);
        let groups = (0, lib_db_1.read)("group").filter((group) => selectedGroups.indexOf(group._id) != -1);
        (0, lib_db_1.save)("dataservice", dataservices);
        (0, lib_db_1.save)("library", libraries);
        (0, lib_db_1.save)("function", functions);
        (0, lib_db_1.save)("group", groups);
    });
}
function selectAllRelated(dataserviceID, dependencyMatrix) {
    let requiredDS = [];
    dependencyMatrix[dataserviceID].dataservices.forEach((ds) => {
        if (dataserviceID == ds)
            return;
        if (requiredDS.indexOf(ds) == -1) {
            requiredDS.push(ds);
            selectAllRelated(ds, dependencyMatrix)
                .filter(ds => requiredDS.indexOf(ds) == -1)
                .forEach(ds => requiredDS.push(ds));
        }
    });
    return requiredDS;
}
