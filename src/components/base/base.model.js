import axios from 'axios';
import { config } from './base.config';

export const deleteData = (table, id) => {
    const entity = {
        is_delete: 1,
    }

    axios.put(config.url + '/' + table + '/' + id, entity)
        .then(res => {
            return true;
        }).catch((error) => {
            alert(error);
        });
}
 

export const closeRequest = (table, id) => {
    const entity = {
        status: 3,
    }

    axios.put(config.url + '/' + table + '/' + id, entity)
        .then(res => {
            return true;
        }).catch((error) => {
            alert(error);
        });
}

