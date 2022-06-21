import { selectApp } from "./lib.cli";
import { header, printInfo } from "./lib.misc";
import { del, get } from "./manager.api";

let searchParams = new URLSearchParams();

export async function clearAllManager(apps: any) {
	header("Clear all configurations");
	let selectedApp = await selectApp(apps);

	searchParams.append("filter", JSON.stringify({ app: selectedApp }));
	searchParams.append("count", "-1");
	searchParams.append("select", "name");

	printInfo("Scanning the configurations within the app...");

	await clearGroups(selectedApp);
	await clearDataServices(selectedApp);
	await clearLibrary(selectedApp);
	printInfo("Cleanup complete!");
}

async function clearGroups(selectedApp: string) {
	header("Group");
	let BASE_URL = `/api/a/rbac/${selectedApp}/group`;
	let groups = await get(BASE_URL, searchParams);
	printInfo(`${groups.length - 1} Group(s) found.`);
	await groups.reduce(async (p: any, group: any) => {
		await p;
		if (group.name == "#") return Promise.resolve();
		printInfo(`  * Removing group ${group._id} ${group.name}`);
		let GROUP_URL = `${BASE_URL}/${group._id}`;
		await del(GROUP_URL);
	}, Promise.resolve());
}

async function clearDataServices(selectedApp: string) {
	header("Dataservice");
	var BASE_URL = `/api/a/sm/${selectedApp}/service`;
	let dataservices = await get(BASE_URL, searchParams);
	printInfo(`${dataservices.length} Dataservice(s) found.`);
	await dataservices.reduce(async (p: any, dataservice: any) => {
		await p;
		printInfo(`  * Removing dataservice ${dataservice._id} ${dataservice.name}`);
		let DS_URL = `${BASE_URL}/${dataservice._id}`;
		await del(DS_URL);
	}, Promise.resolve());
}

async function clearLibrary(selectedApp: string) {
	header("Library");
	let BASE_URL = `/api/a/sm/${selectedApp}/globalSchema`;
	let libraries = await get(BASE_URL, searchParams);
	printInfo(`${libraries.length} Library(-ies) found.`);
	await libraries.reduce(async (p: any, library: any) => {
		await p;
		printInfo(`  * Removing library ${library._id} ${library.name}`);
		let LIB_URL = `${BASE_URL}/${library._id}`;
		await del(LIB_URL);
	}, Promise.resolve());
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