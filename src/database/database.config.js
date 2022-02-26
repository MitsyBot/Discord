const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connect = async () => {
	try {
		await prisma.$connect();
		return prisma;
	}
	catch (e) {
		return e;
	}
};

module.exports = { connect };