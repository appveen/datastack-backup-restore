"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.put = exports.post = exports.get = exports.getApps = exports.login = void 0;
const got_1 = __importDefault(require("got"));
const ds_sdk_1 = require("@appveen/ds-sdk");
const types_1 = require("@appveen/ds-sdk/dist/types");
const lib_misc_1 = require("./lib.misc");
var logger = global.logger;
var dataStack;
function login(config) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.trace(JSON.stringify(config));
        try {
            dataStack = yield (0, ds_sdk_1.authenticateByCredentials)(config);
            (0, lib_misc_1.printInfo)("Logged into data.stack.");
            let message = `User ${dataStack.authData._id} is not a super admin. You will not be able to backup Mapper Functions, Plugins and NPM Libraries.`;
            if (dataStack.authData.isSuperAdmin)
                message = `User ${dataStack.authData._id} is a super admin.`;
            global.isSuperAdmin = dataStack.authData.isSuperAdmin;
            (0, lib_misc_1.printInfo)(message);
            global.dataStack = dataStack;
        }
        catch (e) {
            (0, lib_misc_1.printError)("Unable to login to data.stack server");
            logger.error(e);
            yield (0, lib_misc_1.killThySelf)(400);
        }
    });
}
exports.login = login;
function getApps() {
    return __awaiter(this, void 0, void 0, function* () {
        let listOptions = new types_1.ListOptions();
        listOptions.count = -1;
        let apps = yield dataStack.ListApps(listOptions);
        return apps.map(a => a.app._id).sort();
    });
}
exports.getApps = getApps;
function get(endpoint, searchParams) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`GET ${global.host}${endpoint} :: ${searchParams}`);
        try {
            return yield got_1.default.get(`${global.host}${endpoint}`, {
                "headers": {
                    "Authorization": `JWT ${dataStack.authData.token}`
                },
                "searchParams": searchParams
            }).json()
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                (0, lib_misc_1.printError)(`Error on GET ${global.host}${endpoint}`);
                (0, lib_misc_1.printError)(`${e.response.statusCode} ${e.response.body}`);
                yield (0, lib_misc_1.killThySelf)(500);
            }));
        }
        catch (e) {
            logger.error(e);
            (0, lib_misc_1.printError)(`Error on GET ${global.host}${endpoint}`);
            yield (0, lib_misc_1.killThySelf)(500);
        }
    });
}
exports.get = get;
function post(endpoint, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`POST ${global.host}${endpoint}`);
        logger.info(`Payload - ${JSON.stringify(payload)}`);
        try {
            return yield got_1.default.post(`${global.host}${endpoint}`, {
                "headers": {
                    "Authorization": `JWT ${dataStack.authData.token}`
                },
                json: payload
            }).json()
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                (0, lib_misc_1.printError)(`Error on POST ${global.host}${endpoint}`);
                (0, lib_misc_1.printError)(`${e.response.statusCode} ${e.response.body}`);
                yield (0, lib_misc_1.killThySelf)(500);
            }));
        }
        catch (e) {
            logger.error(e);
            (0, lib_misc_1.printError)(`Error on POST ${global.host}${endpoint}`);
            yield (0, lib_misc_1.killThySelf)(500);
        }
    });
}
exports.post = post;
function put(endpoint, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`PUT ${global.host}${endpoint}`);
        logger.info(`Payload - ${JSON.stringify(payload)}`);
        try {
            return yield got_1.default.put(`${global.host}${endpoint}`, {
                "headers": {
                    "Authorization": `JWT ${dataStack.authData.token}`
                },
                json: payload
            }).json()
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                (0, lib_misc_1.printError)(`Error on PUT ${global.host}${endpoint}`);
                (0, lib_misc_1.printError)(`${e.response.statusCode} ${e.response.body}`);
                yield (0, lib_misc_1.killThySelf)(500);
            }));
        }
        catch (e) {
            (0, lib_misc_1.printError)(`Error on PUT ${global.host}${endpoint}`);
            logger.error(e);
            yield (0, lib_misc_1.killThySelf)(500);
        }
    });
}
exports.put = put;
function del(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`DELETE ${global.host}${endpoint}`);
        try {
            return yield got_1.default.delete(`${global.host}${endpoint}`, {
                "headers": {
                    "Authorization": `JWT ${dataStack.authData.token}`
                }
            }).json()
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                (0, lib_misc_1.printError)(`Error on DELETE ${global.host}${endpoint}`);
                (0, lib_misc_1.printError)(`${e.response.statusCode} ${e.response.body}`);
                yield (0, lib_misc_1.killThySelf)(500);
            }));
        }
        catch (e) {
            logger.error(e);
            (0, lib_misc_1.printError)(`Error on DELETE ${global.host}${endpoint}`);
            yield (0, lib_misc_1.killThySelf)(500);
        }
    });
}
exports.del = del;
