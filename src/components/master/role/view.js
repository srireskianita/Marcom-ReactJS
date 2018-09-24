import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

export default ({ viewRole, handleClose, role:{code, name, description}}) => {
  return <Fragment>
  <Dialog
  open={viewRole}
  onClose={handleClose}
  >
  <DialogContent>
  <DialogContentText id="alert-dialog-description">
  <div class="title">Role Information</div>
  </DialogContentText>
  <form class="martop">
  <TextField label='Role Code' value={code} margin='normal' disabled={true}/>
  <br/>
  <TextField label='Role Name' value={name} margin='normal' disabled={true}/>
  <br/>
  <TextField label='Description Name' value={description} margin='normal' disabled={true}/>
  <br/>
  </form>
  </DialogContent>
  <DialogActions>
  <Button onClick={handleClose} color="secondary" variant="contained">
  Cancel
  </Button>
  </DialogActions>
  </Dialog>
  </Fragment>
}