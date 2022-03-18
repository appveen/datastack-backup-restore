export declare class Config {
    name: string;
    url: string;
    username: string;
    password: string | undefined;
    constructor(data: Required<Config>);
}
export declare class ConfigData {
    data: Config[];
    constructor(data: Required<Config>[]);
    push(data: Config): void;
}
