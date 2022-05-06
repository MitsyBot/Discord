async function fetchGlobalRank(resolvable, client) {
	const id = client.users.resolveId(resolvable);
	if (id === null) throw new TypeError(`Cannot resolve ${resolvable} to a User.`);
	const list = await client.leaderboard.fetch();
	const rank = list.get(id);
	return rank ? rank.position : list.size;
}

module.exports = { fetchGlobalRank };