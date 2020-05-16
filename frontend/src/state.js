import render from "./render";

let state = {
    isLogin: false,
    key: "",
};
export let login = (loginmes, password) =>{

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8000/api/auth/login/', true);
    //xhr.setRequestHeader('X-CSRFToken);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`csrfmiddlewaretoken=${getCookie('csrftoken')}&username=${loginmes}&password=${password}`);
    xhr.onreadystatechange = () => {
        alert(xhr.readyState);
        if (xhr.readyState !== 4) {
            return false
        }
        if (xhr.status !== 200) {
            console.log(xhr.status + ':' + xhr.statusText)
        } else {
            state.key = JSON.parse(xhr.response).key;
            console.log(xhr.response);
            state.isLogin = true;
            render(state);
        }
    };
};

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default state;