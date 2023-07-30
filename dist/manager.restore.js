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
exports.restoreManager = void 0;
const lib_cli_1 = require("./lib.cli");
const lib_misc_1 = require("./lib.misc");
const manager_api_1 = require("./manager.api");
const lib_db_1 = require("./lib.db");
const lib_parser_ds_1 = require("./lib.parser.ds");
let logger = global.logger;
function restoreManager(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Restore configuration");
        let selectedApp = yield (0, lib_cli_1.selectApp)(apps);
        (0, lib_misc_1.printInfo)(`Backup file being used - ${global.backupFileName}`);
        (0, lib_db_1.restoreInit)();
        (0, lib_misc_1.printInfo)("Scanning the configurations...");
        yield restoreLibrary(selectedApp);
        yield restoreFunctions(selectedApp);
        yield restoreDataServices(selectedApp);
        yield restoreGroups(selectedApp);
        (0, lib_misc_1.header)("Restore complete!");
    });
}
exports.restoreManager = restoreManager;
function configExists(api, name, selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let searchParams = new URLSearchParams();
        searchParams.append("filter", JSON.stringify({ app: selectedApp, name: name }));
        searchParams.append("count", "-1");
        searchParams.append("select", "name");
        logger.debug(`Check for existing config - ${api} ${searchParams}`);
        let data = yield (0, manager_api_1.get)(api, searchParams);
        logger.debug(`Check for existing config result - ${api} : ${JSON.stringify(data)}`);
        if (data.length > 0 && data[0]._id)
            return data[0]._id;
        return null;
    });
}
function insert(type, baseURL, selectedApp, backedUpData) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`${selectedApp} : Insert ${type} : ${backedUpData.name}`);
        let data = JSON.parse(JSON.stringify(backedUpData));
        data.app = selectedApp;
        delete data._id;
        let newData = yield (0, manager_api_1.post)(baseURL, data);
        (0, lib_misc_1.printInfo)(`${type} created : ${backedUpData.name}`);
        logger.info(JSON.stringify(newData));
        return newData;
    });
}
function update(type, baseURL, selectedApp, backedUpData, existinID) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`${selectedApp} : Update ${type} : ${backedUpData.name}`);
        let data = JSON.parse(JSON.stringify(backedUpData));
        data.app = selectedApp;
        data._id = existinID;
        delete data.status;
        let updateURL = `${baseURL}/${existinID}`;
        let newData = yield (0, manager_api_1.put)(updateURL, data);
        (0, lib_misc_1.printInfo)(`${type} updated : ${backedUpData.name}`);
        logger.info(JSON.stringify(newData));
        return newData;
    });
}
function restoreLibrary(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let libraries = (0, lib_db_1.read)("library");
        if (libraries.length < 1)
            return;
        (0, lib_misc_1.header)("Library");
        (0, lib_misc_1.printInfo)(`Libraries to restore - ${libraries.length}`);
        let BASE_URL = `/api/a/sm/${selectedApp}/globalSchema`;
        yield libraries.reduce((prev, library) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            delete library.services;
            let existingID = yield configExists(BASE_URL, library.name, selectedApp);
            let newData = null;
            if (existingID)
                newData = yield update("Library", BASE_URL, selectedApp, library, existingID);
            else
                newData = yield insert("Library", BASE_URL, selectedApp, library);
            (0, lib_db_1.restoreMapper)("library", library._id, newData._id);
        }), Promise.resolve());
    });
}
function restoreDataServices(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataservices = (0, lib_db_1.read)("dataservice");
        if (dataservices.length < 1)
            return;
        (0, lib_misc_1.header)("Dataservice");
        (0, lib_misc_1.printInfo)(`Dataservices to restore - ${dataservices.length}`);
        var BASE_URL = `/api/a/sm/${selectedApp}/service`;
        // Find which data services exists and which doesn't
        let newDataServices = [];
        yield dataservices.reduce((prev, dataservice) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            let existingID = yield configExists(BASE_URL, dataservice.name, selectedApp);
            if (existingID)
                return (0, lib_db_1.restoreMapper)("dataservice", dataservice._id, existingID);
            newDataServices.push(dataservice._id);
        }), Promise.resolve());
        // Create new data services
        logger.info(`New dataservices - ${newDataServices.join(", ")}`);
        (0, lib_misc_1.printInfo)(`New dataservices to be created - ${newDataServices.length}`);
        yield dataservices.reduce((prev, dataservice) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            if (newDataServices.indexOf(dataservice._id) == -1)
                return;
            let newDS = (0, lib_parser_ds_1.generateSampleDataSerivce)(dataservice.name, selectedApp);
            let newData = yield insert("Dataservice", BASE_URL, selectedApp, newDS);
            return (0, lib_db_1.restoreMapper)("dataservice", dataservice._id, newData._id);
        }), Promise.resolve());
        dataservices = (0, lib_parser_ds_1.parseAndFixDataServices)(selectedApp, dataservices);
        let dataserviceMap = (0, lib_db_1.readRestoreMap)("dataservice");
        yield dataservices.reduce((prev, dataservice) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            if (newDataServices.indexOf(dataservice._id) != -1)
                dataservice.status = "Draft";
            return yield update("Dataservice", BASE_URL, selectedApp, dataservice, dataserviceMap[dataservice._id]);
        }), Promise.resolve());
    });
}
function restoreFunctions(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let functions = (0, lib_db_1.read)("function");
        if (functions.length < 1)
            return;
        (0, lib_misc_1.header)("Functions");
        (0, lib_misc_1.printInfo)(`Functions to restore - ${functions.length}`);
        let BASE_URL = `/api/a/bm/${selectedApp}/faas`;
        yield functions.reduce((prev, fn) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            delete fn._metadata;
            delete fn.__v;
            delete fn.version;
            let existingID = yield configExists(BASE_URL, fn.name, selectedApp);
            let newData = null;
            if (existingID)
                newData = yield update("Function", BASE_URL, selectedApp, fn, existingID);
            else
                newData = yield insert("Function", BASE_URL, selectedApp, fn);
            (0, lib_db_1.restoreMapper)("function", fn._id, newData._id);
            (0, lib_db_1.restoreMapper)("functionURL", newData._id, newData.url);
        }), Promise.resolve());
    });
}
function restoreGroups(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let groups = (0, lib_db_1.read)("group");
        if (groups.length < 1)
            return;
        (0, lib_misc_1.header)("Group");
        (0, lib_misc_1.printInfo)(`Groups to restore - ${groups.length}`);
        let BASE_URL = `/api/a/rbac/${selectedApp}/group`;
        let dataServiceIDMap = (0, lib_db_1.readRestoreMap)("dataservice");
        yield groups.reduce((prev, group) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            group.roles.forEach((role) => {
                role.app = selectedApp;
                if (dataServiceIDMap[role.entity])
                    role.entity = dataServiceIDMap[role.entity];
                if (role._id == "ADMIN_role.entity")
                    role._id = `ADMIN_${dataServiceIDMap[role.entity]}`;
            });
            let existingID = yield configExists(BASE_URL, group.name, selectedApp);
            let newData = null;
            if (existingID)
                newData = yield update("Group", BASE_URL, selectedApp, group, existingID);
            else
                newData = yield insert("Group", BASE_URL, selectedApp, group);
            (0, lib_db_1.restoreMapper)("group", group._id, newData._id);
        }), Promise.resolve());
    });
}
