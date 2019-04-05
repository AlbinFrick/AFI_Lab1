import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import '../Generell_CSS/Form.css'

export class login extends Component {
    state = {
        username: '',
        password: '',
        redirect: false
    }

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

    handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        const user = {
            username: username,
            password: password,
            error: ''
        }
        axios.post('/login', { user })
            .then(res => {
                localStorage.setItem('token', res.data.token)
                if(res.data.token){
                    
                    this.setState({ redirect: true })
                }
            }).catch(err => {
                this.setState({ error: err.message })
            });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/users' />
        }
    }

    render() {
        return (
            <div className="FormComp">
                {this.renderRedirect()}
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={this.handleUsernameChange} placeholder="Username" className="input1" />    
                    <input type="password" onChange={this.handlePasswordChange} placeholder="Password" className="input2" />    
                    <button type="submit">Login</button>
                </form>
                { this.state.error }
            </div>
        )
    }
}

export default login
