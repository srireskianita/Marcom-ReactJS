import React from 'react';
import { Button, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import axios from 'axios';
import DialogActions from '@material-ui/core/DialogActions';
import { Redirect } from 'react-router-dom';
import { config, isLogged } from '../base/base.config';


import Validation from '../base/base.validation';

class Login extends React.Component {

    userModel = { username: '', password: '' }

    errModel = {
        usernameError: '',
        passwordError: '',
        loginError: '',
    }
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            user: this.userModel,
            redirect: false,
            errors: this.errModel,
        }

        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount() {
        localStorage.getItem('userData') && this.setState({
            userData: JSON.parse(localStorage.getItem('userData')),
        });
    }

    login() {
        const err = this.validate();
        const { user } = this.state;
        const errors = [];
        if (!err) {
            let objUserData = [];
            const newUser = {
                username: user.username,
                password: user.password
            }
            axios.post(config.url + '/login', newUser)
                .then(res => {
                    objUserData = JSON.stringify(res.data)
                    localStorage.setItem('userData', objUserData);
                    this.setState({ redirect: true })
                })
                .catch((error) => {
                    errors.loginError = "Username Atau Password Salah.";
                    this.setState({
                        errors: errors
                    });
                });
        }


    }

    validate = () => {
        const { user } = this.state;
        let isError = false;
        const errors = {
            usernameError: "",
            passwordError: "",
        };

        if (user.username.length < 1) {
            isError = true;
            errors.usernameError = "Username Tidak Boleh Kosong";
        }

        if (user.password.length < 1) {
            isError = true;
            errors.passwordError = "Password Tidak Boleh Kosong";
        }


        this.setState({
            errors: errors
        });
        return isError;
    };

    onChange = name => ({ target: { value } }) => { 
        const { user } = this.state;
        const errors = [];
        this.setState({
            user: {
                ...this.state.user,
                [name]: value,
            }
        })
        
        if(user[name] !== ''){
            errors[name + 'Error'] = [];
            this.setState({
                errors: errors
            })
        }
    }

    onClick = name => ({ target: {value} }) => {
        const { errors } = this.state;
        errors[name + 'Error'] = [];
        this.setState({
            errors: errors,
        })
    }

    onBlur = name => ({ target: {value} }) => {
        const { errors } = this.state;
        const isEmpty = Validation.isEmpty(name, value);
        if(isEmpty.isError){
            this.setState({
                errors: isEmpty
            })
        }else{
            this.setState({
                errors: errors
            })
        }
    }

    render() {
        if (isLogged()) {
            return (<Redirect to={'/users'} />)
        }
        const { errors, user } = this.state;
        return (

            <div class="outer-wrapper">                
                <div className="login">
                    <div className="login-kiri">
                        <h1>Admin Page</h1>
                        <p>Some text for some title.</p>
                    </div>
                    <div className="login-kanan">
                        <h1 style={{ color: 'orangered' }}>Login Form</h1>
                        <p>Some text for some title. Just let's to
                            try to make it awesome
                    </p>
                        <form >
                            {errors.loginError ? <div className="div-errors"><b>Error!</b> {errors.loginError}</div> : ' '}
                            <TextField
                                className="input"
                                id="name"
                                margin="normal"
                                name='username'
                                value={user.username}
                                onChange={this.onChange('username')}
                                onBlur={this.onBlur('username')}
                                onClick={this.onClick('username')}
                                label={errors.usernameError === 0 ? "Username " : errors.usernameError}
                                error={errors.usernameError === 0 ? false : true}
                            />
                            <br />
                            <TextField
                                className="input"
                                id="name"
                                margin="normal"
                                type="password"
                                name='password'
                                value={user.password}
                                onChange={this.onChange('password')}
                                onBlur={this.onBlur('password')}
                                onClick={this.onClick('password')}
                                label={errors.passwordError === 0 ? "Password " : errors.passwordError}
                                error={errors.passwordError === 0 ? false : true}
                            />
                        </form>
                        <DialogActions>
                            <Button className="tombol" type="submit"
                                style={{
                                    background: "orange",
                                    color: "#fff",
                                    padding: 0,
                                    marginBottom: 20,
                                    marginTop: 16,
                                    display: "block",
                                    overflow: "hidden",
                                }} fullWidth onClick={this.login}>
                                Login
                        </Button>
                        </DialogActions>
                    </div>
                    <ul class="copyright">
                        <li>Copyright &copy; 2018.Batch 156.All Right Reserved</li>
                    </ul>
                </div>
            </div>
        )
    }
}


Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default Login;

