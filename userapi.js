var {dbConfig} = require('./config.js');
const { Pool } = require('pg');
const {Router} = require('express');
const router = Router();

// const connectionString = 'postgresql://postgres:postgres1234@34.122.177.223:5432/crud';
const connectionString = process.env['DEV_DB_URL'];
const pool = new Pool({connectionString});


router.post('/api/insert', async (req, res) => {
    const {FirstName, LastName, Email, Phone, Address} = req.body;

    let query = `insert into crud (FirstName, LastName, Email, Phone, Address) values ('${FirstName}', '${LastName}', '${Email}',${Phone}, '${Address}')`;
    console.log(query);
    try {
        const result = await pool.query(query);
        console.log(result.fields)
        console.log(`Inserted ${result.rowCount} row`);
        res.json({isSuccess: true, message: 'Inserted record successfully'});
    } catch(e) {
        console.log('error while inserting data', {e});
        res.json(e);
    }
})

router.post('/api/deleteEmployeeById', async (req, res) => {
    var {employeeId} = req.query;

    let query = `delete from crud where id = '${employeeId}'`;
    console.log(query);

    try {
        const result = await pool.query(query);
        console.log('delete', result)
        console.log(`Deleted ${result.rowCount} row`);
        res.json({isSuccess: true, message: `Deleted record with id:${employeeId} successfully`});
    } catch(e) {
        console.log('error while delete employee', {e});
        res.json(e);
    }

})

router.get('/api/select', async (req, res) => {
    console.log('database url$$$$$$', connectionString)
    let query = `select * from crud`;
    console.log(query);

    try {
        const result = await pool.query(query);
        console.log('select', result)
        res.json(result.rows);
    } catch(e) {
        console.log('error while fetching data', {e});
        res.json(e);
    }
})


router.get('/', async (req, res) => {
    const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send();
	}

    
})

router.get('/api/getEmployeeDetailById', async (req, res) => {
    const {employeeId} = req.query;
    let query = `select * from crud where id=${employeeId}`;
    console.log(query);

    try {
        const result = await pool.query(query);
        console.log('selectById', result)
        res.json(result.rows);
    } catch(e) {
        console.log(`error while fetching data by id ${employeeId}`, {e});
        res.json(e);
    }
})

router.post('/api/updateEmployeeById', async (req, res) => {
    const {Id, FirstName, LastName, Email, Phone, Address} = req.body;

    let query = `update crud 
        set FirstName = '${FirstName}', LastName = '${LastName}', Email = '${Email}', Phone = '${Phone}', Address = '${Address}'
           where  id = '${Id}'`;
    console.log(query);
    try {
        const result = await pool.query(query);
        console.log(result.fields)
        console.log(`Update ${result.rowCount} row`);
        res.json({isSuccess: true, message: `Updated record with id:${Id} successfully`});
    } catch(e) {
        console.log(`error while updating data by id ${Id}`, {e});
        res.json(e);
    }
})

module.exports.appRoutes= router;