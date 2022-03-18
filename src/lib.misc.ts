
var logger = global.logger;

export function header(_s: string) {
	let totalWidth = 32;
	let fitLength = _s.length;
	if (_s.length % 2 != 0) {
		fitLength += 1;
		_s += ' ';
	}
	let sideWidth = (totalWidth - fitLength) / 2;
	let middle = '';
	let i = 0;
	while (i < fitLength) {
		middle += '─';
		i++;
	}
	let liner = '';
	let spacer = '';
	i = 0;
	while (i < sideWidth) {
		liner += '─';
		spacer += ' ';
		i++;
	}
	var top = '┌' + liner + middle + liner + '┐';
	var bottom = '└' + liner + middle + liner + '┘';
	var center = '│' + spacer + _s + spacer + '│';
	logger.info(top);
	logger.info(center);
	logger.info(bottom);
}