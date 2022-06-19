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
exports.displayConfig = exports.deleteConfig = exports.addConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const inquirer_1 = require("inquirer");
(0, inquirer_1.registerPrompt)('autocomplete', require('inquirer-autocomplete-prompt'));
const lib_misc_1 = require("./lib.misc");
const types_1 = require("./types");
const configDBFile = (0, path_1.join)(process.cwd(), 'config.db');
let logger = global.logger;
if (!(0, fs_1.existsSync)(configDBFile)) {
    logger.info('No config.db found. Initializing a new one.');
    let configData = { 'data': [] };
    (0, fs_1.writeFileSync)(configDBFile, JSON.stringify(configData));
}
let e = {};
function addConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield (0, inquirer_1.prompt)([
            {
                type: 'input',
                name: 'name',
                message: 'Server name',
            },
            {
                type: 'input',
                name: 'url',
                message: 'URL',
            },
            {
                type: 'input',
                name: 'username',
                message: 'Username',
            }
        ]);
        var configData = new types_1.ConfigData(JSON.parse((0, fs_1.readFileSync)(configDBFile).toString()));
        configData.push(data);
        (0, fs_1.writeFileSync)(configDBFile, JSON.stringify(configData));
        return configData;
    });
}
exports.addConfig = addConfig;
function deleteConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        var configData = new types_1.ConfigData(JSON.parse((0, fs_1.readFileSync)(configDBFile).toString()));
        if (configData.data.length < 1)
            configData = yield addConfig();
        var names = configData.data.map(_d => _d.name);
        let selection = yield (0, inquirer_1.prompt)([{
                type: 'autocomplete',
                name: 'config',
                message: 'Config',
                pageSize: 5,
                source: (_ans, _input) => __awaiter(this, void 0, void 0, function* () {
                    _input = _input || '';
                    return yield names.filter(_n => (_n || ' ').indexOf(_input) > -1);
                })
            }]);
        let index = names.indexOf(selection.config);
        let confirm = yield (0, inquirer_1.prompt)([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are you sure you want to remove "${selection.config}"?`,
                default: false
            }
        ]);
        if (confirm.confirm) {
            configData.data.splice(index, 1);
            (0, fs_1.writeFileSync)(configDBFile, JSON.stringify(configData));
        }
        else
            logger.info('Configurations left unchanged!');
    });
}
exports.deleteConfig = deleteConfig;
function displayConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        var configData = new types_1.ConfigData(JSON.parse((0, fs_1.readFileSync)(configDBFile).toString()));
        if (configData.data.length < 1) {
            logger.info('No configuration found.');
            configData = yield addConfig();
        }
        var names = configData.data.map(_d => _d.name);
        let selection = yield (0, inquirer_1.prompt)([{
                type: 'autocomplete',
                name: 'config',
                message: 'Configuration list',
                pageSize: 5,
                source: (_ans, _input) => __awaiter(this, void 0, void 0, function* () {
                    _input = _input || '';
                    return yield names.filter(_n => (_n || ' ').indexOf(_input) > -1);
                })
            }]);
        logger.info(`Selected config :: ${selection.config}`);
        let config = configData.data.filter(d => selection.config == d.name)[0];
        (0, lib_misc_1.header)(`${config.name} (${config.url})`);
        let password = yield (0, inquirer_1.prompt)([
            {
                type: 'password',
                name: 'password',
                message: `Password for ${config.username}`,
            }
        ]);
        config.password = password.password;
        return config;
    });
}
exports.displayConfig = displayConfig;
