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
exports.clearAllManager = void 0;
const lib_cli_1 = require("./lib.cli");
const lib_misc_1 = require("./lib.misc");
const manager_api_1 = require("./manager.api");
const lib_db_1 = require("./lib.db");
function clearAllManager(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedApp = yield (0, lib_cli_1.selectApp)(apps);
        (0, lib_misc_1.printInfo)('Scanning the configurations within the app...');
        yield clearGroups(selectedApp);
        // await fetchDataServices(selectedApp);
        // await fetchLibrary(selectedApp);
        (0, lib_misc_1.printInfo)('Backup complete!');
    });
}
exports.clearAllManager = clearAllManager;
function clearGroups(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let URL = `/api/a/rbac/${selectedApp}/group`;
        let searchParams = new URLSearchParams();
        searchParams.append('count', '-1');
        searchParams.append('select', 'name');
        let groups = yield (0, manager_api_1.get)(URL, searchParams);
        groups = groups.filter(group => group.name != '#');
        (0, lib_misc_1.printInfo)(`${groups.length - 1} Group(s) found.`);
        yield groups.reduce((p, group) => __awaiter(this, void 0, void 0, function* () {
            (0, lib_misc_1.printInfo)(`  Removing group ${group._id} ${group.name}`);
        }), Promise.resolve());
    });
}
function fetchDataServices(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        var URL = `/api/a/sm/${selectedApp}/service`;
        let searchParams = new URLSearchParams();
        searchParams.append('filter', JSON.stringify({ app: selectedApp }));
        searchParams.append('count', '-1');
        let dataServices = yield (0, manager_api_1.get)(URL, searchParams);
        (0, lib_db_1.save)('dataservices', dataServices);
        dataServices.forEach((ds) => (0, lib_db_1.backupMapper)('dataservice', ds._id, ds.name));
        dataServices.forEach((ds) => (0, lib_db_1.backupMapper)('dataservice_lookup', ds.name, ds._id));
        (0, lib_misc_1.printDone)('Data services', dataServices.length);
    });
}
function fetchLibrary(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        let URL = `/api/a/sm/${selectedApp}/globalSchema`;
        let searchParams = new URLSearchParams();
        searchParams.append('filter', JSON.stringify({ app: selectedApp }));
        searchParams.append('count', '-1');
        let libraries = yield (0, manager_api_1.get)(URL, searchParams);
        (0, lib_db_1.save)('library', libraries);
        libraries.forEach(library => library.services = []);
        libraries.forEach(library => (0, lib_db_1.backupMapper)('library', library._id, library.name));
        libraries.forEach(library => (0, lib_db_1.backupMapper)('library_lookup', library.name, library._id));
        (0, lib_misc_1.printDone)('Libraries', libraries.length);
    });
}
// function fetchBookmarks() {
// 	var numberOfBookmarks = 0;
// 	var qs = {
// 			count: -1
// 	};
// 	return api.get(`/api/a/rbac/app/${selectedApp}/bookmark/count`, null)
// 			.then(_count => numberOfBookmarks = _count)
// 			.then(_ => api.get(`/api/a/rbac/app/${selectedApp}/bookmark`, qs))
// 			.then(_bookmarks => {
// 					backup.save("bookmarks", _bookmarks);
// 					_bookmarks.forEach(_d => backup.backupMapper("bookmarks", _d._id, _d.name));
// 			})
// 			.then(_ => misc.done("Bookmarks", numberOfBookmarks.toString()))
// };
