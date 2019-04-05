import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import '../Generell_CSS/Form.css'
import Loading from '../../Images/loading.gif'
import Navbar from '../Navbar/Navbar';

class UserUpdate extends Component {
   
    state = {
        Username: '',
        PasswordError: '',
        id: '',
        redirect: false,
        ErrorMessage: ''
    }

    componentDidMount() {
        const { selectedUser } = this.props.location.state
        this.setState({
            id: selectedUser.ID,
            Username: selectedUser.Username,
            Password: selectedUser.Password
        })
    }
    
    handleUsernameChange = (e) => {
        this.setState({
            Username: e.target.value
        })
    }

    handleClick = () => {
        this.setState({
            PasswordError: 'you cannot change the password'
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            username: this.state.Username,
            id: this.state.id
        }
        const token = localStorage.getItem('token')
        axios.put('/user_update', { user, token })
            .then(res => {
                console.log(res.data)
                this.setState({
                    redirect: true
                })
            }).catch(err => {
                console.log(err)
                this.setState({
                    ErrorMessage: 'You need to be logged in to edit a user'
                })
            })
    }
    
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/users' />
        }
    }

    render() {
        const updateForm = this.state.Username ? (
            <div className="FormComp">
                <h1>Update User</h1>
                <p>Change username and/or password and hit "Update" to update the user</p>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={this.handleUsernameChange} 
                        placeholder={this.state.Username} className="input1" />    
                    <input type="password" onClick={this.handleClick}
                        placeholder="***********" className="input2" readOnly />    
                    <div id="input2Error" className="inputError">{this.state.PasswordError}</div>
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

export default UserUpdate

