import { Config, ConfigData } from './types';
export declare function addConfig(): Promise<ConfigData>;
export declare function deleteConfig(): Promise<void>;
export declare function displayConfig(): Promise<Config>;
