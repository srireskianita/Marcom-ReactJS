import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import CreateSouvenir from './create';
import EditSouvenir from './edit';
import DeleteSouvenir from './delete';
import ViewSouvenir from './view';
import { config } from '../../base/base.config';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import LSData from '../../base/base.localstorage';
import { Redirect } from 'react-router-dom';
import { isLogged } from '../../base/base.config';
import { changeDateFormat } from '../../base/base.function';

import {
    Paper,
} from '@material-ui/core';

class Souvenirs extends React.Component {

    souvenirModel =
        {
            _id: '',
            code: '',
            name: '',
            description: '',
            m_unit_id: '',
            createDate: '',
            created_by: LSData.loginRoleId(),
            updateDate: '',
            is_delete: '',
        }

    errModel = {
        nameErr: '',
        // unitNameErr: ''
    }
    constructor(props) {
        super(props);
        this.state = {
            souvenirs: [],
            unit: [],
            createNew: false,
            editSouvenir: false,
            deleteSouvenir: false,
            loading: true,
            souvenir: this.souvenirModel,
            errors: this.errModel

        }
    }

    reloadSouvenirData = () => {
        axios.get(config.url + '/m_souvenir_unit')
            .then(res => {
                this.setState({
                    souvenirs: res.data,
                    createNew: false,
                    editSouvenir: false,
                    deleteSouvenir: false,
                    souvenir: this.souvenirModel,
                    loading: false
                })
            })
            .catch((error) => {
                alert(error);
            })
    }

    reloadUnitData = () => {
        axios.get(config.url + '/m-unit')
            .then(res => {
                this.setState({
                    unit: res.data
                })
            })
            .catch((error) => {
                alert(error);
            })
    }
    componentDidMount() {
        this.reloadSouvenirData();
        this.reloadUnitData();
    }

    handleToggle = () => {
        this.setState({
            createNew: true,
            souvenir: this.souvenirModel
        })
    }

    handleClose = () => {
        this.setState({
            createNew: false,
            editSouvenir: false,
            deleteSouvenir: false,
            viewSouvenir: false,
            souvenir: this.souvenirModel,
            errors: this.errModel
        });
    }
    //bisa diketik
    handleChange = name => ({ target: { value } }) => {
        this.setState({
            souvenir: {
                ...this.state.souvenir,
                [name]: value
            }
        })
    }

    handleSubmit = () => {
        const err = this.validate();
        if (!err) {
            const { souvenir, createNew } = this.state;

            let newSouvenir =
            {
                code: souvenir.code,
                name: souvenir.name,
                m_unit_id: souvenir.m_unit_id,
                description: souvenir.description,
                createDate: souvenir.createDate,
                created_by: souvenir.created_by,
                updateDate: souvenir.updateDate,
                updated_by: souvenir.updated_by
            }

            if (createNew) {
                axios.post(config.url + '/m-souvenir', newSouvenir)
                    .then(res => {
                        this.reloadSouvenirData();
                        alert('Data Saved! New Souvenir has been add with the code ' + res.data.ops[0].code);
                    })
                    .catch((error) => {
                        alert(error)
                    })
            } else {
                axios.put(config.url + '/m-souvenir/' + souvenir._id, newSouvenir)
                    .then(res => {
                        this.reloadSouvenirData();
                        alert('Data Updated! Data Souvenir has been updated');
                    })
                    .catch((error) => {
                        alert(error)
                    })
            }
        }
    }

    handleEdit = (_id) => {
        const { souvenirs } = this.state;
        const souvenir = souvenirs.find(u => u._id === _id);
        this.setState({
            editSouvenir: true,
            souvenir: {
                _id: souvenir._id,
                code: souvenir.code,
                name: souvenir.name,
                m_unit_id: souvenir.m_unit_id,
                unitName: souvenir.unitName,
                description: souvenir.description,
                createDate: souvenir.createDate,
                updated_by: LSData.loginRoleId(),
                updateDate: souvenir.updateDate

            }

        })
    }

    handleDelete = (_id) => {
        const { souvenirs } = this.state;
        const souvenir = souvenirs.find(u => u._id === _id);
        this.setState({
            deleteSouvenir: true,
            souvenir: {
                _id: souvenir._id,
                code: souvenir.code,
                name: souvenir.name,
                m_unit_id: souvenir.m_unit_id,
                unitName: souvenir.unitName,
                description: souvenir.description,
                createDate: souvenir.createDate,
                createBy: souvenir.createBy,
                is_delete: souvenir.is_delete
            }
        })
    }

    handleView = (_id) => {
        const { souvenirs } = this.state;
        const souvenir = souvenirs.find(u => u._id === _id);
        this.setState({
            viewSouvenir: true,
            souvenir: {
                _id: souvenir._id,
                code: souvenir.code,
                name: souvenir.name,
                m_unit_id: souvenir.m_unit_id,
                unitName: souvenir.unitName,
                description: souvenir.description,
                createDate: souvenir.createDate,
                created_by: souvenir.created_by
            }
        })
    }


    handleDeleteConfirm = () => {
        const { souvenir } = this.state;
        let delProp = {
            is_delete: souvenir.is_delete + 1,
        }

        axios.delete(config.url + '/m-souvenir/' + souvenir._id, delProp)
            .then(res => {
                this.reloadSouvenirData();
                alert('Data Deleted!');
            })
            .catch((error) => {
                alert(error);
            })

    }

    validate = () => {
        const { souvenir } = this.state;
        let isError = false;

        const errors = {
            nameErr: "",
        };

        if (souvenir.name.length < 1) {
            isError = true;
            errors.nameErr = "Fill out Souvenir name";
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

        const { souvenirs, loading } = this.state;
        const { classes } = this.props;
        let i = 1;

        return (
            <div>
                <CreateSouvenir createNew={this.state.createNew} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} errors={this.state.errors} souvenir={this.state.souvenir} unit={this.state.unit} />
                <EditSouvenir editSouvenir={this.state.editSouvenir} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} souvenir={this.state.souvenir} unit={this.state.unit} errors={this.state.errors} />
                <DeleteSouvenir deleteSouvenir={this.state.deleteSouvenir} handleClose={this.handleClose} handleDelete={this.handleDeleteConfirm} souvenir={this.state.souvenir} />
                <ViewSouvenir viewSouvenir={this.state.viewSouvenir} handleView={this.handleView} handleClose={this.handleClose} souvenir={this.state.souvenir} />
                <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />
                <br />
                <br />
                <br />
                <Paper className={classes.root}>
                    <Table>
                        <TableHead >
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Souvenir Code</TableCell>
                                <TableCell>Souvenir Name</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Create Date</TableCell>
                                <TableCell>Create By</TableCell>
                                <TableCell className={classes.action}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {souvenirs.map(n => {
                                return (
                                    <TableRow key={n._id}>
                                        <TableCell component="th" scope="row">{i++}</TableCell>
                                        <TableCell component="th" scope="row">{n.code}</TableCell>
                                        <TableCell>{n.name}</TableCell>
                                        <TableCell>{n.unitName}</TableCell>
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

Souvenirs.PropTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Souvenirs);