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
// let logger = global.logger;
let searchParams = new URLSearchParams();
function backupManager(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Backup configurations");
        let selectedApp = yield (0, lib_cli_1.selectApp)(apps);
        searchParams.append("filter", JSON.stringify({ app: selectedApp }));
        searchParams.append("count", "-1");
        searchParams.append("select", "-_metadata,-allowedFileTypes,-port,-__v,-users");
        (0, lib_db_1.backupInit)();
        (0, lib_misc_1.printInfo)("Scanning the configurations within the app...");
        yield fetchDataServices(selectedApp);
        yield fetchLibrary(selectedApp);
        yield fetchGroups(selectedApp);
        (0, lib_misc_1.header)("Backup complete!");
    });
}
exports.backupManager = backupManager;
function fetchDataServices(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        var URL = `/api/a/sm/${selectedApp}/service`;
        let dataServices = yield (0, manager_api_1.get)(URL, searchParams);
        (0, lib_db_1.save)("dataservice", dataServices);
        dataServices.forEach((ds) => {
            (0, lib_db_1.backupMapper)("dataservice", ds._id, ds.name);
            (0, lib_db_1.backupMapper)("dataservice_lookup", ds.name, ds._id);
        });
        (0, lib_misc_1.printDone)("Data services", dataServices.length);
    });
}
function fetchLibrary(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let URL = `/api/a/sm/${selectedApp}/globalSchema`;
        let libraries = yield (0, manager_api_1.get)(URL, searchParams);
        (0, lib_db_1.save)("library", libraries);
        libraries.forEach((library) => {
            library.services = [];
            (0, lib_db_1.backupMapper)("library", library._id, library.name);
            (0, lib_db_1.backupMapper)("library_lookup", library.name, library._id);
        });
        (0, lib_misc_1.printDone)("Libraries", libraries.length);
    });
}
function fetchGroups(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let URL = `/api/a/rbac/${selectedApp}/group`;
        let groups = yield (0, manager_api_1.get)(URL, searchParams);
        groups = groups.filter((group) => group.name != "#");
        (0, lib_db_1.save)("group", groups);
        (0, lib_misc_1.printDone)("Groups", groups.length);
    });
}
