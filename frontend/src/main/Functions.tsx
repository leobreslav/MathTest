import Cookies from 'universal-cookie';
import {LoginStatus} from './DataClasses'

function getCookie(name: string):string {
    return (new Cookies()).get(name)
};

function getHeaders() {
    let cookies = new Cookies();
    return {
        Authorization: `Token ${cookies.get<LoginStatus>("login_status").token}`,
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json'
    }
}

export {
    getCookie,
    getHeaders
}