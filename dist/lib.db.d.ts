export declare function backupInit(): void;
export declare function restoreInit(): void;
export declare function save(key: string, data: any[]): void;
export declare function backupMapper(token: string, key: string, value: string): void;
export declare function restoreMapper(token: string, key: string, value: string): void;
export declare function read(key: string): any;
export declare function readBackupMap(token: string, key: string): any;
export declare function readRestoreMap(token: string): any;
