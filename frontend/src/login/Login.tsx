import React from 'react';
import "bootstrap/dist/css/bootstrap.css"

class st_for_login{
    constructor(idlog: any, idpass : any,username: string, password: string) {
        this.idlog = idlog;
        this.idpass = idpass;
        this.username = username;
        this.password = password;
    }
    idlog: any;
    idpass: any;
    username: string;
    password: string;

}

class Login extends React.Component<any, st_for_login> {
    private url : string = "http://127.0.0.1:8000"
    constructor(props: any) {
        super(props);
        this.state = {
            idlog: React.createRef(),
            idpass: React.createRef(),
            username: "",
            password: "",
        };
        this.send = this.send.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

    }

    send(event : any) {
        event.preventDefault();
        let username = this.state.username;
        let password = this.state.password;
        let data = {
            username,
            email: "",
            password,
        };
        let headers = {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        };
        fetch("/api/auth/login/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        }).then(res => {
            return res.json();
        }).then(data => {
            console.log(data.key);
            let key = data.key;
            this.props.dispatch({
                type: "LOGIN",
                key,
            });
        }).catch(err => {
            console.log(err);})
    }

    handleChange(event : any) {
        let name = event.target.name;
        console.log(name);
        if(name === 'username'){
            this.setState({username: event.target.value});
        }
        else{
            this.setState({password: event.target.value});
        }
        event.preventDefault();
    }

    render() {
        const formsStyle = {
            width: '350px',
            height: '20%',
            marginRight: 'auto',
            marginLeft: 'auto',
            marginTop: '20%',
        };
        return (
            <div className="container">
                <form style={formsStyle} className="center-block" onSubmit={this.send}>
                    <div className="form-group">
                        <input type="login" name="username" ref={this.state.idlog} value={this.state.username} className="form-control" id="exampleInputEmail1"
                               aria-describedby="emailHelp" placeholder="логин" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <input ref={this.state.idpass} name="password" value={this.state.password} type="password" onChange={this.handleChange} className="form-control"
                               id="exampleInputPassword1"
                               placeholder="пароль"/>
                    </div>
                    <div className="form-group text-center" style={{display: "block"}}>
                        <button type="submit" className="btn btn-primary" >Вход
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
function getCookie(name: string) {
    let cookieValue = "";
    console.log(document.cookie);
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

export default Login;
