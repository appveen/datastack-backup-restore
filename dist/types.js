"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigData = exports.Config = void 0;
function stringComparator(a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB)
        return -1;
    if (nameA > nameB)
        return 1;
    return 0;
}
class Config {
    constructor(data) {
        this.name = data.name;
        this.url = data.url;
        this.username = data.username;
    }
}
exports.Config = Config;
class ConfigData {
    constructor(data) {
        this.data = data || [];
    }
    push(data) {
        this.data.push(data);
        this.data = this.data.sort(stringComparator);
    }
}
exports.ConfigData = ConfigData;
