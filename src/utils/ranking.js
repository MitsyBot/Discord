async function fetchGlobalRank(id, client) {
	const list = await client.leaderboard.fetch();
	const rank = list.get(id);
	return rank ? rank.position : list.size;
}

module.exports = { fetchGlobalRank };