import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../../Images/loading.gif';
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar';

export class Users extends Component {
    state = {
        Users: null,
        UsersExist: 0,
        UserID: '',
        ErrorMessage: ''
    }

    componentDidMount() {
        axios.get('/users').then(res => {
            this.setState({ Users: res.data });
            if (this.state.Users.length < 1) {
                this.setState({ UsersExist: -1 })
            }
            else {
                this.setState({ UsersExist: 1 })
            }
        });
    }

    ifNoUsersInList = () => {
        let int = this.state.UsersExist
        if (int === -1) {
            return (
                <div className="errMessage">
                    <p>No users to show</p>
                </div>
            )
        }
    }

    handleDelete = (selectedUser) => {
        const user = {
            ID: selectedUser.ID,
            username: selectedUser.username
        }
        const token = localStorage.getItem('token')
        axios.delete('/user_delete/', { data: { user, token } })
            .then(res => {
                axios.get('/users').then(res => {
                    this.setState({ Users: res.data });
                });
            }).catch(err => {
                this.setState({
                    ErrorMessage: 'To delete a user you must be logged in'
                })
            })
    }


    render() {
        const userList = this.state.Users ? (
            <ul>
                {this.state.Users.map(selectedUser =>
                    <div key={selectedUser.ID} className="listButtonContainer">
                        <li>{selectedUser.Username}</li>
                        <button onClick={() => this.handleDelete(selectedUser)}>Delete</button>
                        <Link to={{
                            pathname: '/userUpdate',
                            state: {
                                selectedUser
                            }
                        }}>
                            <button>Edit</button>
                        </Link>
                    </div>
                )}
            </ul>
        ) : (
                <div>
                    <img src={Loading} alt="loading" />
                </div>
            )

        return (
            <div>
                <Navbar />
                <div className="ListComp">
                    <h2>Users</h2>
                    {this.ifNoUsersInList()}
                    {userList}
                    <div className="errorContainer">
                        <p>{this.state.ErrorMessage}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Users;

