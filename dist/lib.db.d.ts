export declare function backupInit(): void;
export declare function restoreInit(): void;
export declare function save(key: string, data: any[]): void;
export declare function backupMapper(token: string, key: string, data: string): void;
export declare function restoreMapper(token: string, key: string, data: string): void;
export declare function read(key: string): any;
