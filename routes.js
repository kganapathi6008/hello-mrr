var operations = require('./userapi');
module.exports = function(app) {
    app.post('/api/insert', operations.insert);
    app.post('/api/deleteEmployeeById', operations.delete);
    app.get('/api/select', operations.select);
    app.get('/api/getEmployeeDetailById', operations.selectById);
    app.post('/api/updateEmployeeById', operations.update);
}