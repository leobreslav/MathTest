import React from 'react';
import {} from 'react-dom';
import {getCookie} from '../main/Functions';
import {LoginStatus} from '../main/DataClasses'
import {Form, Button, Container} from 'react-bootstrap'
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';

class LoginState{
    username: string = "";
    password: string = "";
    login_status: any;

}

class Login extends React.Component<{}, LoginState> {
    
    constructor(props: {}) {
        console.log("HELP");
        super(props);
        this.state = {
            username: "",
            password: "",
            login_status: null,
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
            res.json().then(data => {
                if (res.ok){
                    console.log(res);
                    let key = data.key;
                    let cookie: LoginStatus = {
                        is_logged_in: res.ok,
                        token: key,
                        username: username
                    }
                    let cookies = new Cookies();
                    cookies.set("login_status", cookie)
                    return <Redirect to="/" />

                }
                else {
                    this.setState({login_status: data})
                }
            })
        });
    }

    handleChange(event : any) {
        let target = event.target;
        let data = target.value;
        if ( target.name === "username" ) {
            this.setState({username: data});
            return;
        }
        if (target.name === "password"){
            this.setState({password: data});
            return;
        }
    }

    render() {
        return (
            <Container>
                <Form>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={this.handleChange} name="username" type="text" placeholder="Enter username" />
                        <Form.Text className="text-muted">
                        {this.state.login_status == null || this.state.login_status.username == undefined ? <p></p> : <p>{this.state.login_status.username}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                        <Form.Text className="text-muted">
                        {this.state.login_status == null || this.state.login_status.password == undefined ? <div></div> : <p>{this.state.login_status.password}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Text className="text-muted" color="red">
                        {this.state.login_status == null || this.state.login_status.non_field_errors == undefined ? <div></div> : <p>{this.state.login_status.non_field_errors}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={this.send}>
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }
}


export default Login;
