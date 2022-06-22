import { selectApp } from "./lib.cli";
import { header, printDone, printInfo } from "./lib.misc";
import { get } from "./manager.api";
import { backupInit, backupMapper, save } from "./lib.db";

// let logger = global.logger;

let searchParams = new URLSearchParams();

export async function backupManager(apps: any) {
	header("Backup configurations");
	let selectedApp = await selectApp(apps);

	searchParams.append("filter", JSON.stringify({ app: selectedApp }));
	searchParams.append("count", "-1");
	searchParams.append("select", "-_metadata,-allowedFileTypes,-port,-__v,-users");

	backupInit();
	printInfo("Scanning the configurations within the app...");

	await fetchDataServices(selectedApp);
	await fetchLibrary(selectedApp);
	await fetchGroups(selectedApp);
	header("Backup complete!");
}

async function fetchDataServices(selectedApp: string) {
	var URL = `/api/a/sm/${selectedApp}/service`;
	let dataServices = await get(URL, searchParams);
	save("dataservice", dataServices);
	dataServices.forEach((ds: any) => {
		backupMapper("dataservice", ds._id, ds.name);
		backupMapper("dataservice_lookup", ds.name, ds._id);
	});
	printDone("Data services", dataServices.length);
}

async function fetchLibrary(selectedApp: string) {
	let URL = `/api/a/sm/${selectedApp}/globalSchema`;
	let libraries = await get(URL, searchParams);
	save("library", libraries);
	libraries.forEach((library: any) => {
		library.services = [];
		backupMapper("library", library._id, library.name);
		backupMapper("library_lookup", library.name, library._id);
	});
	printDone("Libraries", libraries.length);
}

async function fetchGroups(selectedApp: string) {
	let URL = `/api/a/rbac/${selectedApp}/group`;
	let groups = await get(URL, searchParams);
	groups = groups.filter((group: any) => group.name != "#");
	save("group", groups);
	printDone("Groups", groups.length);
}