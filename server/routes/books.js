//book related routes.
const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const checkAuth = require('../middleware/check-auth');

function getConnection() {
	return mysql.createPool({
        connectionLimit: 10,
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'greatreads'
	});
}

router.use(bodyParser.urlencoded({
	extended: true
}));

router.use(bodyParser.json());

router.post("/book_insert", checkAuth, (req, res) =>{
	const title = req.body.book.Title
	const author = req.body.book.Author
	const queryString = "INSERT INTO Books (Title, Author) values (?,?)"
	if(title || author){
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
	}else{
		console.log("Title or/and author cannot be null")
	}

})

router.delete("/book_delete", checkAuth, (req, res) =>{
	const bookID = req.body.book.ID
	const bookTitle = req.body.book.Title
	const bookAuthor = req.body.book.Author
	const queryString = "DELETE FROM Books WHERE ID = ?"
	getConnection().query(queryString, bookID, (err, results, fields) =>{
		if(err){
			console.log("Failed to delete "+ bookTitle 
					+" by "+ bookAuthor +" with id: " + err);
			res.sendStatus(500);
			return;
		}
		console.log("Deleted "+ bookTitle 
					+" by "+ bookAuthor +" with id " + bookID)
	})
	res.send(bookTitle + " by " + bookAuthor + " with the id: " + bookID + " was deleted")		
	res.end()
})

router.put("/book_update", checkAuth, (req, res) =>{
	const bookTitle = req.body.book.title
	const bookAuthor = req.body.book.author
	const bookID = req.body.book.id
	if(bookAuthor || bookID || bookTitle){
		const queryString = "UPDATE Books SET Title = ?, Author = ? WHERE ID = ?"
		getConnection().query(queryString, [bookTitle, bookAuthor, bookID], (err, results, fields) =>{
			if(err){
				console.log("Failed to update book by id: " + err);
				res.sendStatus(500);
				return;
			}
			console.log("Update book with id " + bookID)
		})
		res.send("The book with the id: " + bookID + " is updated")		
		res.end()
	}
	res.send("Author, Title, or id was null")
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