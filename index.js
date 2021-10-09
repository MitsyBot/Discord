require('dotenv').config()

const Jeremias = require('./src/sharder/manager/Manager')
const cluster = new Jeremias()

cluster.start()
