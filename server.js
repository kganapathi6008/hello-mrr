const express = require('express');
const bodyParser = require('body-parser');
const {Router} = require('express')
const { appPort } = require('./config.js');
const {appRoutes} = require('./userapi')
const cors = require('cors');
const router = Router();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(router.use(appRoutes));
app.listen(appPort, () => console.log(`server listening at port ${appPort}`));