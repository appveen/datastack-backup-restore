import { selectApp } from './lib.cli';
import { printInfo } from './lib.misc';
import { del, get } from './manager.api';

export async function clearAllManager(apps: any) {
	let selectedApp = await selectApp(apps);

	printInfo('Scanning the configurations within the app...');

	await clearGroups(selectedApp);
	await clearDataServices(selectedApp);
	await clearLibrary(selectedApp);
	printInfo('Backup complete!');
}

async function clearGroups(selectedApp: string) {
	let URL = `/api/a/rbac/${selectedApp}/group`;
	let searchParams = new URLSearchParams();
	searchParams.append('count', '-1');
	searchParams.append('select', 'name');
	let groups = await get(URL, searchParams);
	groups = groups.filter(group => group.name != '#');
	printInfo(`${groups.length} Group(s) found.`);
	await groups.reduce(async (p, group) => {
		await p;
		printInfo(`  Removing group ${group._id} ${group.name}`);
		let GROUP_URL = `/api/a/rbac/${selectedApp}/group/${group._id}`;
		await del(GROUP_URL);
	}, Promise.resolve());
}

async function clearDataServices(selectedApp: string) {
	var URL = `/api/a/sm/${selectedApp}/service`;
	let searchParams = new URLSearchParams();
	searchParams.append('filter', JSON.stringify({ app: selectedApp }));
	searchParams.append('count', '-1');
	searchParams.append('select', 'name');
	let dataServices = await get(URL, searchParams);
	printInfo(`${dataServices.length} Data service(s) found.`);
	await dataServices.reduce(async (p, dataService) => {
		await p;
		printInfo(`  Removing data service ${dataService._id} ${dataService.name}`);
		let DS_URL = `/api/a/sm/${selectedApp}/service/${dataService._id}`;
		await del(DS_URL);
	}, Promise.resolve());
}

async function clearLibrary(selectedApp: string) {
	let URL = `/api/a/sm/${selectedApp}/globalSchema`;
	let searchParams = new URLSearchParams();
	searchParams.append('filter', JSON.stringify({ app: selectedApp }));
	searchParams.append('count', '-1');
	searchParams.append('select', 'name');
	let libraries = await get(URL, searchParams);
	printInfo(`${libraries.length} Library(-ies) found.`);
	await libraries.reduce(async (p, library) => {
		await p;
		printInfo(`  Removing data service ${library._id} ${library.name}`);
		let LIB_URL = `/api/a/sm/${selectedApp}/globalSchema/${library._id}`;
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