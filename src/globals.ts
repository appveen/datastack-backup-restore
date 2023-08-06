/* eslint-disable no-unused-vars */
import { DataStack } from "@appveen/ds-sdk";
import { Logger } from "log4js";

declare global {
	// var globalId = (new Date()).toISOString().replace(/:/gi, '-');
	var logger: Logger;
	var version: string;
	var dataStack: DataStack;
	var host: string;
	var backupFileName: string;
	var restoreFileName: string;
	var token: string;
	var isSuperAdmin: boolean;
}