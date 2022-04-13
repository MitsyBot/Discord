// const { HTTPrequests } = require('../');
const { BICHO_BET_MULTIPLIER, JOGO_DO_BICHO } = require('../utils/Constants');

const betType = (option) => {
	if (/^(?=.*\d)[\d ]+$/.test(option)) {
		const withoutBlank = option.replace(/\s/g, '');
		if (withoutBlank.length === 4) return 'thousand';
		if (withoutBlank.length === 3) return 'hundred';
		if (withoutBlank.length === 2) return 'ten';
		return 'unity';
	}

	const selectedAnimals = option.split(' | ');

	if (selectedAnimals.length === 5) return 'corner';
	if (selectedAnimals.length === 2) return 'sequence';
	return 'animal';
};

const GAME_DURATION = 1000 * 60 * 60 * 5;

const getResults = () => {
	const results = [];

	for (let i = 0; i < 4; i++) results.push(Math.floor(Math.random() * 10));

	return results;
};

module.exports = class JogoDoBichoManager {

	constructor(client) {
		this.clientInstance = client;

		if (this.clientInstance.shard.ids.includes(0)) {
			this.ongoingGame = {
				dueDate: Date.now() + GAME_DURATION,
				bets: [],
				results: [],
				biggestProfit: 0,
			};
			this.gameLoop = setInterval(() => {
				this.finishGame();
			}, GAME_DURATION);
		}
	}

	static makeWinners(game) {
		const didUserWin = (option, bet) => {
			switch (bet) {
			case 'unity':
				return game.results.some((a) => `${a[3]}` === option);
			case 'ten':
				return game.results.some((a) => `${a[2]}${a[3]}` === option);
			case 'hundred':
				return game.results.some((a) => `${a[1]}${a[2]}${a[3]}` === option);
			case 'thousand':
				return game.results.some((a) => `${a[0]}${a[1]}${a[2]}${a[3]}` === option);
			case 'animal': {
				const animals = game.results.map((a) => {
					const ten = Number(`${a[2]}${a[3]}`);
					return JOGO_DO_BICHO[Math.floor(ten / 4)];
				});
				return animals.some((a) => a === option);
			}

			case 'corner': {
				const animals = game.results.map((a) => {
					const ten = Number(`${a[2]}${a[3]}`);
					return JOGO_DO_BICHO[Math.floor(ten / 4)];
				});
				const userChoices = option.split(' | ');
				return animals.every((a) => userChoices.includes(a));
			}
			case 'sequence': {
				const animals = game.results.map(
					(a) => JOGO_DO_BICHO[Math.floor(Number(`${a[2]}${a[3]}`) / 4)],
				);
				const user = option.split(' | ');
				const hasTwoAnimals = animals.every((a) => user.includes(a));
				if (!hasTwoAnimals) return false;

				const firstIndex = animals.indexOf(user[0]);
				const secondIndex = animals.indexOf(user[1]);

				return firstIndex < secondIndex;
			}
			}
		};

		return game.bets.map ((player) => ({
			didWin: didUserWin(player.option, betType(player.option)),
			id: player.id,
			value: player.bet * BICHO_BET_MULTIPLIER[betType(player.option)],
			gameId: player.gameId,
		}));
	}

	finishGame() {
		if (this.clientInstance.shard.ids.includes(0)) {
			const results = [getResults(), getResults(), getResults(), getResults(), getResults()];

			this.ongoingGame.results = results;
			this.lastGame = this.ongoingGame;
			this.ongoingGame = {
				dueDate: Date.now() + GAME_DURATION,
				bets: [],
				results: [],
				biggestProfit: 0,
			};

			const winners = JogoDoBichoManager.makeWinners(this.lastGame);
			winners
				.filter((a) => a.didWin)
				.forEach((a) => {
					this.clientInstance.repositories.starRepository.add(a.id, a.value);
					// if (a.gameId) HTTPrequests.userWinBicho(a.gameId);
					if (this.lastGame && a.value > this.lastGame?.biggestProfit) {this.lastGame.biggestProfit = a.value;}
				});
		}
		else {
			this.clientInstance.shard.broadcastEval(
				(c) => {
					c.jogoDoBichoManager.finishGame();
				},
			);
		}
	}

	async canRegister(userId) {
		if (this.clientInstance.shard.ids.includes(0)) {
			if (this.ongoingGame.dueDate < Date.now()) return false;
			if (this.ongoingGame.bets.some((plr) => plr.id === userId)) return false;
			return true;
		}
		return this.clientInstance.shard.broadcastEval(
			(c, { id }) => c.jogoDoBichoManager.canRegister(id),
		);
	}

	/* async apiRegisterGame(
		userId,
		value,
		gameBetType,
		betSelection,
	) {
		const gameId = await HTTPrequests.postBichoGame(userId, value, gameBetType, betSelection);

		if (!gameId) return;

		const bet = this.ongoingGame.bets.find((a) => a.id === userId);

		if (bet) bet.gameId = gameId.gameId;
	} */

	addBet(userId, betValue, optionSelected) {
		if (this.clientInstance.shard.ids.includes(0)) {
			this.ongoingGame.bets.push({ id: userId, bet: betValue, option: optionSelected });
			// this.apiRegisterGame(userId, betValue, betType(optionSelected), optionSelected);
		}
		else {
			this.clientInstance.shard.broadcastEval(
				(c, { id, bet, option }) => {
					c.jogoDoBichoManager.addBet(id, bet, option);
				},
			);
		}
	}

	async lastGameStatus() {
		if (this.clientInstance.shard.ids.includes(0)) {
			return this.lastGame;
		}
		return this.clientInstance.shard.broadcastEval(
			(c) => c.jogoDoBichoManager.lastGame,
		);
	}

	async currentGameStatus() {
		if (this.clientInstance.shard.ids.includes(0)) {
			return this.ongoingGame;
		}
		return this.clientInstance.shard.broadcastEval(
			(c) => c.jogoDoBichoManager.ongoingGame,
		);
	}

	async stopGameLoop() {
		if (this.clientInstance.shard.ids.includes(0)) {
			clearInterval(this.gameLoop);

			let totalBets = [...this.ongoingGame.bets.keys()].length;

			await new ((resolve) => {
				if (totalBets <= 0) resolve();
				this.ongoingGame.bets.forEach((a) => {
					this.clientInstance.repositories.starRepository.add(a.id, a.bet).then(() => {
						totalBets -= 1;
						if (totalBets <= 0) resolve();
					});
				});
			});

			this.ongoingGame = {
				dueDate: 0,
				bets: [],
				results: [],
				biggestProfit: 0,
			};
		}
		else {
			await this.clientInstance.shard.broadcastEval(
				async (c) => c.jogoDoBichoManager.stopGameLoop(),
			);
		}
	}

	restartGameLoop() {
		if (this.clientInstance.shard.ids.includes(0)) {
			this.ongoingGame = {
				dueDate: Date.now() + GAME_DURATION,
				bets: [],
				results: [],
				biggestProfit: 0,
			};
			this.gameLoop = setInterval(() => {
				this.finishGame();
			}, GAME_DURATION);
		}
		else {
			this.clientInstance.shard.broadcastEval(
				(c) => {
					c.jogoDoBichoManager.restartGameLoop();
				},
			);
		}
	}
};