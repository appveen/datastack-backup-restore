"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printDone = exports.printError = exports.printInfo = exports.isNotAnAcceptableValue = exports.stringComparison = exports.header = void 0;
var logger = global.logger;
function header(_s) {
    let totalWidth = 32;
    let fitLength = _s.length;
    if (_s.length % 2 != 0) {
        fitLength += 1;
        _s += ' ';
    }
    let sideWidth = (totalWidth - fitLength) / 2;
    let middle = '';
    let i = 0;
    while (i < fitLength) {
        middle += '─';
        i++;
    }
    let liner = '';
    let spacer = '';
    i = 0;
    while (i < sideWidth) {
        liner += '─';
        spacer += ' ';
        i++;
    }
    var top = '┌' + liner + middle + liner + '┐';
    var bottom = '└' + liner + middle + liner + '┘';
    var center = '│' + spacer + _s + spacer + '│';
    printInfo(top);
    printInfo(center);
    printInfo(bottom);
}
exports.header = header;
function stringComparison(a, b) {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();
    if (nameA < nameB)
        return -1;
    if (nameA > nameB)
        return 1;
    return 0;
}
exports.stringComparison = stringComparison;
function isNotAnAcceptableValue(i) {
    if (typeof i == 'object')
        return true;
    if (i == null)
        return true;
    return false;
}
exports.isNotAnAcceptableValue = isNotAnAcceptableValue;
function printInfo(message) {
    logger.info(message);
    console.log(message);
}
exports.printInfo = printInfo;
function printError(message) {
    logger.error(message);
    console.error(message);
}
exports.printError = printError;
function printDone(_msg, _count) {
    printInfo(`  ${padCount(_count)} ${_msg}`);
}
exports.printDone = printDone;
function padCount(_d) {
    if (_d > 9)
        return ` ${_d} `;
    return `  ${_d} `;
}
