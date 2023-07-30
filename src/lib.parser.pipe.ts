import { readBackupMap } from "./lib.db";

export function buildDependencyMatrixForDataPipe(datapipes: any[]) {
	const mapperformulaIDs = Object.keys(readBackupMap("mapperformula"));
	const pluginIDs = Object.keys(readBackupMap("plugin"));
	const dataServiceIDs = Object.keys(readBackupMap("dataservice"));
	const dataformatIDs = Object.keys(readBackupMap("dataformats"));
	const functionIDs = Object.keys(readBackupMap("function"));
	const agentIDs = Object.keys(readBackupMap("agents"));
	const connectorIDs = Object.keys(readBackupMap("connectors"));
	let dependencyMatrix: any = {};
	datapipes.forEach((datapipe: any) => {
		const dp = JSON.stringify(datapipe);
		dependencyMatrix[datapipe._id] = {
			dataservices: dataServiceIDs.filter((id: any) => dp.indexOf(id) !== -1),
			dataformats: dataformatIDs.filter((id: any) => dp.indexOf(id) !== -1),
			functions: functionIDs.filter((id: any) => dp.indexOf(id) !== -1),
			agents: agentIDs.filter((id: any) => dp.indexOf(id) !== -1),
			plugins: pluginIDs.filter((id: any) => dp.indexOf(id) !== -1),
			mapperformula: mapperformulaIDs.filter((id: any) => dp.indexOf(id) !== -1),
			connectors: connectorIDs.filter((id: any) => dp.indexOf(id) !== -1)
		};
	});
	return dependencyMatrix;
}