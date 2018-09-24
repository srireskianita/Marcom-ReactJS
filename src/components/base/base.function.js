
export const userObjID = () => {
    let objUser = JSON.parse(localStorage.getItem('userData'));
    console.log(objUser._id);
}

export const capitalize = (str) => {
    let arr = str.split(' ');
    let newarr = [];
    arr.forEach(word => {
        newarr.push(word[0].toUpperCase() + word.slice(1));
    });
    return newarr.join(' ');
}


export const changeValue = function (status) {
    if (status === 0) {
        return 'Rejected';
    } else if (status === 1) {
        return 'Submited';
    } else if (status === 2) {
        return 'In Progress';
    } else if (status === 3) {
        return 'Done';
    }
}

export const changeDateFormat = function (date) {
    var ubahFormat = new Date(date);
    return ubahFormat.toLocaleDateString("id-ID"); // 18/08/2018
}