var mysql = require('mysql');
var dbconfig = require('./config.js');
var moment = require('moment');
const { client } = require('./server')


module.exports.insert = (req, res) => {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email_id = req.body.email_id;
    var phone_no = req.body.phone_no;
    var gender = req.body.gender;
    var date_of_birth = req.body.date_of_birth;

    let query = `insert into crud (first_name, last_name, email_id, phone_no, gender, date_of_birth) values ('${first_name}', '${last_name}', '${email_id}',${phone_no}, '${gender}', '${date_of_birth}')`;

    console.log(query);
    client.query(query, (error, result) => {
        if (error) {
            res.send({
                "code": 204,
                "data": result
            })

        } else {
            res.send({
                "code": 200,
                "data": result
            })
        }
        console.log(result.affectedRows + ' rows affected');
    });
    con.end();
}

module.exports.delete = (req, res) => {
    var email_id = req.body.email_id;

    let query = `delete from crud where  email_id = '${email_id}'`;
    console.log(query);

    client.query(query, (error, result) => {
        if (error) {
            throw error;
        } else {
            res.send({
                "code": 200,
                "data": result
            })
        }
        console.log(result.affectedRows + ' rows deleted');

    });

    con.end();

}

module.exports.select = (req, res) => {
    let query = `select * from crud`;
    console.log(query);

    client.query(query, (error, result) => {
        if (error) {
            throw result;
        } else {
            res.send({
                "code": 200,
                "data": result
            })
        }
        console.log(result);
    });
    con.end();
}

module.exports.update = (req, res) => {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email_id = req.body.email_id;
    var phone_no = req.body.phone_no;
    var gender = req.body.gender;
    var date_of_birth = req.body.date_of_birth;

    let query = `update crud 
        set first_name = '${first_name}', last_name = '${last_name}', email_id = '${email_id}', phone_no = '${phone_no}', gender = '${gender}', date_of_birth = '${date_of_birth}'
           where  email_id = '${email_id}'`;
    console.log(query);
    client.query(query, (error, result) => {
        if (error) {
            throw error;
        } else {
            res.send({
                "code": 200,
                "data": result
            })
        }
        console.log(result.affectedRows + ' rows updated');
    });
    con.end();
}