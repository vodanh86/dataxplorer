import moment from 'moment'

export function getUpdatedToken() {
    window.location.href = process.env.REACT_APP_AUTH_URL
}

export function formatDatetime(strDate){
    console.log(strDate);
    var now = new Date(strDate);
    return moment(now).format('DD-MM-YYYY HH:mm:ss');
}
