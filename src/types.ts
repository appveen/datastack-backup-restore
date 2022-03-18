function stringComparator(a: Config, b: Config) {
	let nameA = a.name.toUpperCase();
	let nameB = b.name.toUpperCase();
	if (nameA < nameB) return -1;
	if (nameA > nameB) return 1;
	return 0;
}

export class Config {
	name: string;
	url: string;
	username: string;
	password: string | undefined;
	constructor(data: Required<Config>) {
		this.name = data.name;
		this.url = data.url;
		this.username = data.username;
	}
}

export class ConfigData {
	data: Config[];
	constructor(data: Required<Config>[]) {
		this.data = data || [];
	}

	push(data: Config) {
		this.data.push(data);
		this.data = this.data.sort(stringComparator);
	}
}