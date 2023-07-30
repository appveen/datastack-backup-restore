export declare function generateSampleDataSerivce(name: string, selectedApp: String): {
    name: string;
    description: null;
    app: String;
};
export declare function parseAndFixDataServices(selectedApp: string, dataservices: any[]): any[];
export declare function buildDependencyMatrixForDataServices(dataservices: any[]): any;
