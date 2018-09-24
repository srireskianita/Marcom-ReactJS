import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ViewIcon from '@material-ui/icons/Search';
import EditUnit from './edit';
import DeleteUnit from './delete';
import CreateUnit from './create';
import ViewUnit from './view';
import { Paper } from '@material-ui/core';

import { config } from '../../base/base.config';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import LSData from '../../base/base.localstorage'


class m_unit extends React.Component {

    unitModel =
        {
            _id: '',
            code: '',
            name: '',
            description: '',
            created_by: LSData.loginRoleId(),
            is_delete: '',
            createdDate: ''


        }

    errModel = {
        nameErr: '',
        descErr: ''
    }

    constructor(props) {
        super(props);
        this.state = {

            m_unit: [],
            createNew: false,
            editUnit: false,
            deleteUnit: false,
            loading: true,
            viewUnit: false,
            unit: this.unitModel,
            errors: this.errModel

        }
    }

    validate = () => {
        const { unit } = this.state;
        let isError = false;
        const errors = {
            nameErr: "",
            descErr: ""
        };

        if (unit.name.length < 1) {
            isError = true;
            errors.nameErr = alert("Fill out unit name");
        }
        if (unit.description.length < 1) {
            isError = true;
            errors.descErr = alert("Fill out unit description");
        }

        this.setState({
            errors: errors
        });
        console.log(errors)
        return isError;
    };

    reloadUnitData = () => {
        axios.get(config.url + '/m_unit_aggregation')
            .then(res => {
                this.setState({
                    m_unit: res.data,
                    createNew: false,
                    editUnit: false,
                    deleteUnit: false,
                    unit: this.unitModel,
                    loading: false
                })
            })
            .catch((error) => {
                alert(error);
            })
    }

    componentDidMount() {
        this.reloadUnitData();
    }

    //API connect to cloud


    handleToggle = () => {
        this.setState({
            createNew: true,

        });
    }

    handleClose = () => {
        this.setState({
            createNew: false,
            editUnit: false,
            deleteUnit: false,
            viewUnit: false,
            unit: this.unitModel

        });
    }
    //bisa diketik
    handleChange = name => ({ target: { value } }) => {
        this.setState({
            unit: {
                ...this.state.unit,
                [name]: value
            }
        })
    }

    handleChangeCheckBox = name => event => {
        this.setState({
            unit: {
                ...this.state.unit,
                [name]: event.target.checked
            }
        })
    }

    handleSubmit = () => {
        const { unit, createNew } = this.state;
        const err = this.validate();
        if (!err) {

            let newUnit =
            {
                code: unit.code,
                name: unit.name,
                description: unit.description,
                createDate: unit.createDate,
                created_by: unit.created_by

            }

            if (createNew) {
                axios.post(config.url + '/m-unit', newUnit)
                    .then(res => {
                        this.reloadUnitData();
                        alert('Data Saved! New unit has been added with code ' + res.data.ops[0].code);
                    })
                    .catch((error) => {
                        alert(error)
                    })
            } else {
                axios.put(config.url + '/m-unit/' + unit._id, newUnit)
                    .then(res => {
                        this.reloadUnitData();
                        alert('Unit has been updated ');
                    })
                    .catch((error) => {
                        alert(error)
                    })
            }
        }
    }

    handleEdit = (_id) => {
        const { m_unit } = this.state;
        const unit = m_unit.find(u => u._id === _id);
        this.setState({
            editUnit: true,
            unit: {
                _id: unit._id,
                code: unit.code,
                name: unit.name,
                is_delete: unit.is_delete,
                description: unit.description
            }
        })
    }

    handleDelete = (_id) => {
        const { m_unit } = this.state;
        const unit = m_unit.find(u => u._id === _id);

        this.setState({
            deleteUnit: true,
            unit: {
                _id: unit._id,
                code: unit.code,
                name: unit.name,
                is_delete: unit.is_delete,
                description: unit.description
            }
        })
    }

    handleView = (_id) => {
        const { m_unit } = this.state;
        const unit = m_unit.find(u => u._id === _id);
        this.setState({
            viewUnit: true,
            unit: {
                _id: unit._id,
                code: unit.code,
                name: unit.name,
                is_delete: unit.is_delete,
                description: unit.description
            }
        })
    }

    handleDeleteConfirm = () => {
        const { unit } = this.state;

        let delProp = {
            is_delete: unit.is_delete + 1,
        }
        axios.put(config.url + '/m-unit/' + unit._id, delProp)
            .then(res => {
                this.reloadUnitData();
                alert('Data Deleted! Data Unit with code ' + res.data.ops[0].code + ' has been deleted');
            })
            .catch((error) => {
                alert(error);
            })
    }


    render() {
        const { m_unit, loading } = this.state;
        console.log(m_unit);
        const { classes } = this.props;
        return (
            <div>
                <CreateUnit errors={this.state.errors} createNew={this.state.createNew} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} handleChangeCheckBox={this.handleChangeCheckBox} unit={this.state.unit} />
                <EditUnit errors={this.state.errors} editUnit={this.state.editUnit} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} handleChangeCheckBox={this.handleChangeCheckBox} unit={this.state.unit} />
                <DeleteUnit deleteUnit={this.state.deleteUnit} handleClose={this.handleClose} handleDelete={this.handleDeleteConfirm} handleChangeCheckBox={this.handleChangeCheckBox} unit={this.state.unit} handleChange={this.handleChange} />
                <ViewUnit viewUnit={this.state.viewUnit} handleClose={this.handleClose} unit={this.state.unit} />
                <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />
                <br />
                <br />
                <br />
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Unit Code</TableCell>
                                <TableCell>Unit Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Create By</TableCell>
                                <TableCell className={classes.action}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {m_unit.map(n => {
                                return (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {n.code}
                                        </TableCell>
                                        <TableCell>{n.name}</TableCell>
                                        <TableCell>{n.createDate}</TableCell>
                                        <TableCell>{n.created_by}</TableCell>
                                        <TableCell className={classes.action}>
                                            <IconButton><EditIcon onClick={() => this.handleEdit(n._id)} color="primary" /></IconButton>
                                            <IconButton><ViewIcon onClick={() => this.handleView(n._id)} color="primary" /></IconButton>                                            
                                            <IconButton><DeleteIcon onClick={() => this.handleDelete(n._id)} color="primary" /> </IconButton>
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

m_unit.PropTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(m_unit);