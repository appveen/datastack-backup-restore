export class DependencyMatrix {
	matrix: any = {};
	rank: any = {};
	largest: number = 0;
	ordered: any = {};

	constructor() {
		this.matrix = {};
		this.rank = {};
		this.largest = 0;
		this.ordered = {};
	}
}