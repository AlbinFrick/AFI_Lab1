import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import '../Generell_CSS/Form.css'
import Navbar from '../Navbar/Navbar'

const initailState = {
    author: '',
    title: '',
    redirect: false,
    titleErr: '',
    authorErr: '',
    ErrorMessage:''
}

class bookForm extends Component {
    state = initailState;

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    handleAuthorChange = (e) => {
        this.setState({
            author: e.target.value
        })
    }
    
    validate = () => {
        const { title, author} = this.state
        let titleErr = "";
        let authorErr = "";

        if(!title)
            titleErr = 'The book must have a title';
        
        if(!author)
            authorErr = 'The book must have an author';

        if(titleErr || authorErr){
            this.setState({ titleErr, authorErr });
            return false;
        }  

        return true;
    }
    

    handleSubmit = (e) => {
        e.preventDefault();
        const isValid = this.validate();
        if(isValid){
            const { author, title} = this.state
            const book = {
                Author: author,
                Title: title
            }
            const token = localStorage.getItem('token')
            axios.post('/book_insert', { book, token })
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        redirect: true
                    })
                }).catch(err => {
                    console.log(err)
                    this.setState ({
                        ErrorMessage: 'You need to be logged in to add a book'
                    })
                })
        }

    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/books' />
        }
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="FormComp">
                    {this.renderRedirect()}
                    <h1>Add Book</h1>
                    <p>Type in a tile and an author and hit "Add Book" to add a new book</p>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" onChange={this.handleTitleChange} placeholder="Title" className="input1" />   
                        <div id="input1Error" className="inputError" >{ this.state.titleErr }</div>
                        <input type="text" onChange={this.handleAuthorChange} placeholder="Author" className="input2" />    
                        <div id="input2Error" className="inputError" >{ this.state.authorErr }</div>
                        <button type="submit">Add Book</button>
                    </form>
                    <div className="errorContainer">
                        <p>{ this.state.ErrorMessage }</p>
                    </div>
                </div>
            </div>

        )
    }
}

export default bookForm
