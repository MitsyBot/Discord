module.exports = {
	MITSY_COLOR: '#F895FB',
	GUILD_LOST_COLOR: '#BD4351',
	GUILD_ADDED_COLOR: '#41A57A',
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

module.exports = { BICHO_BET_MULTIPLIER, JOGO_DO_BICHO };