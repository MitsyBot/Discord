const mongoose = require('mongoose');

function connect() {
	mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
		if (err) {
			return console.log(`[DATABASE] Não foi possível se conectar a database: ${err}`);
		}

		console.log('[DATABASE] Conectado a database');
	});
}

module.exports = { connect };