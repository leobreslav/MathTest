import React from 'react';
import {getHeaders} from '../main/Functions';
import {Form, Button, Container, Alert} from 'react-bootstrap'
import url from "../Url";

class LoginState {
    username: string = "";
    password: string = "";
    loginStatus: any;
    loginMessage: string = "";
}

class Login extends React.Component<{onLogin: () => void}, LoginState> {

    constructor(props: {onLogin: () => void}) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginStatus: null,
            loginMessage: "",
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
            headers: getHeaders(),
            body: JSON.stringify(data),
        }).then(res => {
            res.json().then(data => {
                if (res.ok) {
                    let key: string = data.key;
                    localStorage.setItem("isLogin", "true");
                    localStorage.setItem("token", key);
                    this.props.onLogin();
                } else {
                    console.log(res.statusText);
                    this.setState({loginStatus: "error", loginMessage: data["non_field_errors"]})
                }
            })
        });
    }

    handleChange(event: any) {
        let target = event.target;
        let data = target.value;
        if (target.name === "username") {
            this.setState({username: data, loginStatus: null});
            return;
        }
        if (target.name === "password") {
            this.setState({password: data, loginStatus: null});
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
                            {this.state.loginStatus === null || this.state.loginStatus.username === undefined ?
                                <p></p> : <p>{this.state.loginStatus.username}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChange} name="password" type="password"
                                      placeholder="Password"/>
                        <Form.Text className="text-muted">
                            {this.state.loginStatus === null || this.state.loginStatus.password === undefined ?
                                <div></div> : <p>{this.state.loginStatus.password}</p>}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Text className="text-muted" color="red">
                            {this.state.loginStatus === null || this.state.loginStatus.non_field_errors === undefined ?
                                <div></div> : <p>{this.state.loginStatus.non_field_errors}</p>}
                        </Form.Text>
                    </Form.Group>
                    {(this.state.loginStatus !== "error" ? (<div/>) : <Alert variant='danger'>
                        {this.state.loginMessage}
                    </Alert>)}
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
