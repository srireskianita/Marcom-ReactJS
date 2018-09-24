import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton';
import CreatePromo from './create';
import { config } from '../../base/base.config';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Paper } from '@material-ui/core';

class Promotions extends React.Component {

  promoModel = {
    _id: '',
    code: '',
    flag_design: '',
    title: '',
    t_event_id: '',
    t_design_id: '',
    is_delete: '',
    note: '',
    t_event_code: '',
    t_design_code: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      promos: [],
      employes: [],
      events: [],
      designs: [],
      createNew: false,
      deletePromo: false,
      editPromo: false,
      subSelect: true,
      loading: true,
      promo: this.promoModel,
    }
  }

  reloadEmployeeData = () => {
    axios.get(config.url + '/m_employee_role')
      .then(res => {
        this.setState({
          employes: res.data,
          loading: false,
        })
      })
      .catch((error) => {
        alert(error);
      })
  }

  reloadEventData = () => {
    axios.get(config.url + '/t-event')
      .then(res => {
        this.setState({
          events: res.data,
          loading: false,
        })
      })
      .catch((error) => {
        alert(error);
      })
  }

  reloadDesignData = () => {
    axios.get(config.url + '/t-design')
      .then(res => {
        this.setState({
          designs: res.data,
          loading: false,
        })
      })
      .catch((error) => {
        alert(error);
      })
  }

  reloadPromoData = () => {
    axios.get(config.url + '/t_promotion_ctrl')
      .then(res => {
        this.setState({
          promos: res.data,
          createNew: false,
          deletePromo: false,
          editPromo: false,
          promo: this.promoModel,
          loading: false
        })
      })
      .catch((error) => {
        alert(error);
      })
  }

  componentDidMount() {
    this.reloadPromoData();
    this.reloadEmployeeData();
    this.reloadEventData();
    this.reloadDesignData();
  }

  handleToggle = () => {
    this.setState({
      createNew: true,
      promo: this.promoModel
    })
  }

  handleToggleNext = () => {
    this.setState({
      createNew: false,
      promo: this.promoModel,
      nextPromo:true,
    })
  }

  handleSelect = e => {
    const value = e.target.value;
    let select;
    if(value===1){
      select = false;
    }
    
    else if(value===0){
      select= true;
    }
    
    this.setState({
      subSelect: select,
    })

  }
  handleClose = () => {
    this.setState({
      createNew: false,
      deletePromo: false,
      editPromo: false,
      viewPromo: false,
      nextPromo: false,
      promo: this.promoModel,
      
    })
  }

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      promo: {
        ...this.state.promo,
        [name]: value
      }
    })
  }
  handleChangeSelectEvent = name => ({ target: { value } }) => {
    const { events} = this.state;
    var event = events.find(o => o._id === value);
    events.t_event_code = event.code;

    this.setState({
      events: events,
      promo: {
        ...this.state.promo,
        [name]: value
      }
    })
  }

  handleChangeSelectDesign = name => ({ target: { value } }) => {
    const { designs } = this.state;
    var design = designs.find(o => o._id === value);
    designs.t_design_code = design.code;

    this.setState({
      designs: designs,
      promo: {
        ...this.state.promo,
        [name]: value
      }
    })
  }

  handleSubmit = () => {
    const { promo, createNew } = this.state;
    let newPromo = {
      code: promo.code,
    }

    if (createNew) {
      axios.post(config.url + '/t-promotion', newPromo)
        .then(res => {
          this.reloadPromoData();
          alert('Data Saved! New Promo has been added');
        })
        .catch((error) => {
          alert(error)
        })
    } else {
      axios.put(config.url + '/t-promotion/' + promo._id, newPromo)
        .then(res => {
          this.reloadPromoData();
          alert('Data Updated! New promo has been updated');
        })
        .catch((error) => {
          alert(error)
        })
    }
  }

  handleEdit = (_id) => {
    const { promos } = this.state;
    const promo = promos.find(m => m._id === _id);
    this.setState({
      editPromo: true,
      promo: {
        _id: promo._id,
        code: promo.code,
      }
    })
  }

  handleDelete = (_id) => {
    const { promos } = this.state;
    const promo = promos.find(m => m._id === _id);
    this.setState({
      deletePromo: true,
      promo: {
        _id: promo._id,
        code: promo.code,
      }
    })
  }

  handleView = (_id) => {
    const { promos } = this.state;
    const promo = promos.find(m => m._id === _id);
    this.setState({
      viewPromo: true,
      promo: {
        _id: promo._id,
        code: promo.code,
      }
    })
  }

  handleDeleteConfirm = () => {
    const { promo } = this.state;
    axios.delete(config.url + '/t-promotion/' + promo._id)
      .then(res => {
        this.reloadPromoData();
        alert('Data Deleted! Promo has been deleted. \n');
      })
      .catch((error) => {
        alert(error)
      })
  }

  render() {
    const { promos, loading } = this.state;
    const { classes } = this.props;
    let i = 1;
    return (
      <div>
        <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />
        <CreatePromo handleChangeSelectDesign={this.handleChangeSelectDesign} handleChangeSelectEvent={this.handleChangeSelectEvent} subSelect={this.state.subSelect} handleSelect={this.handleSelect} createNew={this.state.createNew} handleToggle={this.handleToggle} handleClose={this.handleClose} handleChange={this.handleChange} handleSubmit={this.handleSubmit} promo={this.state.promo} events={this.state.events} designs={this.state.designs} handleToggleNext={this.handleToggleNext} nextPromo={this.state.nextPromo} promos={this.state.promos}/>
        <br/>
        <br/>
        <br/>
        <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Transaction Code</TableCell>
              <TableCell>Request By</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Assign To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Create By</TableCell>
              <TableCell className={classes.action}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promos.map(n => {
              return (
                <TableRow key={n._id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell component="th" scope="row">
                    {n.code}
                  </TableCell>
                  <TableCell>{(n.request_by.first ? n.request_by.first + " " : "") + (n.request_by.last ? n.request_by.last + " " : "")}</TableCell>
                  <TableCell>{n.request_date}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{n.status}</TableCell>
                  <TableCell>{n.createDate}</TableCell>
                  <TableCell>{(n.created_by.first ? n.created_by.first + " " : "") + (n.created_by.last ? n.created_by.last + " " : "")}</TableCell>
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

Promotions.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Promotions);