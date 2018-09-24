import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default ({editCompany,updateCompany,handleUpdateCompany,handleChange,handleClose,handleEdit,handleSubmit, errors: {nameErr, emailErr, phoneErr}, company: {code, name, email, phone,address}}) => {
   return <Fragment>
        <Dialog
            open={editCompany}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">{"Update company"}</DialogTitle>
            <DialogContent>
            <form>
                <TextField label='Company Code' value={code} onChange={handleChange('code')} margin='normal' disabled/>
                &nbsp;
                <TextField label='Company Name' value={name} onChange={handleChange('name')} error={nameErr === 0 ? false : true} margin='normal'/>
                &nbsp;
                <TextField label='Email' value={email} onChange={handleChange('email')} error={emailErr === 0 ? false : true} margin='normal'/>
                &nbsp;
                <TextField label='Phone' value={phone} onChange={handleChange('phone')} error={phoneErr === 0 ? false : true} margin='normal'/>
                &nbsp;
                <TextField label='Address' value={address} onChange={handleChange('address')} fullWidth={true} multiline={true} margin='normal'/>
                &nbsp;
            </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleUpdateCompany} variant="contained" color="primary" autoFocus>
                  Update
            </Button>
                <Button onClick={handleClose} variant="contained" color="secondary">
                    Cancel
            </Button>
            </DialogActions>
            <Dialog
                open={updateCompany}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">{"Update Data?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Update
                    </Button>
                    <Button onClick={handleClose} variant="contained" color='secondary'>
                        Cancel
                    </Button>
                </DialogActions>

            </Dialog>
        </Dialog>
    </Fragment>
}