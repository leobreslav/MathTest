import Cookies from 'universal-cookie';
import {Spinner} from "react-bootstrap";
import React from "react";


function getCookie(name: string): string {
    let cookie_csrf: string = (new Cookies()).get(name);
    if (cookie_csrf)
        return cookie_csrf;
    else {
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookie_csrf = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookie_csrf;
    }
}

function getHeaders() {
    return {
        'Authorization': `Token ${localStorage.getItem("token")}`,
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json'
    };
}

function loading() {
    return (
        <div className="text-center">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>);
}


export {
    getCookie,
    getHeaders,
    loading
}