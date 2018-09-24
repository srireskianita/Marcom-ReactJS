import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export default ({ deleteProduct, handleClose,handleDeleteConfirm , product:{name, code}  }) => {
    return <Fragment>

        <Dialog
            open={deleteProduct}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">{"Delete Data"} - {name} {"("}{code}{")"}  </DialogTitle>
          
            <DialogActions>
            <Button onClick={handleDeleteConfirm}  variant="contained"  color="primary">
                    Delete
            </Button>
                <Button onClick={handleClose}  variant="contained"  color="primary" style={{ backgroundColor:"orange"}}>
                    Cancel
            </Button>
                
            </DialogActions>
        </Dialog>
    </Fragment>
}