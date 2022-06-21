import { DataStack } from "@appveen/ds-sdk";
import { Logger } from "log4js";
declare global {
    var logger: Logger;
    var version: string;
    var dataStack: DataStack;
    var host: string;
    var backupFileName: string;
    var restoreFileName: string;
}
