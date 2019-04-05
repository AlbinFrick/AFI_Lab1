import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Books from './Components/Books/books';
import BookForm from './Components/Books/bookForm';
import Users from './Components/Users/Users';
import UserForm from './Components/Users/UserForm';
import BookUpdate from './Components/Books/bookUpdate'
import UserUpdate from './Components/Users/UserUpdate'
import Login from './Components/login/login'
import Logout from './Components/logout/logout'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path='/' component={Navbar} />
          <Route path='/books' component={Books} />
          <Route path='/addBook' component={BookForm} />
          <Route path='/bookUpdate' component={BookUpdate} />
          <Route path='/users' component={Users} />
          <Route path='/addUser' component={UserForm} />
          <Route path='/userUpdate' component={UserUpdate} />
          <Route path='/login' component={Login} />
          <Route path='/logout' component={Logout} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
