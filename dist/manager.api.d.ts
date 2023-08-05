import { Credentials } from "@appveen/ds-sdk/dist/types";
export declare function login(config: Credentials): Promise<void>;
export declare function getApps(): Promise<(string | undefined)[] | undefined>;
export declare function get(endpoint: string, searchParams: URLSearchParams): Promise<any>;
export declare function post(endpoint: string, payload: any): Promise<any>;
export declare function put(endpoint: string, payload: any): Promise<any>;
export declare function del(endpoint: string): Promise<any>;
