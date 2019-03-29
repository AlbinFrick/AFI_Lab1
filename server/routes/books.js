//book related routes.
const mysql = require('mysql')
const express = require('express')
const router = express.Router()

function getConnection() {
	return mysql.createPool({
        connectionLimit: 10,
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'greatreads'
	});
}

router.post("/book_insert", (req, res) =>{
	const title = req.body.create_title
	const author = req.body.create_author
	const queryString = "INSERT INTO Books (Title, Author) values (?,?)"
	getConnection().query(queryString, [title, author], (err, results, fields) =>{
		if(err){
			console.log("Failed to insert new book: " + err);
			res.sendStatus(500);
			return;
		}
		console.log("Inserted a new book with id" + results.insertId)
	})
	res.send("The book '" + title + "' by '"+ author +"' has been inserted into the database")		
	res.end()
})

router.get("/books", (req, res) =>{
	const queryString = "SELECT * FROM Books"
	getConnection().query(queryString, (err, rows, fields) =>{
		if(err){
			console.log("Failed to query for books: " + err);
			res.sendStatus(500);
			return;
		}
		console.log("Fetched books in database")
		res.json(rows)
	});	
});

router.get("/books/:id", (req, res) =>{
	const bookID = req.params.id;
	const queryString = "SELECT * FROM Books WHERE ID = ?"
	getConnection().query(queryString, [bookID], (err, rows, fields) =>{
		if(err){
			console.log("Failed to query for boos: " + err);
			res.sendStatus(500);
			return;
		}
		console.log("Fetched book by id")
		//Custom formatting for rows.
		const users = rows.map((row) =>{
			return{
				ID: row.ID,
				Title: row.Title,
				Author: row.Author
			}
		})
		res.json(users)
	});	
});

module.exports = router