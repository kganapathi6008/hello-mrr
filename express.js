var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

module.exports = function(app) {
    var app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(express.static('./public'));
        require('./routes')(app);
    return app;
}