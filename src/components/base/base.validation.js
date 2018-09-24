
/**
 * Create Some Function For Validate Something What I Want
 * 
 * Just do it
 */

const errors = [];

function Validation() {

    this.username = function (name, value) {
        console.log(name, value);
    }

    this.password = function () {

    }

    this.email = function () {

    }

    this.checkPassword = function(entity){
        if(entity.password !== entity.re_password){
            errors['re_password'] = "Password Tidak Boleh Sama";
        }else{
            errors['re_password'] = '';
        }

            if(errors['re_password'] !== ''){
                errors['passvalid'] = true;
            }
    
        return errors;
    }

    this.checkEmpty = function(name, value){
        if(value === ''){
            errors[name + 'Error'] = name + ' Tidak Boleh Kosong';
        }

        if(errors){
            errors['isErro r'] = true;
        }else{
            errors['isError'] = false;
        }

        return errors;
    }

    this.isEmpty = function(name, value){
        if(value===''){
            errors[name + 'Error'] = name + ' is empty';
            errors['isError'] = true;
        }else{
            errors[name + 'Error'] = '';
            errors['isError'] = false;
        }
        return errors;
    }

    // this.isEmpty = function (objArray, include = null) {
    //     if (include) {
    //         for (let key in include) {
    //             if (objArray[key] == '') {
    //                 errors[key + 'Error'] = 'Tidak Boleh Kosong';
    //             } else {
    //                 errors[key + 'Error'] = '';
    //             }
    //         }

    //         // }else{
    //         //     if(objArray[include] == ''){
    //         //         errors[include + 'Error'] = 'Tidak Boleh Kosong';
    //         //     }else{
    //         //         errors[include + 'Error'] = '';
    //         //     }
    //         // }
    //     } else {
    //         for (let key in objArray) {
    //             if (objArray[key] == '') {
    //                 errors[key + 'Error'] = 'Tidak Boleh Kosong';
    //             } else {
    //                 errors[key + 'Error'] = '';
    //             }
    //         }
    //     }

    //     for(let key in errors){
    //         if(errors[key] == ''){
    //             errors['valid'] = true;
    //         }
    //     }
    //     return errors;
    // }
}

module.exports = new Validation();