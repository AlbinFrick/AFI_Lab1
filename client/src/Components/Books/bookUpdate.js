import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import '../Generell_CSS/Form.css'
import Navbar from '../Navbar/Navbar'
import Loading from '../../Images/loading.gif'

class bookUpdate extends Component {
   
    state = {
        Author: '',
        Title: '',
        id: '',
        redirect: false,
        ErrorMessage: ''
    }

    componentDidMount() {
        const { book } = this.props.location.state
        console.log(book);
        this.setState({
            id: book.ID,
            Author: book.Author,
            Title: book.Title
        })
    }
    
    handleTitleChange = (e) => {
        this.setState({
            Title: e.target.value
        })
    }

    handleAuthorChange = (e) => {
        this.setState({
            Author: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
       
        const book = {
            author: this.state.Author,
            title: this.state.Title,
            id: this.state.id
        }
        const token = localStorage.getItem('token');
        axios.put('/book_update', { book, token })
            .then(res => {
                console.log(res.data)
                this.setState({
                    redirect: true
                })
            }).catch(err => {
                console.log(err)
                this.setState({
                    ErrorMessage: 'You need to be logged in to edit a book'
                })
            })
    }
    
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/books' />
        }
    }

    render() {
        const updateForm = this.state.Author ? (
            <div className="FormComp">
                <h1>Update Book</h1>
                <p>Change the title and/or the author and hit "Update" to update the book</p>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={this.handleTitleChange} placeholder={this.state.Title} className="input1" />    
                    <input type="text" onChange={this.handleAuthorChange} placeholder={this.state.Author} className="input2" />    
                    <button type="submit">Update</button>
                </form>
            </div>
        ) :(
            <div>
                <img src={Loading} alt="loading"/>
            </div>
        )

        return (
            <div>
                <Navbar />
                <div className="FormComp">
                    {this.renderRedirect()}
                    { updateForm }   
                    <div className="errorContainer">
                        <p>{ this.state.ErrorMessage }</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default bookUpdate

