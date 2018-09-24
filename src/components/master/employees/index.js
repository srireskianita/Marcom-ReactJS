
import React from 'react';
import axios from 'axios';
import { config } from '../../base/base.config';
import { deleteData } from '../../base/base.model';
import PropTypes from 'prop-types';
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
    Paper
} from '@material-ui/core';

// From Local Dir
import CreateEmployee from './create';
import EditEmployee from './edit';
import ViewUser from './view';
import { changeDateFormat } from '../../base/base.function';

const styles = {
    progress: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        alignItem: 'center'
    },
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    action: {
        minWidth: 200,
        textAlign: 'center'
    }
};

class Employees extends React.Component {

    employeeModel = {
        _id: '',
        employee_number: '',
        firstName: '',
        lastName: '',
        mCompanyId: '',
        mCompanyName: '',
        createdBy: '',
        createdDate: '',
        email: '',
        updateDate: '',
        updateBy: ''
    };

    employeeModelErrors = {
        employee_numberError: '',
        firstNameError: '',
        lastNameError: '',
        mCompanyIdError: '',
        mCompanyNameError: '',
        emailError:'',
    };

    employeValid = {
        employee_number: '',
        firstName: '',
        lastName: '',
        mCompanyId: '',
        mCompanyName: '',
        email:'',
    };

    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            employees: [],
            errors: this.employeeModelErrors,
            employee: this.employeeModel,
            createNew: false,
            editEmployee: false,
            loading: true
        }
    }

    componentDidMount() {
        this.reloadData('employees', '/employee-aggregation');
        this.reloadData('companies', '/m-company');
    }

    reloadData = (state, url) => {
        axios.get(config.url + url)
            .then(res => {
                this.setState({
                    [state]: res.data,
                    createNew: false,
                    editEmployee: false,
                    deleteEmployee: false,
                    viewEmployee: false,
                    employee: this.employeeModel,
                    load: false,
                    loading: false
                })
            })
            .catch((error) => {
                alert(error);
            });
    }

    handleToggle = () => {
        this.setState({
            createNew: true,
            employee: this.employeeModel
        })
    }

    handleClose = () => {
        this.setState({
            createNew: false,
            editEmployee: false,
            viewEmployee: false,
            deleteEmployee: false,
        })
    }

    handleSubmit = () => {
        const { employee, createNew } = this.state;
            let newEmployee = {
                employee_number: employee.employee_number,
                first_name: employee.firstName,
                last_name: employee.lastName,
                m_company_id: employee.mCompanyId,
                email: employee.email,
            }
            if (createNew) {
                newEmployee.created_by = LS.loginId();
                axios.post(config.url + '/m-employee', newEmployee)
                    .then(res => {
                        this.reloadData('employees', '/employee-aggregation');
                    })
                    .catch((error) => {
                        alert(error);
                    })
            } else {
                newEmployee.updated_by = LS.loginId();
                axios.put(config.url + '/m-employee/' + employee._id, newEmployee)
                    .then(res => {
                        this.reloadData('employees', '/employee-aggregation');
                    });
            }
        // }
    }

    handleChange = name => ({ target: { value } }) => {
        this.setState({
            employee: {
                ...this.state.employee,
                [name]: value
            }
        })
    }

    handleEdit = (_id) => {
        const { employees } = this.state;
        const employee = employees.find(u => u._id === _id);
        this.setState({
            editEmployee: true,
            employee: {
                _id: employee._id,
                employee_number: employee.employee_number,
                firstName: employee.firstName,
                lastName: employee.lastName,
                mCompanyId: employee.mCompanyId,
                email: employee.email,
            }
        })
    }

    handleDelete = (_id) => {
        const { employees } = this.state;
        const employee = employees.find(u => u._id === _id);
        this.setState({
            deleteEmployee: true,
            employee: {
                _id: employee._id
            }
        })
    }

    handleView = (_id) => {
        const { employees } = this.state;
        const employee = employees.find(u => u._id === _id);
        this.setState({
            viewEmployee: true,
            employee: {
                _id: employee._id,
                employee_number: employee.employee_number,
                firstName: employee.firstName,
                lastName: employee.lastName,
                mCompanyId: employee.mCompanyId,
                email: employee.email,
            }
        })
    }

    handleDeleteConfirm = (_id) => {
        deleteData('m-employee', _id);
        this.reloadData('employees', '/employee-aggregation');
    }


    render() {
        const { employees, loading } = this.state;
        const deleteEmployee = this.state.employee;
        const { classes } = this.props;
        let i = 1;
        return (
            <div>
                <CreateEmployee
                    createNew={this.state.createNew}
                    handleToggle={this.handleToggle}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    employee={this.state.employee}
                    errors={this.state.errors}
                    companies={this.state.companies}
                />
                <EditEmployee
                    editEmployee={this.state.editEmployee}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    employee={this.state.employee}
                    companies={this.state.companies}
                />
                <ViewUser
                    viewEmployee={this.state.viewEmployee}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    employee={this.state.employee}
                    companies={this.state.companies}
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
                                <TableCell>Employee ID Number</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Company name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Create By</TableCell>
                                <TableCell className={classes.action}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map(employee => {
                                return (
                                    <TableRow key={employee._id}>
                                        <TableCell>{i++}</TableCell>
                                        <TableCell>{employee.employee_number}</TableCell>
                                        <TableCell component="th" scope="row">{employee.firstName + ' ' + employee.lastName}</TableCell>
                                        <TableCell>{employee.mCompanyName}</TableCell>
                                        <TableCell>{changeDateFormat(employee.createdDate)}</TableCell>
                                        <TableCell>{employee.mRoleName}</TableCell>
                                        <TableCell className={classes.action}>
                                            <IconButton onClick={() => this.handleView(employee._id)}><SearchIcon color="primary" /></IconButton>
                                            <IconButton onClick={() => this.handleEdit(employee._id)}><EditIcon color="primary" /></IconButton>
                                            <IconButton onClick={() => this.handleDelete(employee._id)}><DeleteIcon color="secondary" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
                <Dialog open={this.state.deleteEmployee} onClose={this.handleClose} style={{ textAlign: 'center' }}>
                    <DialogContent>
                        <DialogContentText>
                            Delete Data?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="secondary" >Cancel</Button>
                        <Button onClick={() => this.handleDeleteConfirm(deleteEmployee._id)} variant="contained" color="primary" autoFocus>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

Employees.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Employees);