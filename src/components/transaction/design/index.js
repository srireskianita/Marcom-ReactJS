
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { config } from '../../base/base.config';
import LSData from '../../base/base.localstorage';
import { closeRequest } from '../../base/base.model';

// Material UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton';

import {
    withStyles,
    Paper
} from '@material-ui/core';

import LocalStorage from '../../base/base.localstorage';

// From Local Dir
import CreateTDesign from './create';
import EditTDesign from './edit';
import ViewTDesignSubmitted from './viewSubmitted';
import ViewTDesignInProgress from './viewInProgress';

// Base Function
import { changeValue, changeDateFormat } from '../../base/base.function';
import { capitalize } from '../../base/base.function';
import { isNumber } from 'util';
import CircularProgress from '@material-ui/core/CircularProgress';



const styles = {
    progress: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        alignItem: 'center'
    },
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    action: {
        minWidth: 150,
        textAlign: 'center'
    }
};

class Design extends React.Component {

    idx = 0;
    tDesignModel = {
        _id: '',
        code: '',
        tEventId: '',
        titleHeader: '',
        requestBy: LocalStorage.loginEmployeeId(),
        requestDate: '',
        approvedBy: '',
        approvedDate: '',
        assignTo: '',
        assignToError: '',
        closeDate: '',
        note: '',
        status: '',
        rejectReason: '',
        isDelete: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
        assignToFirstName: '',
        assignToLastName: '',
        createdByUserName: '',
        mProductId: '',
        mProductDescription: '',
        tEventCode: ''
    };

    tDesignItemModel = {
        tDesignId: '',
        mProductId: '',
        mProductDescription: '',
        titleItem: '',
        requestPic: '',
        startDate: '',
        endDate: '',
        requestDueDate: '',
        inote: '',
        isDelete: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
    }

    constructor(props) {
        super(props);
        this.state = {
            tDesigns: [],
            items: [], // add to table
            itemId: '',
            tItems: [],
            products: [],
            events: [],
            employees: [],
            tItemsByID: [],
            employeeStaff: [],
            tDesign: this.tDesignModel,
            tDesignItem: this.tDesignItemModel,
            createNew: false,
            editTDesign: false,
            editUser: false,
            deleteUser: false,
            deleteConfirm: false,
            deleteConfirmEdit: false,
            load: true,
            viewTDesignSubmitted: false,
            viewTDesignInProgress: false,
            openrejectReason: false,
            loading: true,
        }
    }

    componentDidMount(objID = null) {
        this.reloadData('tDesigns', '/t-design-aggregation');
        this.reloadData('tItems', '/t-design-item');
        this.reloadData('products', '/m-product');
        this.reloadData('events', '/t-event');
        this.reloadData('employeeStaff', '/m_employee_role');
        // this.reloadData('employees', '/m-employee');
        this.reloadData('employees', '/m_employee_role_requester');
        if (objID) {
            this.reloadData('tItemsByID', '/t-design-by-id/' + objID);
        }
    }

    reloadData = (state, url) => {
        axios.get(config.url + url)
            .then(res => {
                this.setState({
                    [state]: res.data,
                    createNew: false,
                    editTDesign: false,
                    deleteTDesign: false,
                    viewTDesign: false,
                    tDesign: this.tDesignModel,
                    tDesignItem: this.tDesignItemModel,
                    load: false,
                    loading: false
                })
            })
            .catch((error) => {
                alert(error);
            });
    }

    handleToggle = () => {
        this.setState({
            createNew: true,
            tDesign: this.tDesignModel
        })
    }

    handleClose = () => {
        this.setState({
            createNew: false,
            editTDesign: false,
            viewTDesign: false,
            deleteTDesign: false,
            items: [],
            viewTDesignSubmitted: false,
            viewTDesignInProgress: false
        })
    }

    handleSubmit = () => {
        const { tDesign, items, createNew, tItems } = this.state;
        let newDesign = {
            t_event_id: tDesign.tEventId,
            title_header: tDesign.titleHeader,
            note: tDesign.note,
            request_by: LSData.loginEmployeeId(),
            status: 1
        }
        let objItem = [];
        if (createNew) {
            axios.post(config.url + '/t-design', newDesign)
                .then(res => {
                    let designId = res.data.insertedIds;
                    let objToString = designId[0];
                    for (let key in items) {
                        let item = items[key];
                        let newItem = {
                            m_product_id: item.mProductId,
                            t_design_id: objToString.toString(),
                            title_item: item.titleItem,
                            request_due_date: item.requestDueDate,
                            request_date: new Date(),
                            note: item.inote,
                            request_pic: this.handleFindRequester(capitalize(item.requestPic)),
                            created_by: LSData.loginId(),
                        }
                        objItem.push(newItem);
                    }
                    axios.post(config.url + '/t-design-item', objItem)
                        .then(res => {
                            this.reloadData('tDesign', '/t-design');
                        }).catch((error) => {
                            alert(error);
                        })

                })
                .catch((error) => {
                    alert(error);
                })
        }
        else {
            let newTdesign = {
                t_event_id: tDesign.tEventId,
                title_header: tDesign.titleHeader,
                note: tDesign.note,
            }

            axios.put(config.url + '/t-design/' + tDesign._id, newTdesign)
                .then(res => {
                    this.reloadData('tDesign', '/t-design');
                }).catch((error) => {
                    
                })

            let tDesignId = tDesign._id;
            let objItem = [];
            let objSave = [];
            let objUpdate = [];
            for (let key in tItems) {
                if (tItems[key].t_design_id === tDesignId) {
                    objItem.push(tItems[key]);
                }
            }

            for (let key in items) {
                let index = objItem.findIndex(item => item.id === items[key]._id); // dari database di cek ke yang diinput
                if (index !== -1) {
                    objUpdate.push(items[key]);
                }
            }

            for (let key in items) {
                let index = objItem.findIndex(item => item._id === items[key].id);
                if (index === -1) {
                    objSave.push(items[key]);
                }
            }

            let objSaveBaru = [];
            for (let key in objSave) {
                let item = objSave[key];
                let newItem = {
                    m_product_id: item.mProductId,
                    t_design_id: tDesignId,
                    title_item: item.titleItem,
                    request_due_date: item.requestDueDate,
                    request_date: new Date(),
                    note: item.inote,
                    request_pic: item.requestPic,
                    created_by: LSData.loginId(),
                }
                objSaveBaru.push(newItem);
            }

            if (objSaveBaru.length !== '') {
                axios.post(config.url + '/t-design-item', objSaveBaru)
                    .then(res => {
                        this.reloadData('tItems', '/t-design-item');
                    }).catch((error) => {
                        alert(error);
                    })
            }


            if (objUpdate.length !== '') {
                for (let key in objUpdate) {
                    let item = objUpdate[key];
                    let newUpdatedItem = {
                        m_product_id: item.mProductId,
                        t_design_id: tDesignId,
                        title_item: item.titleItem,
                        request_due_date: item.requestDueDate,
                        note: item.inote,
                        request_pic: item.requestPic,
                        created_by: item.createdBy
                    }
                    axios.put(config.url + '/t-design-item/' + objUpdate[key].id, newUpdatedItem);
                }
                this.reloadData('tItems', '/t-design-item');
            }
        }
    }

    handleChange = name => ({ target: { value } }) => {

        const { tDesign } = this.state;

        if (tDesign.assignToError) {
            tDesign.assignToError = '';
        } else {
            tDesign.assignToError = 'Ada yang Wajib Untuk Diisi';
        }
        this.setState({
            tDesign: {
                ...this.state.tDesign,
                [name]: value,
                [name + 'Error']: tDesign.assignToError
            },
        })
    }

    handleChangeSelectItems = (name, id) => ({ target: { value } }) => {
        const { items } = this.state;
        var item = items.find(o => o.id === id);
        item[name] = value;
        this.setState({
            items: items
        })
    }

    handleEdit = (_id) => {
        let newTitems = [];
        let dataTitems = [];
        const { tDesigns, tItems } = this.state;
        const design = tDesigns.find(u => u._id === _id);

        for (let key in tItems) {
            if (tItems[key].t_design_id === _id) {
                newTitems.push(tItems[key]);
            }
        }

        for (let key in newTitems) {
            let objTITems = {
                id: newTitems[key]._id,
                tDesignId: newTitems[key].t_design_id,
                mProductId: newTitems[key].m_product_id,
                titleItem: newTitems[key].title_item,
                requestPic: newTitems[key].request_pic,
                startDate: newTitems[key].start_date,
                endDate: newTitems[key].end_date,
                requestDueDate: newTitems[key].request_due_date,
                inote: newTitems[key].note,
                isDelete: newTitems[key].is_delete,
                createdBy: newTitems[key].created_by,
                createdDate: newTitems[key].createdDate,
                updatedBy: newTitems[key].updated_by,
                updatedDate: newTitems[key].updateDate,
            }

            dataTitems.push(objTITems);
        }

        this.setState({
            editTDesign: true,
            tDesign: {
                _id: design._id,
                code: design.code,
                tEventId: design.t_event_id,
                tEventCode: design.tEventCode,
                titleHeader: design.title_header,
                status: design.status,
                requestBy: design.request_by,
                requestDate: design.request_date,
                note: design.note
            },
            items: dataTitems,
        })
    }

    

    handleView = (_id) => {
        let newTitems = [];
        let dataTitems = [];
        const { tDesigns, tItems } = this.state;
        const design = tDesigns.find(u => u._id === _id);

        for (let key in tItems) {
            if (tItems[key].t_design_id === _id) {
                newTitems.push(tItems[key]);
            }
        }

        for (let key in newTitems) {
            let objTITems = {
                id: newTitems[key]._id,
                tDesignId: newTitems[key].t_design_id,
                mProductId: newTitems[key].m_product_id,
                mProductDescription: newTitems[key].mProductDescription,
                titleItem: newTitems[key].title_item,
                requestPic: newTitems[key].request_pic,
                startDate: newTitems[key].start_date,
                endDate: newTitems[key].end_date,
                requestDueDate: newTitems[key].request_due_date,
                inote: newTitems[key].note,
                isDelete: newTitems[key].is_delete,
                createdBy: newTitems[key].created_by,
                createdDate: newTitems[key].createdDate,
                updatedBy: newTitems[key].updated_by,
                updatedDate: newTitems[key].updateDate,
            }

            dataTitems.push(objTITems);
        }
        if (design.status === 1) {
            this.setState({
                viewTDesignSubmitted: true,
                tDesign: {
                    code: design.code,
                    _id: design._id,
                    assignToError: '',
                    assignTo: design.assign_to,
                    tEventId: design.t_event_id,
                    tEventCode: design.tEventCode,
                    titleHeader: design.title_header,
                    status: design.status,
                    requestBy: design.request_by,
                    requestDate: design.request_date,
                    note: design.note,
                },
                items: dataTitems,
            })
        } else if (design.status === 2) {
            this.setState({
                viewTDesignInProgress: true,
                tDesign: {
                    _id: design._id,
                    code: design.code,
                    assignTo: design.assign_to,
                    tEventId: design.t_event_id,
                    tEventCode: design.tEventCode,
                    titleHeader: design.title_header,
                    status: design.status,
                    requestBy: design.request_by,
                    requestDate: design.request_date,
                    note: design.note,
                },
                items: dataTitems,
            })
        }
    }

    handleDeleteConfirm = (_id, command) => {
        if (command === 'create') {
            this.setState({
                deleteConfirm: true,
                itemId: _id,
            })
        } else if (command === 'edit') {
            this.setState({
                deleteConfirmEdit: true,
                itemId: _id,
            })
        }
    }

    handleCloseRemove = () => {
        this.setState({
            deleteConfirm: false,
            deleteConfirmEdit: false,
        })
    }

    addNewItem = () => {
        let items = this.state.items;
        let _id = this.idx + 1;
        this.idx = this.idx + 1;
        var newOrder = {
            id: _id,
            tDesignId: '',
            mProductId: '',
            mProductDescription: '',
            titleItem: '',
            requestPic: '',
            startDate: '',
            endDate: '',
            requestDueDate: '',
            inote: '',
            isDelete: '',
            createdBy: '',
            createdDate: '',
            updatedBy: '',
            updatedDate: '',
            status: 1,
        };
        items.push(newOrder);
        this.setState({
            items: items
        });
    }


    handleRemove = (command) => {
        const { itemId, items } = this.state;
        const selectIdx = items.findIndex(u => u.id === itemId);
        if (command === 'create') {
            items.splice(selectIdx, 1);
            this.setState({
                items: items,
                deleteConfirm: false,
            })
        }
        if (command === 'edit') {
            let _id = items[selectIdx].id;
            if (!isNumber(_id)) {
                axios.delete(config.url + '/t-design-item/' + _id);
            }

            items.splice(selectIdx, 1);
            this.setState({
                items: items,
                deleteConfirmEdit: false,
            })
        }
    }



    getProductDescription = (_id) => {
        const { products } = this.state;
        if (_id) {
            const index = products.findIndex(i => i._id === _id);
            return products[index].description;
        }
    }


    handleReject = (command) => {
        const { tDesign } = this.state;
        if (command === 'reject') {
            this.setState({
                openrejectReason: true
            })
        }

        if (command === 'rejected') {
            const entity = {
                status: 0,
                reject_reason: tDesign.rejectReason,
            }
            axios.put(config.url + '/t-design/' + tDesign._id, entity)
                .then(res => {
                    this.reloadData('tDesigns', '/t-design-aggregation');
                    this.setState({
                        viewTDesignSubmitted: false,
                        openrejectReason: false,
                    })
                }).catch((error) => {
                    alert(error);
                });
        }


        if (command === 'closeRejected') {
            this.setState({
                openrejectReason: false
            })
        }
    }

    handleFindRequester = (name) => {
        const { employees } = this.state;
        const employee = employees.findIndex(u => u.name.first === name || u.name.first + ' ' + u.name.last === name || u.name.last === name);
        const objEmployee = employees[employee];
        if (objEmployee) {
            return objEmployee._id;
        }

    }
    handleCloseRequest = () => {
        const { tDesign } = this.state;

        closeRequest('t-design', tDesign._id);
        this.componentDidMount();
        if (this.componentDidMount()) {
            this.setState({
                viewTDesignInProgress: false,
            })
        }
    }

    fileSelectedHandler = event => {
        console.log(event.target.files[0]);

        // this.setState({
        //     selectedFile: event.target.files[0],
        // })

        // const fd = new FormData();
        // fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
        // axios.post('http://localhost:8000/api/upload', fd, {
        //     onUploadProgress: ProgressEvent => {
        //         // console.log('Upload Progress: ', + Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + '%')
        //     }
        // }).then(res => {
        //         // console.log(res);
        //     });
    }

    fileUploadHandler = () => {

        const fd = new FormData();
        fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
        axios.post('http://localhost:8000/api/upload', fd, {
            onUploadProgress: ProgressEvent => {
                // console.log('Upload Progress: ', + Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + '%')
            }
        })
            .then(res => {
                // console.log(res);
            });
    }

    getEmployeeName = (_id) => {
        const { employees } = this.state;
        const index = employees.findIndex(m => m._id = _id);
        if (employees[index]) {
            let first = employees[index].name.first;
            let last = employees[index].name.last;
            let name = first + ' ' + (last ? last : ' ');
            return name;
        }
    }

    handleApproved = () => {
        const { tDesign } = this.state;
        if (!tDesign.assignTo) {
            tDesign.assignToError = 'Assign To Wajib Diisi';
            this.setState({
                tDesign: tDesign
            })
        } else {
            const entity = {
                assign_to: tDesign.assignTo,
                status: 2,
            }
            axios.put(config.url + '/t-design/' + tDesign._id, entity)
                .then(res => {
                    this.reloadData('tDesigns', '/t-design-aggregation');
                    this.setState({
                        viewTDesignSubmitted: false,
                    })
                }).catch((error) => {
                    alert(error);
                });
        }
    }

    render() {
        // if (!isLogged()) {
        //     return (<Redirect to={'/login'} />)
        // }
        const { tDesigns, loading } = this.state;
        const { classes } = this.props;
        let i = 1;
        return (
            <div>
                <CreateTDesign
                    createNew={this.state.createNew}
                    handleToggle={this.handleToggle}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    handleRemove={this.handleRemove}
                    getEmployeeName={this.getEmployeeName}
                    handleCloseRemove={this.handleCloseRemove}
                    deleteConfirm={this.state.deleteConfirm}
                    handleDeleteConfirm={this.handleDeleteConfirm}
                    handleChangeSelectItems={this.handleChangeSelectItems}
                    addNewItem={this.addNewItem}
                    tDesign={this.state.tDesign}
                    tDesignItem={this.state.tDesignItem}
                    items={this.state.items}
                    products={this.state.products}
                    events={this.state.events}
                    getProductDescription={this.getProductDescription}
                />
                <EditTDesign
                    editTDesign={this.state.editTDesign}
                    handleToggle={this.handleToggle}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    handleRemove={this.handleRemove}
                    handleCloseRemove={this.handleCloseRemove}
                    getEmployeeName={this.getEmployeeName}
                    getProductDescription={this.getProductDescription}
                    handleDeleteConfirm={this.handleDeleteConfirm}
                    deleteConfirmEdit={this.state.deleteConfirmEdit}
                    handleChangeSelectItems={this.handleChangeSelectItems}
                    addNewItem={this.addNewItem}
                    tDesign={this.state.tDesign}
                    tDesignItem={this.state.tDesignItem}
                    items={this.state.items}
                    products={this.state.products}
                    events={this.state.events}
                    employees={this.state.employees}
                />
                <ViewTDesignSubmitted
                    viewTDesignSubmitted={this.state.viewTDesignSubmitted}
                    handleToggle={this.handleToggle}
                    handleClose={this.handleClose}
                    handleReject={this.handleReject}
                    handleSubmit={this.handleSubmit}
                    handleApproved={this.handleApproved}
                    handleChange={this.handleChange}
                    handleChangeSelectItems={this.handleChangeSelectItems}
                    addNewItem={this.addNewItem}
                    tDesign={this.state.tDesign}
                    tDesignItem={this.state.tDesignItem}
                    items={this.state.items}
                    products={this.state.products}
                    events={this.state.events}
                    employeeStaff={this.state.employeeStaff}
                    openrejectReason={this.state.openrejectReason}
                />
                <ViewTDesignInProgress
                    viewTDesignInProgress={this.state.viewTDesignInProgress}
                    handleToggle={this.handleToggle}
                    handleClose={this.handleClose}
                    getEmployeeName={this.getEmployeeName}
                    getProductDescription={this.getProductDescription}
                    handleCloseRequest={this.handleCloseRequest}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    handleChangeSelectItems={this.handleChangeSelectItems}
                    addNewItem={this.addNewItem}
                    tDesign={this.state.tDesign}
                    tDesignItem={this.state.tDesignItem}
                    items={this.state.items}
                    products={this.state.products}
                    events={this.state.events}
                    employeeStaff={this.state.employeeStaff}
                    fileSelectedHandler={this.fileSelectedHandler}
                    fileUploadHandler={this.fileUploadHandler}
                />
                <CircularProgress className={classes.progress} style={{ visibility: (loading ? 'visible' : 'hidden') }} color="secondary" />

                <br />
                <br />
                <br />
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Transaction Code</TableCell>
                                <TableCell>Request By</TableCell>
                                <TableCell>Request Date</TableCell>
                                <TableCell>Asign To</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell className={classes.action}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tDesigns.map(tDesign => {
                                return (
                                    <TableRow key={tDesign._id}>
                                        <TableCell>{i++}</TableCell>
                                        <TableCell>{tDesign.code}</TableCell>
                                        <TableCell>{tDesign.requestFirstName + ' ' + tDesign.requestLastName}</TableCell>
                                        <TableCell>{changeDateFormat(tDesign.request_date)}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {tDesign.assignToFirstName ? tDesign.assignToFirstName : '-' ?
                                                tDesign.assignToLastName ? tDesign.assignToLastName : '-' : ' - '}</TableCell>
                                        <TableCell>{changeValue(tDesign.status)}</TableCell>
                                        <TableCell>{changeDateFormat(tDesign.createDate)}</TableCell>
                                        <TableCell>{tDesign.createdByUsername}</TableCell>
                                        <TableCell className={classes.action}>
                                            <IconButton onClick={() => this.handleView(tDesign._id)}><SearchIcon color="primary" /></IconButton>
                                            <IconButton onClick={() => this.handleEdit(tDesign._id)}><EditIcon color="primary" /></IconButton>
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

Design.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Design);