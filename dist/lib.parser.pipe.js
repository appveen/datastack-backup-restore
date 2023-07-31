"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDependencyMatrixForDataPipe = void 0;
const lib_db_1 = require("./lib.db");
function buildDependencyMatrixForDataPipe(datapipes) {
    const mapperformulaIDs = Object.keys((0, lib_db_1.readBackupMap)("mapperformulas"));
    const pluginIDs = Object.keys((0, lib_db_1.readBackupMap)("plugins"));
    const dataServiceIDs = Object.keys((0, lib_db_1.readBackupMap)("dataservices"));
    const dataformatIDs = Object.keys((0, lib_db_1.readBackupMap)("dataformats"));
    const functionIDs = Object.keys((0, lib_db_1.readBackupMap)("functions"));
    const agentIDs = Object.keys((0, lib_db_1.readBackupMap)("agents"));
    const connectorIDs = Object.keys((0, lib_db_1.readBackupMap)("connectors"));
    let dependencyMatrix = {};
    datapipes.forEach((datapipe) => {
        const dp = JSON.stringify(datapipe);
        dependencyMatrix[datapipe._id] = {
            plugins: [],
            mapperformulas: [],
            dataservices: dataServiceIDs.filter((id) => dp.indexOf(id) !== -1),
            dataformats: dataformatIDs.filter((id) => dp.indexOf(id) !== -1),
            functions: functionIDs.filter((id) => dp.indexOf(id) !== -1),
            agents: agentIDs.filter((id) => dp.indexOf(id) !== -1),
            connectors: connectorIDs.filter((id) => dp.indexOf(id) !== -1)
        };
        if (global.isSuperAdmin) {
            dependencyMatrix[datapipe._id]["plugins"] = pluginIDs.filter((id) => dp.indexOf(id) !== -1);
            dependencyMatrix[datapipe._id]["mapperformulas"] = mapperformulaIDs.filter((id) => dp.indexOf(id) !== -1);
        }
    });
    return dependencyMatrix;
}
exports.buildDependencyMatrixForDataPipe = buildDependencyMatrixForDataPipe;
