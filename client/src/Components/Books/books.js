import React, { Component } from 'react'

export class Books extends Component {
    constructor() {
        super();
        this.state = {
            books: []
        }
    }

    componentDidMount() {
        fetch('/books')
          .then(res => res.json())
          .then(books => this.setState({
              books
          }, () => {
              console.log('Books fetched..', books)
          }));
    }

    render() {
        return (
        <div>
        <h2>Books</h2> 
        <ul>
            {this.state.books.map(book => 
                <li key={book.ID}>{book.Title} : {book.Author}</li>
            )}
        </ul>

        </div>
        )
    }
}

export default Books;
