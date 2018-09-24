import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';

const loginData = localStorage.getItem('userData');

export const config = {
    url: 'http://localhost:8000/api'
    // url : ''
}

export const isLogged = () => {
    if (loginData) {
        return true;
    } else {
        return false;
    }
}

export const urlBreadCumbs = () => {
    let Arr = {
        'users': 'List User',
        'employees': 'List Employee',
        'company': 'List Company',
        'role': 'List Role',
        'menu': 'List Menu',
        'menuaccess': 'List Menu Access',
        'unit': 'List Unit',
        'souvenir': 'List Souvenir',
        'product': 'List Product',
        'design': 'List Design Request',
        'event': 'List Event Request',
        'promotion': 'List Marketing Promotion',
    }
    // let url = window.location.pathname;
    // let urlReplace = url.split('/').join(' / ');
    var pathArray = window.location.pathname.split('/');
    var masTer = pathArray[1] === 'master' ? 'Master' : (pathArray[1] === 'transaction' ? 'Transaction' : '');
    return (
        <div>
            <div className='breadcumbs'>
                <Button style={{background: 'transparent', color: '#3f51b5', fontSize: '12px'}} component={NavLink} to='/master/users'>Home</Button> / 
                <Button style={{background: 'transparent', color: '#3f51b5', fontSize: '12px'}} component={NavLink} to={'/'+pathArray[1]}>{masTer}</Button> /  
                <Button style={{background: 'transparent', color: '#808080', fontSize: '12px'}}>{Arr[pathArray[2]]}</Button>
            </div>
            <br />
        </div>
    )
}

export const getTitle = () => {
    let Arr = {
        'users': 'List User',
        'employees': 'List Employee',
        'company': 'List Company',
        'role': 'List Role',
        'menu': 'List Menu',
        'menuaccess': 'List Menu Access',
        'unit': 'List Unit',
        'souvenir': 'List Souvenir',
        'product': 'List Product',
        'design': 'List Design Request',
        'event': 'List Event Request',
        'promotion': 'List Marketing Promotion',
    }
    var pathArray = window.location.pathname.split('/');
    return (
        <div>
            {Arr[pathArray[2]]} 
        </div>
    )
}