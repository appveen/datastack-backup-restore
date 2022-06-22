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
const lib_dsParser_1 = require("./lib.dsParser");
let logger = global.logger;
function restoreManager(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Restore configuration");
        let selectedApp = yield (0, lib_cli_1.selectApp)(apps);
        (0, lib_db_1.restoreInit)();
        (0, lib_misc_1.printInfo)(`Backup file being used - ${global.backupFileName}`);
        (0, lib_misc_1.printInfo)("Scanning the configurations...");
        yield restoreLibrary(selectedApp);
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
        logger.debug(`Config exists ${api} ${searchParams}`);
        let data = yield (0, manager_api_1.get)(api, searchParams);
        logger.debug(`Config exists ${api} : ${JSON.stringify(data)}`);
        if (data.length > 0 && data[0]._id)
            return { type: "", update: true, id: data[0]._id, data: {} };
        return { type: "", update: false, id: null, data: {} };
    });
}
function upsert(type, baseURL, selectedApp, backedUpData) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`${selectedApp} : Upsert ${type} : ${backedUpData._id}`);
        let data = JSON.parse(JSON.stringify(backedUpData));
        data.app = selectedApp;
        let upsertResult = yield configExists(baseURL, data.name, selectedApp);
        upsertResult.type = type;
        logger.info(upsertResult);
        if (upsertResult.update) {
            data._id = upsertResult.id;
            let resourceAPI = `${baseURL}/${data._id}`;
            upsertResult.data = yield (0, manager_api_1.put)(resourceAPI, data);
        }
        else {
            delete data._id;
            if (type == "Dataservice") {
                /*
                For restoring a new data services we have to do the following
                1. Create the ds first
                2. Get the ID from the new DS
                3. Fix the relationships
                4. Update it using the data that we want to restore.
                */
                let createResponse = yield (0, manager_api_1.post)(baseURL, (0, lib_dsParser_1.generateSampleDataSerivce)(data.name, selectedApp));
                data._id = createResponse._id;
                let resourceAPI = `${baseURL}/${data._id}`;
                upsertResult.data = yield (0, manager_api_1.put)(resourceAPI, data);
            }
            else {
                upsertResult.data = yield (0, manager_api_1.post)(baseURL, data);
            }
        }
        (0, lib_misc_1.printUpsert)(upsertResult);
        return upsertResult;
    });
}
function restoreLibrary(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Library");
        let libraries = (0, lib_db_1.read)("library");
        (0, lib_misc_1.printInfo)(`Libraries to restore - ${libraries.length}`);
        yield libraries.reduce((prev, library) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            delete library.services;
            let upsertResponse = yield upsert("Library", `/api/a/sm/${selectedApp}/globalSchema`, selectedApp, library);
            (0, lib_db_1.restoreMapper)("library", library._id, upsertResponse.data._id);
        }), Promise.resolve());
    });
}
function restoreDataServices(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Dataservice");
        var BASE_URL = `/api/a/sm/${selectedApp}/service`;
        let dataservices = (0, lib_db_1.read)("dataservice");
        (0, lib_misc_1.printInfo)(`Dataservices to restore - ${dataservices.length}`);
        dataservices = (0, lib_dsParser_1.parseAndFixDataServices)(dataservices);
        yield dataservices.reduce((prev, dataservice) => __awaiter(this, void 0, void 0, function* () {
            yield prev;
            let upsertResponse = yield upsert("Dataservice", BASE_URL, selectedApp, dataservice);
            (0, lib_db_1.restoreMapper)("dataservice", dataservice._id, upsertResponse.data._id);
        }), Promise.resolve());
    });
}
function restoreGroups(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Group");
        let BASE_URL = `/api/a/rbac/${selectedApp}/group`;
        let groups = (0, lib_db_1.read)("group");
        (0, lib_misc_1.printInfo)(`Groups to restore - ${groups.length}`);
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
            let upsertResponse = yield upsert("Group", BASE_URL, selectedApp, group);
            (0, lib_db_1.restoreMapper)("group", group._id, upsertResponse.data._id);
        }), Promise.resolve());
    });
}
