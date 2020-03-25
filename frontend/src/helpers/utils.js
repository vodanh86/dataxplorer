import moment from 'moment'

export function getUpdatedToken() {
    window.location.href = process.env.REACT_APP_AUTH_URL
}

export function formatDatetime(unixTimestamp){
    var now = new Date(unixTimestamp * 1000);
    return moment(now).format('DD-MM-YYYY HH:mm:ss');
}
