import { selectApp } from "./lib.cli";
import { header, printInfo } from "./lib.misc";
import { get, post, put } from "./manager.api";
import { read, readRestoreMap, restoreInit, restoreMapper } from "./lib.db";
import { generateSampleDataSerivce, parseAndFixDataServices } from "./lib.dsParser";

let logger = global.logger;

export async function restoreManager(apps: any) {
	header("Restore configuration");
	let selectedApp = await selectApp(apps);

	printInfo(`Backup file being used - ${global.backupFileName}`);

	restoreInit();

	printInfo("Scanning the configurations...");

	await restoreLibrary(selectedApp);
	await restoreDataServices(selectedApp);
	await restoreFunctions(selectedApp);
	await restoreGroups(selectedApp);
	header("Restore complete!");
}

async function configExists(api: string, name: string, selectedApp: string): Promise<string | null> {
	let searchParams = new URLSearchParams();
	searchParams.append("filter", JSON.stringify({ app: selectedApp, name: name }));
	searchParams.append("count", "-1");
	searchParams.append("select", "name");
	logger.debug(`Check for existing config - ${api} ${searchParams}`);
	let data = await get(api, searchParams);
	logger.debug(`Check for existing config result - ${api} : ${JSON.stringify(data)}`);
	if (data.length > 0 && data[0]._id) return data[0]._id;
	return null;
}

async function insert(type: string, baseURL: string, selectedApp: string, backedUpData: any): Promise<any> {
	logger.info(`${selectedApp} : Insert ${type} : ${backedUpData.name}`);
	let data = JSON.parse(JSON.stringify(backedUpData));
	data.app = selectedApp;
	delete data._id;
	data.status = "Undeployed";
	let newData = await post(baseURL, data);
	printInfo(`${type} created : ${backedUpData.name}`);
	logger.info(JSON.stringify(newData));
	return newData;
}

async function update(type: string, baseURL: string, selectedApp: string, backedUpData: any, existinID: string): Promise<any> {
	logger.info(`${selectedApp} : Update ${type} : ${backedUpData.name}`);
	let data = JSON.parse(JSON.stringify(backedUpData));
	data.app = selectedApp;
	data._id = existinID;
	delete data.status;
	let updateURL = `${baseURL}/${existinID}`;
	let newData = await put(updateURL, data);
	printInfo(`${type} updated : ${backedUpData.name}`);
	logger.info(JSON.stringify(newData));
	return newData;
}

async function restoreLibrary(selectedApp: string) {
	let libraries = read("library");
	if (libraries.length < 1) return;
	header("Library");
	printInfo(`Libraries to restore - ${libraries.length}`);
	let BASE_URL = `/api/a/sm/${selectedApp}/globalSchema`;
	await libraries.reduce(async (prev: any, library: any) => {
		await prev;
		delete library.services;
		let existingID = await configExists(BASE_URL, library.name, selectedApp);
		let newData = null;
		if (existingID) newData = await update("Library", BASE_URL, selectedApp, library, existingID);
		else newData = await insert("Library", BASE_URL, selectedApp, library);
		restoreMapper("library", library._id, newData._id);
	}, Promise.resolve());
}

async function restoreDataServices(selectedApp: string) {
	let dataservices = read("dataservice");
	if (dataservices.length < 1) return;

	header("Dataservice");
	printInfo(`Dataservices to restore - ${dataservices.length}`);

	var BASE_URL = `/api/a/sm/${selectedApp}/service`;
	// Find which data services exists and which doesn't
	let newDataServices: string[] = [];
	await dataservices.reduce(async (prev: any, dataservice: any) => {
		await prev;
		let existingID = await configExists(BASE_URL, dataservice.name, selectedApp);
		if (existingID) return restoreMapper("dataservice", dataservice._id, existingID);
		newDataServices.push(dataservice._id);
	}, Promise.resolve());

	// Create new data services
	logger.info(`New dataservices - ${newDataServices.join(", ")}`);
	printInfo(`New dataservices to be created - ${newDataServices.length}`);
	await dataservices.reduce(async (prev: any, dataservice: any) => {
		await prev;
		if (newDataServices.indexOf(dataservice._id) == -1) return;
		let newDS = generateSampleDataSerivce(dataservice.name, selectedApp);
		let newData = await insert("Dataservice", BASE_URL, selectedApp, newDS);
		return restoreMapper("dataservice", dataservice._id, newData._id);
	}, Promise.resolve());

	dataservices = parseAndFixDataServices(dataservices);
	let dataserviceMap = readRestoreMap("dataservice");

	await dataservices.reduce(async (prev: any, dataservice: any) => {
		await prev;
		return await update("Dataservice", BASE_URL, selectedApp, dataservice, dataserviceMap[dataservice._id]);
	}, Promise.resolve());
}

async function restoreFunctions(selectedApp: string) {
	let functions = read("function");
	if (functions.length < 1) return;
	header("Functions");
	printInfo(`Functions to restore - ${functions.length}`);
	let BASE_URL = `/api/a/bm/${selectedApp}/faas`;
	await functions.reduce(async (prev: any, fn: any) => {
		await prev;
		delete fn._metadata;
		delete fn.__v;
		delete fn.version;
		let existingID = await configExists(BASE_URL, fn.name, selectedApp);
		let newData = null;
		if (existingID) newData = await update("Library", BASE_URL, selectedApp, fn, existingID);
		else newData = await insert("Library", BASE_URL, selectedApp, fn);
		restoreMapper("function", fn._id, newData._id);
	}, Promise.resolve());
}

async function restoreGroups(selectedApp: string) {
	let groups = read("group");
	if (groups.length < 1) return;
	header("Group");
	printInfo(`Groups to restore - ${groups.length}`);
	let BASE_URL = `/api/a/rbac/${selectedApp}/group`;
	let dataServiceIDMap = readRestoreMap("dataservice");
	await groups.reduce(async (prev: any, group: any) => {
		await prev;

		group.roles.forEach((role: any) => {
			role.app = selectedApp;
			if (dataServiceIDMap[role.entity]) role.entity = dataServiceIDMap[role.entity];
			if (role._id == "ADMIN_role.entity") role._id = `ADMIN_${dataServiceIDMap[role.entity]}`;
		});

		let existingID = await configExists(BASE_URL, group.name, selectedApp);
		let newData = null;
		if (existingID) newData = await update("Group", BASE_URL, selectedApp, group, existingID);
		else newData = await insert("Group", BASE_URL, selectedApp, group);
		restoreMapper("group", group._id, newData._id);
	}, Promise.resolve());
}
