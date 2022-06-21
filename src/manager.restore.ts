import { selectApp } from "./lib.cli";
import { header, printInfo, printUpsert } from "./lib.misc";
import { get, post, put } from "./manager.api";
import { read, readRestoreMap, restoreInit, restoreMapper } from "./lib.db";
import { generateSampleDataSerivce, parseAndFixDataService } from "./lib.dsParser";

let logger = global.logger;

export async function restoreManager(apps: any) {
	header("Restore configuration");
	let selectedApp = await selectApp(apps);

	restoreInit();

	printInfo(`Backup file being used - ${global.backupFileName}`);

	printInfo("Scanning the configurations...");

	await restoreLibrary(selectedApp);
	await restoreDataServices(selectedApp);
	await restoreGroups(selectedApp);
	printInfo("Restore complete!");
}

async function configExists(api: string, name: string, selectedApp: string) {
	let searchParams = new URLSearchParams();
	searchParams.append("filter", JSON.stringify({ app: selectedApp, name: name }));
	searchParams.append("count", "-1");
	searchParams.append("select", "name");
	logger.debug(`Config exists ${api} ${searchParams}`);
	let data = await get(api, searchParams);
	logger.debug(`Config exists ${api} : ${JSON.stringify(data)}`);
	if (data.length > 0 && data[0]._id) return { type: "", update: true, id: data[0]._id, data: {} };
	return { type: "", update: false, id: null, data: {} };
}

async function upsert(type: string, baseURL: string, selectedApp: string, backedUpData: any) {
	logger.info(`${selectedApp} : Upsert ${type} : ${backedUpData._id}`);
	let data = JSON.parse(JSON.stringify(backedUpData));
	data.app = selectedApp;
	let upsertResult = await configExists(baseURL, data.name, selectedApp);
	upsertResult.type = type;
	logger.info(upsertResult);
	if (upsertResult.update) {
		data._id = upsertResult.id;
		let resourceAPI = `${baseURL}/${data._id}`;
		upsertResult.data = await put(resourceAPI, data);
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
			let createResponse = await post(baseURL, generateSampleDataSerivce(data.name, selectedApp));
			data._id = createResponse._id;
			let resourceAPI = `${baseURL}/${data._id}`;
			upsertResult.data = await put(resourceAPI, data);
		} else {
			upsertResult.data = await post(baseURL, data);
		}
	}
	printUpsert(upsertResult);
	return upsertResult;
}

async function restoreLibrary(selectedApp: string) {
	header("Library");
	let libraries = read("library");
	printInfo(`Libraries to restore - ${libraries.length}`);
	await libraries.reduce(async (prev: any, library: any) => {
		await prev;
		let upsertResponse = await upsert("Library", `/api/a/sm/${selectedApp}/globalSchema`, selectedApp, library);
		restoreMapper("library", library._id, upsertResponse.data._id);
	}, Promise.resolve());
}

async function restoreDataServices(selectedApp: string) {
	header("Dataservice");
	var BASE_URL = `/api/a/sm/${selectedApp}/service`;
	let dataservices = read("dataservice");
	printInfo(`Dataservices to restore - ${dataservices.length}`);
	await dataservices.reduce(async (prev: any, dataservice: any) => {
		await prev;
		dataservice = parseAndFixDataService(dataservice);
		let upsertResponse = await upsert("Dataservice", BASE_URL, selectedApp, dataservice);
		restoreMapper("dataservice", dataservice._id, upsertResponse.data._id);
	}, Promise.resolve());
}

async function restoreGroups(selectedApp: string) {
	header("Group");
	let BASE_URL = `/api/a/rbac/${selectedApp}/group`;
	let groups = read("group");
	printInfo(`Groups to restore - ${groups.length}`);
	let dataServiceIDMap = readRestoreMap("dataservice");
	await groups.reduce(async (prev: any, group: any) => {
		await prev;
		group.roles.forEach((role: any) => {
			role.app = selectedApp;
			if (dataServiceIDMap[role.entity]) role.entity = dataServiceIDMap[role.entity];
			if (role._id == "ADMIN_role.entity") role._id = `ADMIN_${dataServiceIDMap[role.entity]}`;
		});
		await upsert("Group", BASE_URL, selectedApp, group);
	}, Promise.resolve());
}
