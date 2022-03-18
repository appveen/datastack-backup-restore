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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApps = exports.login = void 0;
const ds_sdk_1 = require("@appveen/ds-sdk");
var logger = global.logger;
var dataStack;
function login(config) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info('Host      :', `${config.host}`);
        logger.info(`Username  : ${config.username}`);
        dataStack = yield (0, ds_sdk_1.authenticateByCredentials)(config);
        global.dataStack = dataStack;
    });
}
exports.login = login;
function getApps() {
    return __awaiter(this, void 0, void 0, function* () {
        let apps = yield dataStack.ListApps();
        console.log(apps);
        // return apps.map(a => a.data._id);
    });
}
exports.getApps = getApps;
// function __login() {
// 	return req({
// 		uri: `${config.url}/api/a/rbac/login`,
// 		method: 'POST',
// 		json: true,
// 		body: config,
// 	}).then(
// 		_d => {
// 			logger.info(`User ${config.username} logged into ${config.name} successfully`);
// 			logger.info(`User session duration ${_d.rbacUserTokenDuration}`);
// 			if (!refreshActive) {
// 				refreshActive = true;
// 				__refreshToken(_d.rbacUserTokenDuration);
// 			}
// 			token = _d.token;
// 			return _d;
// 		},
// 		_e => {
// 			logger.error(`Unable to login to ${config.name}`);
// 			logger.error(_e.message);
// 			console.log(`Unable to login to ${config.name}`);
// 			misc.error('Error', _e.message);
// 			process.exit();
// 		}
// 	);
// }
// function __refreshToken(_duration) {
// 	logger.info('Refreshing user session');
// 	global.refreshIntervalID = setInterval(__login, (_duration - 10) * 1000);
// }
// e.get = (_url, _qs) => {
// 	logger.info(`GET :: ${config.url}${_url}`);
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
