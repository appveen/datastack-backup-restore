import { selectApp } from "./lib.cli";
import { header, printInfo } from "./lib.misc";
import { del, get } from "./manager.api";

let searchParams = new URLSearchParams();
let logger = global.logger;

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
	await clearFunctions(selectedApp);
	header("Cleanup complete!");
}

async function clearGroups(selectedApp: string) {
	try {
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
	} catch (e: any) {
		logger.error(e.message);
	}
}

async function clearDataServices(selectedApp: string) {
	try {
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
	} catch (e: any) {
		logger.error(e.message);
	}
}

async function clearLibrary(selectedApp: string) {
	try {
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
	} catch (e: any) {
		logger.error(e.message);
	}
}

async function clearFunctions(selectedApp: string) {
	try {
		header("Function");
		let BASE_URL = `/api/a/bm/${selectedApp}/faas`;
		let functions = await get(BASE_URL, searchParams);
		printInfo(`${functions.length} Function(s) found.`);
		await functions.reduce(async (p: any, fn: any) => {
			await p;
			printInfo(`  * Removing function ${fn._id} ${fn.name}`);
			let FN_URL = `${BASE_URL}/${fn._id}`;
			await del(FN_URL);
		}, Promise.resolve());
	} catch (e: any) {
		logger.error(e.message);
	}
}