
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { config } from '../../base/base.config';
import { deleteData } from '../../base/base.model';
import LS from '../../base/base.localstorage';


// Material UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    Dialog,
    DialogActions,
    Button,
    DialogContent,
    DialogContentText,
    withStyles,
    Paper,
} from '@material-ui/core';

// From Local Dir
import CreateUser from './create';
import EditUser from './edit';
import ViewUser from './view';
import Validation from '../../base/base.validation';

const styles = {
    progress: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        alignItem: 'center'
    },
    root: {
        width: '100%',
        overflowX: 'hidden',
    },
    table: {
        minWidth: 700,
    },
    action: {
        minWidth: 200,
        textAlign: 'center'
    },
    inputsearch: {
        width: 182,
        marginRight: 10,
        fontSize: 16
    }
};

class Users extends React.Component {

    userModel = {
        _id: '',
        username: '',
        password: '',
        m_role_id: '',
        m_employee_id: '',
        is_delete: '',
        created_by: '',
        created_date: '',
        update_by: '',
        update_date: '',
        re_password: '',
        mEmployeeFirstName: '',
        mEmployeeLastName: ''
    };

    searchModel = {
        employeeName: '',
        roleName: '',
        companyName: '',
        userName: '',
        created: '',
        createdBy: '',
    }

    searchModelErrors = {
        employeeNameError: '',
        roleNameError: '',
        companyNameError: '',
        userNameError: '',
        createdError: '',
        createdByError: '',
    }

    userModels = {
        username: '',
        password: '',
        m_role_id: '',
        m_employee_id: '',
        re_password: '',
    };

    usersModelErros = {
        usernameError: '',
        passwordError: '',
        m_role_idError: '',
        m_employee_idError: '',
        re_passwordError: '',
    }

    checkPassword = {
        password: '',
        re_password: '',
    }

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            employees: [],
            roles: [],
            errors: this.usersModelErros,
            user: this.userModel,
            createNew: false,
            editUser: false,
            loading: true,
            search: this.searchModel,
        }
    }

    componentDidMount() {
        this.reloadData('users', '/user-aggregation');
        this.reloadData('employees', '/m-employee');
        this.reloadData('roles', '/m-role');
    }

    reloadData = (state, url) => {
        axios.get(config.url + url)
            .then(res => {
                this.setState({
                    [state]: res.data,
                    createNew: false,
                    editUser: false,
                    deleteUser: false,
                    viewUser: false,
                    user: this.userModel,
                    load: false,
                    loading: false,
                })
            })
            .catch((error) => {
                alert(error);
            });
    }

    handleToggle = () => {
        this.setState({
            createNew: true,
            user: this.userModel
        })
    }

    handleClose = () => {
        this.setState({
            createNew: false,
            editUser: false,
            viewUser: false,
            deleteUser: false,
            errors: this.usersModelErros
        })
    }

    handleSubmit = () => {
        const { user, createNew } = this.state;
        const isEmpty = Validation.isEmpty(user, this.userModels);
        const checkPassword = Validation.checkPassword(user, this.checkPassword);
        if (!isEmpty.valid) {
            this.setState({
                errors: isEmpty
            })
        } else if (checkPassword.passvalid) {
            alert('Password Tidak Sama');
        } else {
            let newUser = {
                username: user.username,
                password: user.password,
                m_role_id: user.m_role_id,
                m_employee_id: user.m_employee_id,
            }
            if (createNew) {
                newUser.created_by = LS.loginId();
                axios.post(config.url + '/m-user', newUser)
                    .then(res => {
                        this.reloadData('users', '/user-aggregation');
                    })
                    .catch((error) => {
                        alert(error);
                    })
            } else {
                newUser.updated_by = LS.loginId();
                axios.put(config.url + '/m-user/' + user._id, newUser)
                    .then(res => {
                        this.reloadData('users', '/user-aggregation');
                    });
            }
        }
    }

    handleChange = name => ({ target: { value } }) => {
        this.setState({
            user: {
                ...this.state.user,
                [name]: value
            },
            search: {
                ...this.state.search,
                [name]: value
            }
        })
    }

    handleEdit = (_id) => {
        const { users } = this.state;
        const user = users.find(u => u._id === _id);
        this.setState({
            editUser: true,
            user: {
                _id: user._id,
                username: user.username,
                password: user.password,
                re_password: user.password,
                m_role_id: user.m_role_id,
                m_employee_id: user.m_employee_id,
                mEmployeeFirstName: user.mEmployeeFirstName,
                mEmployeeLastName: user.mEmployeeLastName,
            }
        })
    }

    handleDelete = (_id) => {
        const { users } = this.state;
        const user = users.find(u => u._id === _id);
        this.setState({
            deleteUser: true,
            user: {
                _id: user._id
            }
        })
    }

    handleView = (_id) => {
        const { users } = this.state;
        const user = users.find(u => u._id === _id);
        this.setState({
            viewUser: true,
            user: {
                _id: user._id,
                username: user.username,
                password: user.password,
                re_password: user.password,
                m_role_id: user.m_role_id,
                m_employee_id: user.m_employee_id,
                mEmployeeFirstName: user.mEmployeeFirstName,
                mEmployeeLastName: user.mEmployeeLastName,
            }
        })
    }

    handleDeleteConfirm = (_id) => {
        deleteData('m-user', _id);
        this.reloadData('users', '/user-aggregation');
    }

    render() {
        const { users, loading } = this.state;
        const deleteUser = this.state.user;
        const { classes } = this.props;
        let i = 1;
        return (
            <div>
                <CreateUser
                    createNew={this.state.createNew}
                    handleToggle={this.handleToggle}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    user={this.state.user}
                    employees={this.state.employees}
                    roles={this.state.roles}
                    errors={this.state.errors}
                />
                <EditUser
                    editUser={this.state.editUser}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    user={this.state.user}
                    employees={this.state.employees}
                    roles={this.state.roles}
                />
                <ViewUser
                    viewUser={this.state.viewUser}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    user={this.state.user}
                    employees={this.state.employees}
                    roles={this.state.roles}
                />
                <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />
                <br />
                <br />
                <br />
                <Paper className={classes.root}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Employee</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell className={classes.username}>Username</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell className={classes.action}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => {
                                return (
                                    <TableRow key={user._id}>
                                        <TableCell>{i++}</TableCell>
                                        <TableCell>{user.mEmployeeFirstName + ' ' + user.mEmployeeLastName}</TableCell>
                                        <TableCell component="th" scope="row">{user.mRoleName}</TableCell>
                                        <TableCell>{user.mEmployeemCompanyName}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.createDate}</TableCell>
                                        <TableCell>{user.createdByRoleName}</TableCell>
                                        <TableCell style={{ textAlign: "center" }} className={classes.action}>
                                            <IconButton onClick={() => this.handleView(user._id)}><SearchIcon color="primary" /></IconButton>
                                            <IconButton onClick={() => this.handleEdit(user._id)}><EditIcon color="primary" /></IconButton>
                                            <IconButton onClick={() => this.handleDelete(user._id)}><DeleteIcon color="secondary" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
                <Dialog open={this.state.deleteUser} onClose={this.handleClose} style={{ textAlign: 'center' }}>
                    <DialogContent>
                        <DialogContentText>
                            Delete Data?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleDeleteConfirm(deleteUser._id)} variant="contained" color="primary" autoFocus>Delete</Button>
                        <Button onClick={this.handleClose} variant="contained" color="secondary" >Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Users);