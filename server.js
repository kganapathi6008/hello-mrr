const express = require('./express');
const { dbConfig, appPort } = require('./config.js');
const { Client } = require('pg')
var app = express();

app.listen(appPort, () => console.log(`server listening at port ${appPort}`));

const client = new Client(dbConfig);
client.connect()
    .then(() => console.log('Database Connection Successful'))
    .catch((err) => console.log('Error while connecting database', { err }));

module.exports = { app, client };
