module.exports = {
	MITSY_COLOR: '#F895FB',
	GUILD_LOST_COLOR: '#BD4351',
	GUILD_ADDED_COLOR: '#41A57A',
};

const TIME = {
	Millisecond: 1,
	Second: 1000,
	Minute: 1000 * 60,
	Hour: 1000 * 60 * 60,
	Day: 1000 * 60 * 60 * 24,
	Month: 1000 * 60 * 60 * 24 * (365 / 12),
	Year: 1000 * 60 * 60 * 24 * 365,
};

const JOGO_DO_BICHO = [
	'avestruz',
	'ágia',
	'burro',
	'borboleta',
	'cachorro',
	'cabra',
	'carneiro',
	'camelo',
	'cobra',
	'coelho',
	'cavalo',
	'elefante',
	'galo',
	'gato',
	'jacaré',
	'leão',
	'macaco',
	'porco',
	'pavão',
	'peru',
	'touro',
	'tigre',
	'urso',
	'veado',
	'vaca',
];

const BICHO_BET_MULTIPLIER = {
	unity: 2,
	ten: 5,
	hundred: 20,
	thousand: 500,
	animal: 3,
	sequence: 19,
	corner: 1000,
};

const HOURLY_ROULETTE_HIGH_VALUE_BET_LIMIT = 5;

const ROULETTE_NUMBERS = [
	{ value: 0, color: 'green', dozen: '?' },
	{ value: 1, color: 'red', parity: 'odd', size: 'low', dozen: 'first' },
	{ value: 2, color: 'black', parity: 'even', size: 'low', dozen: 'first' },
	{ value: 3, color: 'red', parity: 'odd', size: 'low', dozen: 'first' },
	{ value: 4, color: 'black', parity: 'even', size: 'low', dozen: 'first' },
	{ value: 5, color: 'red', parity: 'odd', size: 'low', dozen: 'first' },
	{ value: 6, color: 'black', parity: 'even', size: 'low', dozen: 'first' },
	{ value: 7, color: 'red', parity: 'odd', size: 'low', dozen: 'first' },
	{ value: 8, color: 'black', parity: 'even', size: 'low', dozen: 'first' },
	{ value: 9, color: 'red', parity: 'odd', size: 'low', dozen: 'first' },
	{ value: 10, color: 'black', parity: 'even', size: 'low', dozen: 'first' },
	{ value: 11, color: 'black', parity: 'odd', size: 'low', dozen: 'first' },
	{ value: 12, color: 'red', parity: 'even', size: 'low', dozen: 'first' },
	{ value: 13, color: 'black', parity: 'odd', size: 'low', dozen: 'second' },
	{ value: 14, color: 'red', parity: 'even', size: 'low', dozen: 'second' },
	{ value: 15, color: 'black', parity: 'odd', size: 'low', dozen: 'second' },
	{ value: 16, color: 'red', parity: 'even', size: 'low', dozen: 'second' },
	{ value: 17, color: 'black', parity: 'odd', size: 'low', dozen: 'second' },
	{ value: 18, color: 'red', parity: 'even', size: 'low', dozen: 'second' },
	{ value: 19, color: 'red', parity: 'odd', size: 'high', dozen: 'second' },
	{ value: 20, color: 'black', parity: 'even', size: 'high', dozen: 'second' },
	{ value: 21, color: 'red', parity: 'odd', size: 'high', dozen: 'second' },
	{ value: 22, color: 'black', parity: 'even', size: 'high', dozen: 'second' },
	{ value: 23, color: 'red', parity: 'odd', size: 'high', dozen: 'second' },
	{ value: 24, color: 'black', parity: 'even', size: 'high', dozen: 'second' },
	{ value: 25, color: 'red', parity: 'odd', size: 'high', dozen: 'third' },
	{ value: 26, color: 'black', parity: 'even', size: 'high', dozen: 'third' },
	{ value: 27, color: 'red', parity: 'odd', size: 'high', dozen: 'third' },
	{ value: 28, color: 'black', parity: 'even', size: 'high', dozen: 'third' },
	{ value: 29, color: 'black', parity: 'odd', size: 'high', dozen: 'third' },
	{ value: 30, color: 'red', parity: 'even', size: 'high', dozen: 'third' },
	{ value: 31, color: 'black', parity: 'odd', size: 'high', dozen: 'third' },
	{ value: 32, color: 'red', parity: 'even', size: 'high', dozen: 'third' },
	{ value: 33, color: 'black', parity: 'odd', size: 'high', dozen: 'third' },
	{ value: 34, color: 'red', parity: 'even', size: 'high', dozen: 'third' },
	{ value: 35, color: 'black', parity: 'odd', size: 'high', dozen: 'third' },
	{ value: 36, color: 'red', parity: 'even', size: 'high', dozen: 'third' },
];


module.exports = { BICHO_BET_MULTIPLIER, TIME, JOGO_DO_BICHO, HOURLY_ROULETTE_HIGH_VALUE_BET_LIMIT, ROULETTE_NUMBERS };