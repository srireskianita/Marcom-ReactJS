import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CreateCompany from './create';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import EditCompany from './edit';
import DeleteCompany from './delete';
import ViewCompany from './view';
import { config, isLogged } from '../../base/base.config';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import LSData from '../../base/base.localstorage';
import { changeDateFormat } from '../../base/base.function';

import { Redirect } from 'react-router-dom';
import { Paper } from '@material-ui/core/';
class Companies extends React.Component {

    companyModel =
        {
            _id: '',
            code: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            createDate: '',
            created_by: LSData.loginRoleId(),
            is_delete: ''
        }

    errModel = {
        nameErr: '',
        emailErr: '',
        phoneErr: ''
    }
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            createNew: false,
            editCompany: false,
            deleteCompany: false,
            loading: true,
            company: this.companyModel,
            updateCompany: false,
            errors: this.errModel

        }
    }

    reloadCompanyData = () => {
        axios.get(config.url + '/m_company_aggregation')
            .then(res => {
                this.setState({
                    companies: res.data,
                    createNew: false,
                    editCompany: false,
                    deleteCompany: false,
                    company: this.companyModel,
                    loading: false,
                    updateCompany: false
                })
            })
            .catch((error) => {
                alert(error);
            })
    }

    componentDidMount() {
        this.reloadCompanyData();
    }

    handleToggle = () => {
        this.setState({
            createNew: true,
        });
    }

    handleClose = () => {
        this.setState({
            createNew: false,
            editCompany: false,
            deleteCompany: false,
            viewCompany: false,
            company: this.companyModel,
            updateCompany: false,
            errors: this.errModel
        });
    }
    //bisa diketik
    handleChange = name => ({ target: { value } }) => {
        this.setState({
            company: {
                ...this.state.company,
                [name]: value
            }
        })
    }


    handleSubmit = () => {
        const err = this.validate();
        if (!err) {
            const { company, createNew } = this.state;
            let newCompany =
            {
                name: company.name,
                phone: company.phone,
                email: company.email,
                address: company.address,
                createDate: company.createDate,
                created_by: company.created_by,
                updated_by: company.updated_by,
                updateDate: company.updateDate
            }

            if (createNew) {
                axios.post(config.url + '/m-company', newCompany)
                    .then(res => {
                        this.reloadCompanyData();
                        alert('Data Saved! New Company has been add with the code ' + res.data.ops[0].code);
                    })
                    .catch((error) => {
                        alert(error)
                    })
            } else {
                axios.put(config.url + '/m-company/' + company._id, newCompany)
                    .then(res => {
                        this.reloadCompanyData();
                        alert('Data Updated! Data Company has been updated');
                    })
                    .catch((error) => {
                        alert(error)
                    })
            }
        }
    }

    handleEdit = (_id) => {
        const { companies } = this.state;
        const company = companies.find(u => u._id === _id);
        this.setState({
            editCompany: true,
            updateCompany: false,
            company: {
                _id: company._id,
                code: company.code,
                name: company.name,
                phone: company.phone,
                email: company.email,
                address: company.address,
                updated_by: LSData.loginRoleId()
            }
        })
    }

    handleUpdateCompany = () => {
        this.setState({
            updateCompany: true
        })
    }

    handleDelete = (_id) => {
        const { companies } = this.state;
        const company = companies.find(u => u._id === _id);
        this.setState({
            deleteCompany: true,
            company: {
                _id: company._id,
                code: company.code,
                name: company.name,
                phone: company.phone,
                email: company.email,
                address: company.address,
                is_delete: company.is_delete
            }
        })
    }

    handleView = (_id) => {
        const { companies } = this.state;
        const company = companies.find(u => u._id === _id);
        this.setState({
            viewCompany: true,
            company: {
                _id: company._id,
                code: company.code,
                name: company.name,
                phone: company.phone,
                email: company.email,
                address: company.address
            }
        })
    }


    handleDeleteConfirm = () => {
        const { company } = this.state;
        let delProp = {
            is_delete: company.is_delete + 1,

        }
        axios.put(config.url + '/m-company/' + company._id, delProp)
            .then(res => {
                this.reloadCompanyData();
                console.log(res.data);
                alert('Data Deleted ! Data Company with code ' + company.code + ' has been deleted !');
            })
            .catch((error) => {
                alert(error);
            })
    }

    validate = () => {

        const { company } = this.state;
        let isError = false;
        const errors = {
            nameErr: "",
            emailErr: "",
            phoneErr: "",
        };

        if (company.name.length < 1) {
            isError = true;
            errors.nameErr = "Fill out Company name";

        }

        if (!company.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            isError = true;
            errors.emailErr = "Email invalid"
        }

        if (!company.phone.match(/^[0-9-()]*$/)) {
            isError = true;
            errors.phoneErr = "Phone invalid"
        }

        this.setState({
            errors: errors
        });
        return isError;
    };
    render() {
        if (!isLogged()) {
            return (<Redirect to={'/login'} />)
        }
        const { companies, loading } = this.state;
        const { classes } = this.props;
        let i = 1;
        return (
            <div>
                <CreateCompany createNew={this.state.createNew} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} errors={this.state.errors} company={this.state.company} />
                <EditCompany editCompany={this.state.editCompany} updateCompany={this.state.updateCompany} handleUpdateCompany={this.handleUpdateCompany} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} company={this.state.company} errors={this.state.errors} />
                <DeleteCompany deleteCompany={this.state.deleteCompany} handleClose={this.handleClose} handleDelete={this.handleDeleteConfirm} company={this.state.company} />
                <ViewCompany viewCompany={this.state.viewCompany} handleView={this.handleView} handleClose={this.handleClose} company={this.state.company} />
                <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />
                <br/>
                <br/>
                <br/>
                <Paper className={classes.root}>
                    <Table>
                        <TableHead >
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Company Code</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Create By</TableCell>
                                <TableCell className={classes.action}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map(n => {
                                return (
                                    <TableRow key={n._id}>
                                        <TableCell component="th" scope="row">{i++}</TableCell>
                                        <TableCell component="th" scope="row">{n.code}</TableCell>
                                        <TableCell>{n.name}</TableCell>
                                        <TableCell>{changeDateFormat(n.createDate)}</TableCell>
                                        <TableCell>{n.created_by}</TableCell>
                                        <TableCell className={classes.action}> <IconButton><SearchIcon onClick={() => this.handleView(n._id)} /></IconButton>
                                            <IconButton><EditIcon onClick={() => this.handleEdit(n._id)} /></IconButton>
                                            <IconButton><DeleteIcon onClick={() => this.handleDelete(n._id)} /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

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
Companies.PropTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Companies);