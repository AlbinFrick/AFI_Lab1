//user related routs
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

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
	let username = req.body.user.username;
	const getUsernameString = "SELECT * FROM Users Where Username = ?"
	getConnection().query(getUsernameString, username, (err, results, fields) =>{
		if(err){
			console.log("Failed to get user: " + err);
			res.end();
		}
		if(results.length >= 1){
			res.send('That username already exists');
			res.status(409);
		} else {
			//Hashing the password with salt using bcrypt
			bcrypt.hash(req.body.user.password, 10, (err, hash) => {
				if (err) {
					return res.status(500)
				} else {
					const password = hash
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
				}
			})
		}
	})
})

router.post('/login', (req, res, next) => {
	let username = req.body.user.username;
	let password = req.body.user.password;
	const getUsernameString = "SELECT * FROM Users Where Username = ?"
	getConnection().query(getUsernameString, username, (err, results, fields) =>{
		if(err){
			console.log("Failed to get user: " + err);
			res.end();
		}
		if(results < 1){
			return res.status(401).json({
				message: 'Auth failed'
			})
		}
		bcrypt.compare(password, results[0].Password, (err, result) => {
			if(err) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			if(result) {
				console.log(username + " logged in")
				const token = jwt.sign({
					username: results[0].Username,
					userId: results[0].ID
				}, 
				process.env.JWT_KEY, 
				{
					expiresIn: "1h"
				});
				return res.status(200).json({
					message: 'Auth successful',
					token: token 
				})
			}
			return res.status(401).json({
				message: 'Auth failed'
			})
		})

	})
})

//Delete one given user
router.delete("/user_delete", checkAuth, (req, res) =>{
	const userID = req.body.user.ID
	const username = req.body.user.username
	const queryString = "DELETE FROM Users WHERE ID = ?"
	getConnection().query(queryString, userID, (err, results, fields) =>{
		if(err){
			console.log("Failed to delete user: " + err);
			res.sendStatus(500);
			return;
		}
			console.log(username + " was deleted with id " + userID)
			res.end()
	})
})

//Update an existing user
router.put("/user_update", checkAuth, (req, res) =>{
	const username = req.body.user.username
	const userID = req.body.user.id
	const queryString = "UPDATE Users SET Username = ? WHERE ID = ?"
	getConnection().query(queryString,[username, userID], (err, results, fields) =>{
		if(err){
			console.log("Failed to update user: " + err);
			res.sendStatus(500);
			return;
		}
		console.log(username + " was updated with id " + userID)
		res.end()
	})
})

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

//Get one user by id as param
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