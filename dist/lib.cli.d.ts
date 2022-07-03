import { Credentials } from "@appveen/ds-sdk/dist/types";
export declare function validateCLIParams(): Promise<Credentials>;
export declare function promptUser(message: string, defaultValue: string | null, isPassword: boolean): Promise<any>;
export declare function startMenu(): Promise<any>;
export declare function selectApp(apps: any): Promise<any>;
export declare function customise(): Promise<any>;
export declare function selections(type: string, choices: string[]): Promise<any>;
