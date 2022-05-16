var operations = require('./userapi');
module.exports = function(app) {
    app.post('/crud/api/insert', operations.insert);
    app.post('/crud/api/delete', operations.delete);
    app.post('/crud/api/select', operations.select);
    app.post('/crud/api/update', operations.update);
}