import React, { Component } from 'react'
import axios from 'axios';
import '../Generell_CSS/List.css';
import Loading from '../../Images/loading.gif';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

export class Books extends Component {
    constructor() {
        super();
        this.state = {
            books: null,
            bookID: '',
            BooksExist: 0,
            ErrorMessage: ''
        }
    }

    componentDidMount() {
        axios.get('/books').then(res => {
            this.setState({books: res.data});
            this.state.books.length < 1 ? (
                this.setState({ BooksExist: -1 })
            ):(
                this.setState({ BooksExist: 1 })
            )
        });
    }
    
    ifNoBooksInList = () => {
        let int = this.state.BooksExist
        if( int === -1){
           return(
               <div className="errMessage">
                   <p>No books to show</p>
               </div>
           )
        }
    }    

    handleSubmit = (selectedBook) => {
        const book = {
            ID: selectedBook.ID,
            Title: selectedBook.Title,
            Author: selectedBook.Author,
        }
        const token = localStorage.getItem('token')
        axios.delete('/book_delete/', { data: { book, token } })
            .then(res =>{
                console.log(res);
                console.log(res.data);
                axios.get('/books').then(res => {
                    this.setState({books: res.data});
                });
            }).catch(err => {
                this.setState({
                    ErrorMessage: 'To delete a user you must be logged in'
                })
            })
    }

    render() {

        const bookList = this.state.books ? (
            <ul>
                {this.state.books.map(book => 
                    <div key={book.ID} className="listButtonContainer">
                        <li>{book.Title} by {book.Author}</li>
                        <button onClick={() => this.handleSubmit(book)}>Delete</button>
                        <Link to={{
                            pathname: '/bookUpdate',
                            state: {
                                book
                            }
                        }}>
                            <button>Edit</button>
                        </Link>
                    </div>
                )}
            </ul>
        ) :(
           <div>
              <img src={Loading} alt="loading"/> 
           </div> 
        )

        return (
            <div>
                <Navbar />
                <div className="ListComp">
                    <h2>Books</h2> 
                    { this.ifNoBooksInList() }
                    { bookList } 
                    <div className="errorContainer">
                        <p>{ this.state.ErrorMessage }</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Books;
