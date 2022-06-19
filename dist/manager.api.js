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
exports.get = exports.getApps = exports.login = void 0;
const got_1 = __importDefault(require("got"));
const ds_sdk_1 = require("@appveen/ds-sdk");
const lib_misc_1 = require("./lib.misc");
var logger = global.logger;
var dataStack;
function login(config) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.trace(config);
        try {
            dataStack = yield (0, ds_sdk_1.authenticateByCredentials)(config);
            (0, lib_misc_1.printInfo)('Logged into data.stack.');
            global.dataStack = dataStack;
        }
        catch (e) {
            (0, lib_misc_1.printError)('Unable to login to data.stack server');
            logger.error(e);
        }
    });
}
exports.login = login;
function getApps() {
    return __awaiter(this, void 0, void 0, function* () {
        let apps = yield dataStack.ListApps();
        return apps.map(a => a.app._id).sort();
    });
}
exports.getApps = getApps;
function get(endpoint, searchParams) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`GET ${global.host}${endpoint} :: ${JSON.stringify(searchParams)}`);
        try {
            return yield got_1.default.get(`${global.host}${endpoint}`, {
                'headers': {
                    'Authorization': `JWT ${dataStack.authData.token}`
                },
                'searchParams': searchParams
            }).json();
        }
        catch (e) {
            (0, lib_misc_1.printError)(`Error on GET ${global.host}${endpoint}`);
            logger.error(e);
            (0, lib_misc_1.printInfo)('Terminating...');
            process.exit(200);
        }
    });
}
exports.get = get;
// e.get = (_url, _qs) => {
// 	logger.debug(JSON.stringify(_qs));
// 	return req({
// 		method: 'GET',
// 		uri: `${config.url}${_url}`,
// 		headers: {
// 			'Authorization': `JWT ${token}`
// 		},
// 		qs: _qs,
// 		json: true
// 	}).then(_d => {
// 		return _d;
// 	}, _e => {
// 		logger.error(_e.message);
// 		return _e.message;
// 	});
// };
// e.post = (_url, _body) => {
// 	logger.info(`POST :: ${config.url}${_url}`);
// 	// dataLogger.debug(JSON.stringify(_body))
// 	return req({
// 		method: 'POST',
// 		uri: `${config.url}${_url}`,
// 		headers: {
// 			'Authorization': `JWT ${token}`
// 		},
// 		body: _body,
// 		json: true
// 	}).then(_d => {
// 		return _d;
// 	}, _e => {
// 		logger.error(_e.message);
// 		logger.error(JSON.stringify(_body));
// 		return _e.message;
// 	});
// };
// e.put = (_url, _body) => {
// 	logger.info(`PUT :: ${config.url}${_url}`);
// 	// dataLogger.debug(JSON.stringify(_body))
// 	return req({
// 		method: 'PUT',
// 		uri: `${config.url}${_url}`,
// 		headers: {
// 			'Authorization': `JWT ${token}`
// 		},
// 		body: _body,
// 		json: true
// 	}).then(_d => {
// 		return _d;
// 	}, _e => {
// 		logger.error(_e.message);
// 		logger.error(JSON.stringify(_body));
// 		return _e.message;
// 	});
// };
// e.delete = (_url) => {
// 	logger.info(`DELETE :: ${config.url}${_url}`);
// 	return req({
// 		method: 'DELETE',
// 		uri: `${config.url}${_url}`,
// 		headers: {
// 			'Authorization': `JWT ${token}`
// 		},
// 		json: true
// 	}).then(_d => {
// 		return _d;
// 	}, _e => {
// 		logger.error(_e.message);
// 		return _e.message;
// 	});
// };
// module.exports = e;
