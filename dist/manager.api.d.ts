import { Credentials } from '@appveen/ds-sdk/dist/types';
export declare function login(config: Credentials): Promise<void>;
export declare function getApps(): Promise<(string | undefined)[]>;
export declare function get(endpoint: string, searchParams: URLSearchParams): Promise<any[]>;
