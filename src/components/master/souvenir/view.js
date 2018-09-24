import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default ({ viewSouvenir,handleClose, souvenir: {code, name, unitName, description}}) => {
    return <Fragment>
        <Dialog
            open={viewSouvenir}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">{"View Souvenir"}</DialogTitle>
            <DialogContent>
              
                   <form>
                    <TextField label="Souvenir Code" value={code}  margin="normal"  disabled={true}/>&nbsp;
                    <br/>
                    <TextField label="Souvenir Name" value={name}  margin="normal"  disabled={true}/>
                    <br />
                    <TextField label="Unit Name" value={unitName} margin="normal"  disabled={true}/> 
                    <br />
                    <TextField label="Description" value={description} margin="normal"  disabled={true}/>                   
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="secondary">
                    Cancel
            </Button>
            </DialogActions>
        </Dialog>
    </Fragment>
}