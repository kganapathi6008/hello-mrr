const express = require('./express');
const { appPort } = require('./config.js');
var app = express();
app.listen(appPort, () => console.log(`server listening at port ${appPort}`));

