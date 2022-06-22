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
let searchParams = new URLSearchParams();
function clearAllManager(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Clear all configurations");
        let selectedApp = yield (0, lib_cli_1.selectApp)(apps);
        searchParams.append("filter", JSON.stringify({ app: selectedApp }));
        searchParams.append("count", "-1");
        searchParams.append("select", "name");
        (0, lib_misc_1.printInfo)("Scanning the configurations within the app...");
        yield clearGroups(selectedApp);
        yield clearDataServices(selectedApp);
        yield clearLibrary(selectedApp);
        (0, lib_misc_1.header)("Cleanup complete!");
    });
}
exports.clearAllManager = clearAllManager;
function clearGroups(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Group");
        let BASE_URL = `/api/a/rbac/${selectedApp}/group`;
        let groups = yield (0, manager_api_1.get)(BASE_URL, searchParams);
        (0, lib_misc_1.printInfo)(`${groups.length - 1} Group(s) found.`);
        yield groups.reduce((p, group) => __awaiter(this, void 0, void 0, function* () {
            yield p;
            if (group.name == "#")
                return Promise.resolve();
            (0, lib_misc_1.printInfo)(`  * Removing group ${group._id} ${group.name}`);
            let GROUP_URL = `${BASE_URL}/${group._id}`;
            yield (0, manager_api_1.del)(GROUP_URL);
        }), Promise.resolve());
    });
}
function clearDataServices(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Dataservice");
        var BASE_URL = `/api/a/sm/${selectedApp}/service`;
        let dataservices = yield (0, manager_api_1.get)(BASE_URL, searchParams);
        (0, lib_misc_1.printInfo)(`${dataservices.length} Dataservice(s) found.`);
        yield dataservices.reduce((p, dataservice) => __awaiter(this, void 0, void 0, function* () {
            yield p;
            (0, lib_misc_1.printInfo)(`  * Removing dataservice ${dataservice._id} ${dataservice.name}`);
            let DS_URL = `${BASE_URL}/${dataservice._id}`;
            yield (0, manager_api_1.del)(DS_URL);
        }), Promise.resolve());
    });
}
function clearLibrary(selectedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, lib_misc_1.header)("Library");
        let BASE_URL = `/api/a/sm/${selectedApp}/globalSchema`;
        let libraries = yield (0, manager_api_1.get)(BASE_URL, searchParams);
        (0, lib_misc_1.printInfo)(`${libraries.length} Library(-ies) found.`);
        yield libraries.reduce((p, library) => __awaiter(this, void 0, void 0, function* () {
            yield p;
            (0, lib_misc_1.printInfo)(`  * Removing library ${library._id} ${library.name}`);
            let LIB_URL = `${BASE_URL}/${library._id}`;
            yield (0, manager_api_1.del)(LIB_URL);
        }), Promise.resolve());
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
