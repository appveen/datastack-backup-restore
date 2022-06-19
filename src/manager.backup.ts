import { selectApp } from './lib.cli';
import { printDone, printInfo } from './lib.misc';
import { get } from './manager.api';
import { backupInit, backupMapper, save } from './lib.db';

// let logger = global.logger;

export async function backupManager(apps: any) {
	let selectedApp = await selectApp(apps);

	backupInit();
	printInfo('Scanning the configurations within the app...');

	await fetchDataServices(selectedApp);
	await fetchLibrary(selectedApp);
	await fetchGroups(selectedApp);
	printInfo('Backup complete!');
}

async function fetchDataServices(selectedApp: string) {
	var URL = `/api/a/sm/${selectedApp}/service`;
	let searchParams = new URLSearchParams();
	searchParams.append('filter', JSON.stringify({ app: selectedApp }));
	searchParams.append('count', '-1');
	let dataServices = await get(URL, searchParams);
	save('dataservices', dataServices);
	dataServices.forEach((ds: any) => backupMapper('dataservice', ds._id, ds.name));
	dataServices.forEach((ds: any) => backupMapper('dataservice_lookup', ds.name, ds._id));
	printDone('Data services', dataServices.length);
}

async function fetchLibrary(selectedApp: string) {
	let URL = `/api/a/sm/${selectedApp}/globalSchema`;
	let searchParams = new URLSearchParams();
	searchParams.append('filter', JSON.stringify({ app: selectedApp }));
	searchParams.append('count', '-1');
	let libraries = await get(URL, searchParams);
	save('library', libraries);
	libraries.forEach(library => library.services = []);
	libraries.forEach(library => backupMapper('library', library._id, library.name));
	libraries.forEach(library => backupMapper('library_lookup', library.name, library._id));
	printDone('Libraries', libraries.length);
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

async function fetchGroups(selectedApp: string) {
	let URL = `/api/a/rbac/${selectedApp}/group`;
	let searchParams = new URLSearchParams();
	searchParams.append('count', '-1');
	let groups = await get(URL, searchParams);
	save('groups', groups);
	printDone('Groups', groups.length - 1);
}