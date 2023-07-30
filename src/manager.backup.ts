import { customise, selectApp, selections } from "./lib.cli";
import { header, printDone, printInfo } from "./lib.misc";
import { get } from "./manager.api";
import { backupDependencyMatrixOfDataService, backupInit, backupMapper, readBackupMap, readDependencyMatrixofDataService, save, read, backupDependencyMatrixOfDataPipe } from "./lib.db";
import { buildDependencyMatrixForDataServices } from "./lib.parser.ds";
import { buildDependencyMatrixForDataPipe } from "./lib.parser.pipe";

let logger = global.logger;

let selectedApp = "";

function getURLParamsForCount() {
	let searchParams = new URLSearchParams();
	searchParams.append("filter", JSON.stringify({ app: selectedApp }));
	return searchParams;
}

function getURLParamsForData(count: number) {
	let searchParams = new URLSearchParams();
	searchParams.append("filter", JSON.stringify({ app: selectedApp }));
	searchParams.append("count", count.toString());
	searchParams.append("select", "-_metadata,-allowedFileTypes,-port,-__v,-users");
	searchParams.append("sort", "_id");
	return searchParams;
}

export async function backupManager(apps: any) {
	header("Backup configurations");
	selectedApp = await selectApp(apps);

	backupInit();
	printInfo("Scanning the configurations within the app...");

	if (global.dataStack.authData.isSuperAdmin) {
		await fetchMapperFormulas();
		await fetchPlugins();
		await fetchNPMLibraries();
	}
	await fetchDataServices();
	await fetchLibrary();
	await fetchFunctions();
	await fetchConnectors();
	await fetchDataFormats();
	await fetchAgents();
	await fetchDataPipes();
	await fetchGroups();
	await customiseBackup();
	header("Backup complete!");
}

async function fetchMapperFormulas() {
	const URL_COUNT = "/api/a/rbac/admin/metadata/mapper/formula/count";
	const URL_DATA = "/api/a/rbac/admin/metadata/mapper/formula";
	const mapperFormulaCount = await get(URL_COUNT, new URLSearchParams());
	const searchParams = new URLSearchParams();
	searchParams.append("count", mapperFormulaCount);
	const mapperFormulas = await get(URL_DATA, searchParams);
	save("mapperformula", mapperFormulas);
	mapperFormulas.forEach((mf: any) => {
		backupMapper("mapperformula", mf._id, mf.name);
		backupMapper("mapperformula_lookup", mf.name, mf._id);
	});
	printDone("Mapper Formulas(!)", mapperFormulaCount);
}

async function fetchPlugins() {
	const URL_COUNT = "/api/a/bm/admin/node/utils/count";
	const URL_DATA = "/api/a/bm/admin/node";
	const pluginCount = await get(URL_COUNT, new URLSearchParams());
	const searchParams = new URLSearchParams();
	searchParams.append("count", pluginCount);
	const plugins = await get(URL_DATA, searchParams);
	save("plugin", plugins);
	plugins.forEach((plugin: any) => {
		backupMapper("plugin", plugin._id, plugin.name);
		backupMapper("plugin_lookup", plugin.name, plugin._id);
	});
	printDone("Plugins(!)", pluginCount);
}

async function fetchNPMLibraries() {
	const URL_DATA = "/api/a/bm/admin/flow/utils/node-library";
	const npmLibraries = await get(URL_DATA, new URLSearchParams());
	save("npmlibrary", npmLibraries);
	npmLibraries.forEach((lib: any) => {
		backupMapper("npmlibrary", lib._id, lib.name);
		backupMapper("npmlibrary_lookup", lib.name, lib._id);
	});
	printDone("NPM Library(!)", npmLibraries.length);
}

async function fetchDataServices() {
	var URL_COUNT = `/api/a/sm/${selectedApp}/service/utils/count`;
	var URL_DATA = `/api/a/sm/${selectedApp}/service`;
	const dataservicesCount = await get(URL_COUNT, getURLParamsForCount());
	let dataservices = await get(URL_DATA, getURLParamsForData(dataservicesCount));
	save("dataservice", dataservices);
	dataservices.forEach((ds: any) => {
		backupMapper("dataservice", ds._id, ds.name);
		backupMapper("dataservice_lookup", ds.name, ds._id);
	});
	backupDependencyMatrixOfDataService(buildDependencyMatrixForDataServices(dataservices));
	printDone("Data services", dataservicesCount);
}

async function fetchLibrary() {
	var URL_COUNT = `/api/a/sm/${selectedApp}/globalSchema/utils/count`;
	var URL_DATA = `/api/a/sm/${selectedApp}/globalSchema`;
	const librariesCount = await get(URL_COUNT, getURLParamsForCount());
	let libraries = await get(URL_DATA, getURLParamsForData(librariesCount));
	save("library", libraries);
	libraries.forEach((library: any) => {
		library.services = [];
		backupMapper("library", library._id, library.name);
		backupMapper("library_lookup", library.name, library._id);
	});
	printDone("Libraries", librariesCount);
}

async function fetchFunctions() {
	let URL_COUNT = `/api/a/bm/${selectedApp}/faas/utils/count`;
	let URL_DATA = `/api/a/bm/${selectedApp}/faas`;
	let functionsCount = await get(URL_COUNT, getURLParamsForCount());
	let functions = await get(URL_DATA, getURLParamsForData(functionsCount));
	save("function", functions);
	functions.forEach((fn: any) => {
		fn.services = [];
		backupMapper("function", fn._id, fn.name);
		backupMapper("function_lookup", fn.name, fn._id);
	});
	printDone("Functions", functionsCount);
}

async function fetchConnectors() {
	const URL_DATA = `/api/a/rbac/${selectedApp}/connector`;
	const URL_COUNT = `/api/a/rbac/${selectedApp}/connector/utils/count`;
	const connectorsCount = await get(URL_COUNT, getURLParamsForCount());
	const connectors = await get(URL_DATA, getURLParamsForData(connectorsCount));
	save("connectors", connectors);
	connectors.forEach((connector: any) => {
		backupMapper("connectors", connector._id, connector.name);
		backupMapper("connectors_lookup", connector.name, connector._id);
	});
	printDone("Connectors", connectorsCount);
}

async function fetchDataFormats() {
	const URL_DATA = `/api/a/bm/${selectedApp}/dataFormat`;
	const URL_COUNT = `/api/a/bm/${selectedApp}/dataFormat`;
	let searchParams = getURLParamsForCount();
	searchParams.append("countOnly", "true");
	const dataFormatsCount = await get(URL_COUNT, searchParams);
	const dataFormats = await get(URL_DATA, getURLParamsForData(dataFormatsCount));
	save("dataformats", dataFormats);
	dataFormats.forEach((dataFormat: any) => {
		backupMapper("dataformats", dataFormat._id, dataFormat.name);
		backupMapper("dataformats_lookup", dataFormat.name, dataFormat._id);
	});
	printDone("Data Formats", dataFormatsCount);
}

async function fetchAgents() {
	const URL_DATA = `/api/a/bm/${selectedApp}/agent`;
	const URL_COUNT = `/api/a/bm/${selectedApp}/agent/utils/count`;
	const agentsCount = await get(URL_COUNT, getURLParamsForCount());
	const agents = await get(URL_DATA, getURLParamsForData(agentsCount));
	save("agents", agents);
	agents.forEach((agent: any) => {
		backupMapper("agents", agent._id, agent.name);
		backupMapper("agents_lookup", agent.name, agent._id);
	});
	printDone("Agents", agentsCount);
}

async function fetchDataPipes() {
	const URL_DATA = `/api/a/bm/${selectedApp}/flow`;
	const URL_COUNT = `/api/a/bm/${selectedApp}/flow/utils/count`;
	const dataPipesCount = await get(URL_COUNT, getURLParamsForCount());
	const dataPipes = await get(URL_DATA, getURLParamsForData(dataPipesCount));
	save("datapipes", dataPipes);
	dataPipes.forEach((dataPipe: any) => {
		backupMapper("datapipes", dataPipe._id, dataPipe.name);
		backupMapper("datapipes_lookup", dataPipe.name, dataPipe._id);
	});
	backupDependencyMatrixOfDataPipe(buildDependencyMatrixForDataPipe(dataPipes));
	printDone("Data Pipes", dataPipesCount);
}

async function fetchGroups() {
	let URL_COUNT = `/api/a/rbac/${selectedApp}/group/count`;
	let URL_DATA = `/api/a/rbac/${selectedApp}/group`;
	const groupsCount = await get(URL_COUNT, getURLParamsForCount());
	let groups = await get(URL_DATA, getURLParamsForData(groupsCount));
	groups = groups.filter((group: any) => group.name != "#");
	save("group", groups);
	groups.forEach((group: any) => {
		backupMapper("group", group._id, group.name);
		backupMapper("group_lookup", group.name, group._id);
	});
	printDone("Groups", groups.length);
}

async function customiseBackup() {

	let customisationRequired = await customise();
	if (!customisationRequired) {
		printInfo("No backup customizations done.");
		return;
	}
	header("Customizing the backup");
	let dataserviceLookup = readBackupMap("dataservice_lookup");
	let selectedDataservices: string[] = [];
	(await selections("dataservices", Object.keys(dataserviceLookup))).forEach((ds: string) => selectedDataservices.push(dataserviceLookup[ds]));

	let libraryLookup = readBackupMap("library_lookup");
	let selectedLibraries: string[] = [];
	(await selections("libraries", Object.keys(libraryLookup))).forEach((lib: string) => selectedLibraries.push(libraryLookup[lib]));

	let functionLookup = readBackupMap("function_lookup");
	let selectedFunctions: string[] = [];
	(await selections("functions", Object.keys(functionLookup))).forEach((fn: string) => selectedFunctions.push(functionLookup[fn]));

	let groupLookup = readBackupMap("group_lookup");
	let selectedGroups: string[] = [];
	(await selections("groups", Object.keys(groupLookup))).forEach((group: string) => selectedGroups.push(groupLookup[group]));

	logger.info(`Dataservices : ${selectedDataservices.join(", ") || "Nil"}`);
	logger.info(`Libraries    : ${selectedLibraries.join(", ") || "Nil"}`);
	logger.info(`Functions    : ${selectedFunctions.join(", ") || "Nil"}`);
	logger.info(`Groups       : ${selectedGroups.join(", ") || "Nil"}`);

	let dependencyMatrix = readDependencyMatrixofDataService();

	let superSetOfDataservices = selectedDataservices;
	selectedDataservices.forEach((dataserviceID: string) => {
		selectAllRelated(dataserviceID, dependencyMatrix)
			.filter(ds => superSetOfDataservices.indexOf(ds) == -1)
			.forEach(ds => superSetOfDataservices.push(ds));
		dependencyMatrix[dataserviceID].libraries.forEach((library: string) => {
			if (selectedLibraries.indexOf(library) == -1) selectedLibraries.push(library);
		});
		dependencyMatrix[dataserviceID].functions.forEach((fn: string) => {
			if (selectedFunctions.indexOf(fn) == -1) selectedFunctions.push(fn);
		});
	});
	logger.info(`Superset Dataservices : ${superSetOfDataservices.join(", ")}`);
	logger.info(`Superset Libraries    : ${selectedLibraries.join(", ")}`);
	logger.info(`Superset Functions    : ${selectedFunctions.join(", ")}`);

	let dataservices = read("dataservice").filter((dataservice: any) => superSetOfDataservices.indexOf(dataservice._id) != -1);
	let libraries = read("library").filter((library: any) => selectedLibraries.indexOf(library._id) != -1);
	let functions = read("function").filter((fn: any) => selectedFunctions.indexOf(fn._id) != -1);
	let groups = read("group").filter((group: any) => selectedGroups.indexOf(group._id) != -1);

	save("dataservice", dataservices);
	save("library", libraries);
	save("function", functions);
	save("group", groups);
}

function selectAllRelated(dataserviceID: string, dependencyMatrix: any) {
	let requiredDS: string[] = [];
	dependencyMatrix[dataserviceID].dataservices.forEach((ds: string) => {
		if (dataserviceID == ds) return;
		if (requiredDS.indexOf(ds) == -1) {
			requiredDS.push(ds);
			selectAllRelated(ds, dependencyMatrix)
				.filter(ds => requiredDS.indexOf(ds) == -1)
				.forEach(ds => requiredDS.push(ds));
		}
	});
	return requiredDS;
}