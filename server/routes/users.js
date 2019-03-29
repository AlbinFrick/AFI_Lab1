//user related routs
const mysql = require('mysql')
const express = require('express')
const router = express.Router()

//Establish connection to database
function getConnection() {
	return mysql.createPool({
        connectionLimit: 10,
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'greatreads'
	});
}

//Add a user to the database
router.post("/user_create", (req, res) =>{
	const username = req.body.create_username
	const password= req.body.create_password
	console.log(username)
	const queryString = "INSERT INTO Users (Username, Password) values (?,?)"
	getConnection().query(queryString, [username, password], (err, results, fields) =>{
		if(err){
			console.log("Failed to insert new user: " + err);
			res.sendStatus(500);
			return;
		}
		console.log("Inserted a new user with id" + results.insertId)
		res.end()
	})
})

/*router.delete("/user_delete", (req, res) =>{
	const username = req.body.create_username
	const password= req.body.create_password
	console.log(username)
	const queryString = "INSERT INTO Users (Username, Password) values (?,?)"
	getConnection().query(queryString, [username, password], (err, results, fields) =>{
		if(err){
			console.log("Failed to insert new user: " + err);
			res.sendStatus(500);
			return;
		}
		console.log("Inserted a new user with id" + results.insertId)
		res.end()
	})
})*/

//Show all users
router.get("/users", (req, res) =>{
	const queryString = "SELECT * FROM Users"
	getConnection().query(queryString, (err, rows, fields) =>{
		if(err){
			console.log("Failed to query for users: " + err);
			res.sendStatus(500);
			res.end();
			return;
		}
		console.log("I think we fetched users successfully")
		res.json(rows)
	});	
});

router.get("/users/:id", (req, res) =>{
	console.log("Fetching user with id: " + req.params.id)	
	const userID = req.params.id;
	const queryString = "SELECT * FROM Users WHERE ID = ?"
	getConnection().query(queryString, [userID], (err, rows, fields) =>{
		if(err){
			console.log("Failed to query for users: " + err);
			res.sendStatus(500);
			res.end();
			return;
		}
		console.log("I think we fetched users successfully")
		//Custom formatting for rows.
		const users = rows.map((row) =>{
			return{
				id: row.ID,
				User: row.Username
			}
		})
		res.json(users)
	});
});

module.exports = router