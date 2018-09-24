import React from 'react';
import { Redirect } from 'react-router-dom';
import '../style.css';
import {isLogged } from '../base/base.config';

class Logout extends React.Component {

    userModel = { username: '', password: ''}

    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            user: this.userModel,
            redirect: false
        }
    }

    LogOut = () => {
        localStorage.clear();
        return(<Redirect to= {'/login'} />)
    }
   
    render() {
        this.LogOut();
        if(!isLogged()){
            return(<Redirect to= {'/login'} />)
        }
        return (
            <div class="outer-wrapper">
                Logout
            </div>
        )
    }
}

export default Logout;

