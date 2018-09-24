import React from 'react';
import {
    BrowserRouter,
} from 'react-router-dom';
import '../style/default.css';
import '../style/login.css';
import Layout from '../components/layout';
import Login from '../components/access';

import {isLogged } from '../components/base/base.config';

export default () => (
    <BrowserRouter>
        { isLogged() ? <Layout/> : <Login/>}
    </BrowserRouter>
)