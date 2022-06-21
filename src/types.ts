
export class DependencyMatrix {
	matrix: any = {};
	rank: any = {};
	largestRank: number = 0;
	list: any = {};

	constructor() {
		this.matrix = {};
		this.rank = {};
		this.largestRank = 0;
		this.list = {};
	}
}