import got, { HTTPError } from "got";
import { authenticateByCredentials, DataStack } from "@appveen/ds-sdk";
import { Credentials, ListOptions } from "@appveen/ds-sdk/dist/types";
import { killThySelf, printError, printInfo } from "./lib.misc";

var logger = global.logger;
var dataStack: DataStack;


export async function login(config: Credentials) {
	logger.trace(JSON.stringify(config));
	try {
		dataStack = await authenticateByCredentials(config);
		printInfo("Logged into data.stack.");
		let message = `User ${dataStack.authData._id} is not a super admin. You will not be able to backup Mapper Functions, Plugins and NPM Libraries.`;
		if (dataStack.authData.isSuperAdmin) message = `User ${dataStack.authData._id} is a super admin.`;
		printInfo(message);
		global.dataStack = dataStack;
	} catch (e) {
		printError("Unable to login to data.stack server");
		logger.error(e);
		await killThySelf(400);
	}
}

export async function getApps() {
	let listOptions = new ListOptions();
	listOptions.count = -1;
	let apps = await dataStack.ListApps(listOptions);
	return apps.map(a => a.app._id).sort();
}

export async function get(endpoint: string, searchParams: URLSearchParams): Promise<any> {
	logger.info(`GET ${global.host}${endpoint} :: ${searchParams}`);
	try {
		return await got.get(`${global.host}${endpoint}`, {
			"headers": {
				"Authorization": `JWT ${dataStack.authData.token}`
			},
			"searchParams": searchParams
		}).json()
			.catch(async (e) => {
				printError(`Error on GET ${global.host}${endpoint}`);
				printError(`${e.response.statusCode} ${e.response.body}`);
				await killThySelf(500);
			});
	} catch (e) {
		logger.error(e);
		printError(`Error on GET ${global.host}${endpoint}`);
		await killThySelf(500);
	}
}

export async function post(endpoint: string, payload: any): Promise<any> {
	logger.info(`POST ${global.host}${endpoint}`);
	logger.info(`Payload - ${JSON.stringify(payload)}`);
	try {
		return await got.post(`${global.host}${endpoint}`, {
			"headers": {
				"Authorization": `JWT ${dataStack.authData.token}`
			},
			json: payload
		}).json()
			.catch(async (e: HTTPError) => {
				printError(`Error on POST ${global.host}${endpoint}`);
				printError(`${e.response.statusCode} ${e.response.body}`);
				await killThySelf(500);
			});
	} catch (e) {
		logger.error(e);
		printError(`Error on POST ${global.host}${endpoint}`);
		await killThySelf(500);
	}
}

export async function put(endpoint: string, payload: any): Promise<any> {
	logger.info(`PUT ${global.host}${endpoint}`);
	logger.info(`Payload - ${JSON.stringify(payload)}`);
	try {
		return await got.put(`${global.host}${endpoint}`, {
			"headers": {
				"Authorization": `JWT ${dataStack.authData.token}`
			},
			json: payload
		}).json()
			.catch(async (e) => {
				printError(`Error on PUT ${global.host}${endpoint}`);
				printError(`${e.response.statusCode} ${e.response.body}`);
				await killThySelf(500);
			});
	} catch (e) {
		printError(`Error on PUT ${global.host}${endpoint}`);
		logger.error(e);
		await killThySelf(500);
	}
}

export async function del(endpoint: string): Promise<any> {
	logger.info(`DELETE ${global.host}${endpoint}`);
	try {
		return await got.delete(`${global.host}${endpoint}`, {
			"headers": {
				"Authorization": `JWT ${dataStack.authData.token}`
			}
		}).json()
			.catch(async (e) => {
				printError(`Error on DELETE ${global.host}${endpoint}`);
				printError(`${e.response.statusCode} ${e.response.body}`);
				await killThySelf(500);
			});
	} catch (e) {
		logger.error(e);
		printError(`Error on DELETE ${global.host}${endpoint}`);
		await killThySelf(500);
	}
}