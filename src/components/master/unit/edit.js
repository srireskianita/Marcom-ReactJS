import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';



export default ({errors: {nameErr, descErr}, editUnit, handleClose , handleChange, handleSubmit, handleChangeCheckBox, unit : {code, name,description}}) => {
    return <Fragment>
        <Dialog
            open={editUnit}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">{"Update Unit"} {name} ({code}) </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" >
                  Please edit the data
            </DialogContentText>
            <form>
                <TextField label = 'Unit Code' value = {code}  margin = 'normal' disabled = {true}/>
                <br/>
                <TextField label='Unit Name' value={name} error={nameErr === 0 ? false : true} onChange={handleChange('name')} margin='normal' required InputLabelProps={{shrink: true}}/>
                <br/>
                <TextField label='Description' value={description} error={descErr === 0 ? false : true} onChange={handleChange('description')} margin='normal' required InputLabelProps={{shrink: true}}/>
                <br/>
            </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="contained">
                    Cancel
            </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" autoFocus>
                    Save
            </Button>
            </DialogActions>
        </Dialog>
    </Fragment>
}