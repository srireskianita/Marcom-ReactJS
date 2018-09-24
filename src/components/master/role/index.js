import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CreateRole from './create';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton';
import EditRole from './edit';
import DeleteRole from './delete';
import ViewRole from './view';
import { config } from '../../base/base.config';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import LSData from '../../base/base.localstorage';
import { Redirect } from 'react-router-dom';
import { isLogged } from '../../base/base.config';
import { changeDateFormat } from '../../base/base.function';
import { Paper } from '@material-ui/core';

class Roles extends React.Component {

  roleModel = {
    _id: '',
    code: '',
    name: '',
    description: '',
    createDate: '',
    is_delete: '',
    created_by: LSData.loginRoleId(),
  }

  errModel = {
    nameErr: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      createNew: false,
      deleteRole: false,
      editRole: false,
      loading: true,
      role: this.roleModel,
      errors: this.errModel
    }
  }

  reloadRoleData = () => {
    axios.get(config.url + '/m_role_ctrl')
      .then(res => {
        this.setState({
          roles: res.data,
          createNew: false,
          deleteRole: false,
          editRole: false,
          role: this.roleModel,
          loading: false
        })
      })
      .catch((error) => {
        alert(error);
      })
  }

  componentDidMount() {
    this.reloadRoleData();
  }

  handleToggle = () => {
    this.setState({
      createNew: true,
      role: this.roleModel
    })
  }

  handleClose = () => {
    this.setState({
      createNew: false,
      deleteRole: false,
      editRole: false,
      viewRole: false,
      role: this.roleModel,
      errors: this.errModel
    })
  }

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      role: {
        ...this.state.role,
        [name]: value
      }
    })
  }

  handleSubmit = () => {
    const err = this.validate();
    if (!err) {
      const { role, createNew } = this.state;
      let newRole = {
        code: role.code,
        name: role.name,
        description: role.description,
        created_by: role.created_by
      }

      if (createNew) {
        axios.post(config.url + '/m-role', newRole)
          .then(res => {
            this.reloadRoleData();
            alert('Data Saved! New Role has been added');
          })
          .catch((error) => {
            alert(error)
          })
      } else {
        axios.put(config.url + '/m-role/' + role._id, newRole)
          .then(res => {
            this.reloadRoleData();
            alert('Data Updated! New Role has been updated');
          })
          .catch((error) => {
            alert(error)
          })
      }
    }
  }

  handleEdit = (_id) => {
    const { roles } = this.state;
    const role = roles.find(m => m._id === _id);
    this.setState({
      editRole: true,
      role: {
        _id: role._id,
        code: role.code,
        name: role.name,
        description: role.description
      }
    })
  }

  handleDelete = (_id) => {
    const { roles } = this.state;
    const role = roles.find(m => m._id === _id);
    this.setState({
      deleteRole: true,
      role: {
        _id: role._id,
        code: role.code,
        name: role.name,
        is_delete: role.is_delete,
        description: role.description
      }
    })
  }

  handleView = (_id) => {
    const { roles } = this.state;
    const role = roles.find(m => m._id === _id);
    this.setState({
      viewRole: true,
      role: {
        _id: role._id,
        code: role.code,
        name: role.name,
        description: role.description
      }
    })
  }

  handleDeleteConfirm = () => {
    const { role } = this.state;
    let delRole = {
      is_delete: role.is_delete + 1,
    }
    axios.put(config.url + '/m-role/' + role._id, delRole)
      .then(res => {
        this.reloadRoleData();
        alert('Data Deleted! Role has been deleted. \n');
      })
      .catch((error) => {
        alert(error)
      })
  }

  validate = () => {

    const { role } = this.state;
    let isError = false;
    const errors = {
      nameErr: ""
    };

    if (role.name.length < 1) {
      isError = true;
      errors.nameErr = alert("Fill out Role name");
    }


    this.setState({
      errors: errors
    });
    console.log(errors)
    return isError;
  };


  render() {
    if (!isLogged()) {
      return (<Redirect to={'/login'} />)
    }
    const { roles, loading } = this.state;
    const { classes } = this.props;
    let i = 1;
    return (
      <div>
        <CreateRole errors={this.state.errors} createNew={this.state.createNew} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} role={this.state.role} />
        <DeleteRole deleteRole={this.state.deleteRole} handleClose={this.handleClose} handleDelete={this.handleDeleteConfirm} role={this.state.role} />
        <ViewRole viewRole={this.state.viewRole} handleClose={this.handleClose} role={this.state.role} />
        <EditRole errors={this.state.errors} editRole={this.state.editRole} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} role={this.state.role} />
        <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />
        <br/>
        <br/>
        <br/>
        <Paper className={classes.root}>
         <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Role Code</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Create By</TableCell>
              <TableCell className={classes.action}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map(n => {
              return (
                <TableRow key={n._id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell component="th" scope="row">
                    {n.code}
                  </TableCell>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{changeDateFormat(n.createDate)}</TableCell>
                  <TableCell>{n.created_by}</TableCell>
                  <TableCell className={classes.action}>
                    <IconButton onClick={() => this.handleView(n._id)}><SearchIcon color="primary" /></IconButton>
                    <IconButton onClick={() => this.handleEdit(n._id)}><EditIcon color="primary" /></IconButton>
                    <IconButton onClick={() => this.handleDelete(n._id)}><DeleteIcon color="secondary" /></IconButton>
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

Roles.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Roles);