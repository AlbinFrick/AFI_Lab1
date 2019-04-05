import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

class Navbar extends Component {
    state = {
        loggedin: false
    }

    componentDidMount() {
        if(localStorage.getItem('token')){
            this.setState({ loggedin: true })
        }
    }

    renderLogged = () => {
        return this.state.loggedin ? (
                <p>LOGGED IN</p> 
            ):(
                <p>NOT LOGGED IN</p>
            )
    }

    renderLoginLogoutButton = () => {
        return this.state.loggedin ? (
            <Link to="/logout">Logout</Link>
        ):(
            <Link to="/login">Login</Link>
        )
    }

    render(){
        return(
            <nav className="navbar">
            <div className="logologged">
                <h1>Greatreads</h1>
                { this.renderLogged() }
            </div>
            <ul>
                <li><Link to="/books">Books</Link></li>
                <li><Link to="/addBook">Add Book</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/addUser">Add User</Link></li>
                <li>{ this.renderLoginLogoutButton() }</li>
            </ul> 
            </nav>
        )
    }
}

export default Navbar
