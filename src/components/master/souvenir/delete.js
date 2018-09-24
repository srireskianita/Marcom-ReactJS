import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


export default ({ deleteSouvenir,handleClose, handleDelete,  souvenir: {code, name, unitName, description}}) => {
    return <Fragment>
        <Dialog
            open={deleteSouvenir}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">{"Delete Souvenir ?"}</DialogTitle>
           
            <DialogActions>
            <Button onClick={handleDelete} variant="contained" color="primary"> 
                    Delete
            </Button>
                <Button onClick={handleClose} variant="contained" color="secondary">
                    Cancel
            </Button>
            
            </DialogActions>
        </Dialog>
    </Fragment>
}