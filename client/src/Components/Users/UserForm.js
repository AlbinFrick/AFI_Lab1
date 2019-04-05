import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import '../Generell_CSS/Form.css'
import Navbar from '../Navbar/Navbar'

const initialState = {
    username: '',
    password: '',
    redirect: false,
    usernameErr: '',
    passwordErr: ''
}

class UserForm extends Component {
    state = initialState; 
    
    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    validate = () => {
        let { username, password} = this.state;
        let usernameErr = '';
        let passwordErr = '';
        
        if(!username)
            usernameErr = 'You must choose a username';
        
        
        if(username.length < 5)
            usernameErr = 'Username must be greater than 5'
        

        if(!password) 
            passwordErr = 'You must fill in a password';
        
        if(password.length < 8)
            passwordErr = 'The password must be greateer then 8';

        this.setState({ usernameErr, passwordErr });
        if(usernameErr || passwordErr) {
            return false;
        }
        return true;
    }


    handleSubmit = (e) => {
        e.preventDefault();
        const isValid =  this.validate();
        if (isValid){
           
            const { username, password} = this.state;
            const user = {
                username: username,
                password: password
            }
            axios.post('/user_create', { user })
                .then(res => {
                    this.setState({ usernameErr: res.data});
                    if(!res.data){
                        this.setState({ redirect: true});
                    }
                }).catch(err => {
                    console.log(err)
                });
           
        }
        
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/users' />
        }
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="FormComp">
                {this.renderRedirect()}
                <h1>Add User</h1>
                <p>Type in a username and a password to create a new user</p>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={this.handleUsernameChange} placeholder="Username" className="input1" />    
                    <div id="input1Error" className="inputError">{ this.state.usernameErr }</div>
                    <input type="password" onChange={this.handlePasswordChange} placeholder="Password" className="input2" />    
                    <div id="input2Error" className="inputError">{ this.state.passwordErr }</div> 
                    <button type="submit">Add User</button>
                </form>
            </div>
            </div>

        )
    }
}

export default UserForm