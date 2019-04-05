import React, { Component } from 'react'
import '../Generell_CSS/Form.css'
import { Redirect } from 'react-router-dom'

export class logout extends Component {
    state = {
        redirect: false
    }

    logout = () => {
        localStorage.removeItem('token');
        this.setState( {
            redirect: true
        }) 
    }

    renderRedircet = () => {
        if(this.state.redirect){
            return <Redirect to='/users' />
        }
    }

  render() {
    return (
      <div>
        { this.renderRedircet() }
        <h1>You are now logging out</h1>        
        <button onClick={this.logout}>Logout</button>
      </div>
    )
  }
}

export default logout
