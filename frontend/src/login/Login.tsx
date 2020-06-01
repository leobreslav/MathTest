import React from 'react';
import {getHeaders} from '../main/Functions';
import {Form, Button, Container} from 'react-bootstrap'
import url from "../Url";

class LoginState {
    username: string = "";
    password: string = "";
    login_status: any;
}

class Login extends React.Component<any, LoginState> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: "",
            login_status: null,
        };
        this.send = this.send.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    send(event: any) {
        event.preventDefault();
        let username = this.state.username;
        let password = this.state.password;
        let data = {
            username,
            email: "",
            password,
        };
        fetch(url + "/api/auth/login/", {
            method: "POST",
            headers: getHeaders("POST"),
            body: JSON.stringify(data),
        }).then(res => {
            res.json().then(data => {
                if (res.ok) {
                    let key = data.key;
                    localStorage.setItem("isLogin", "true");
                    localStorage.setItem("token", key);
                    this.props.onLogin({type: "LOGIN", key: key});
                } else {
                    console.log("errr");
                    console.log(res.statusText);
                }
            })
        });
    }

    handleChange(event: any) {
        let target = event.target;
        let data = target.value;
        if (target.name === "username") {
            this.setState({username: data});
            return;
        }
        if (target.name === "password") {
            this.setState({password: data});
            return;
        }
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
            <Container>
                <Form style={formsStyle}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={this.handleChange} name="username" type="text"
                                      placeholder="Enter username"/>
                        <Form.Text className="text-muted">
                            {this.state.login_status === null || this.state.login_status.username === undefined ?
                                <p></p> : <p>{this.state.login_status.username}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChange} name="password" type="password"
                                      placeholder="Password"/>
                        <Form.Text className="text-muted">
                            {this.state.login_status === null || this.state.login_status.password === undefined ?
                                <div></div> : <p>{this.state.login_status.password}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Text className="text-muted" color="red">
                            {this.state.login_status === null || this.state.login_status.non_field_errors === undefined ?
                                <div></div> : <p>{this.state.login_status.non_field_errors}</p>}
                        </Form.Text>
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" type="submit" onClick={this.send}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Container>
        );
    }
}


export default Login;
