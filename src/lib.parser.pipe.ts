import { readBackupMap } from "./lib.db";

export function buildDependencyMatrixForDataPipe(datapipes: any[]) {
	const mapperformulaIDs = Object.keys(readBackupMap("mapperformulas"));
	const pluginIDs = Object.keys(readBackupMap("plugins"));
	const dataServiceIDs = Object.keys(readBackupMap("dataservices"));
	const dataformatIDs = Object.keys(readBackupMap("dataformats"));
	const functionIDs = Object.keys(readBackupMap("functions"));
	const agentIDs = Object.keys(readBackupMap("agents"));
	const connectorIDs = Object.keys(readBackupMap("connectors"));
	let dependencyMatrix: any = {};
	datapipes.forEach((datapipe: any) => {
		const dp = JSON.stringify(datapipe);
		dependencyMatrix[datapipe._id] = {
			plugins: [],
			mapperformulas: [],
			dataservices: dataServiceIDs.filter((id: any) => dp.indexOf(id) !== -1),
			dataformats: dataformatIDs.filter((id: any) => dp.indexOf(id) !== -1),
			functions: functionIDs.filter((id: any) => dp.indexOf(id) !== -1),
			agents: agentIDs.filter((id: any) => dp.indexOf(id) !== -1),
			connectors: connectorIDs.filter((id: any) => dp.indexOf(id) !== -1)
		};
		if (global.isSuperAdmin) {
			dependencyMatrix[datapipe._id]["plugins"] = pluginIDs.filter((id: any) => dp.indexOf(id) !== -1);
			dependencyMatrix[datapipe._id]["mapperformulas"] = mapperformulaIDs.filter((id: any) => dp.indexOf(id) !== -1);
		}
	});
	return dependencyMatrix;
}