import React from 'react';
import Set from "./Set";
import '../App.css'
import Users from "./Users";
import Login from "../login/Login";
import {TestTemplatesComponent} from "./test-template/Templates"
import {Navbar, Nav} from "react-bootstrap"
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {TestItemGenerator} from './test_item/TestItemGenerator'
import {TestComponent} from './test_item/TestComponent'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {TestTemplate} from "./test-template/CreateTestTemplate";

class UrlsRouter extends React.Component<{logOut: () => void, logIn: () => void}>{

    constructor(props: {logOut: () => void, logIn: () => void}) {
        super(props);
        this.exit.bind(this)
        this.login.bind(this)
    }

    exit() {
        this.props.logOut();
    }
    login() {
        this.props.logIn();
    }

    renderLogin() {
        return (
            <Router>
                <Redirect to={"/login"}/>
                <Switch>
                    <Route path="/login">
                        <Login onLogin={() => this.login()}/>
                    </Route>
                </Switch>
            </Router>);
    }

    renderMain() {
        return (
            <Router>
                <Navbar expand="lg" bg="dark" variant="dark">

                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/sets">All Sets</Nav.Link>
                        <Nav.Link as={Link} to="/users">All Users</Nav.Link>
                        <Nav.Link as={Link} to="/">Create Template</Nav.Link>
                        <Nav.Link as={Link} to="/templates">My Templates</Nav.Link>
                    </Nav>

                    <Link to="/login" onClick={() => {
                        this.exit();
                    }}>
                        Exit
                    </Link>
                    </Navbar>
                    <Switch>
                        <Route path="/templates">
                            <TestTemplatesComponent/>
                        </Route>
                        <Route path="/generate_test" component={TestItemGenerator}>
                        </Route>
                        <Route path="/test" component={TestComponent}></Route>
                    <Route path="/sets">
                        <Set/>
                    </Route>

                    <Route path="/users">
                        <Users/>
                    </Route>
                    <Route path="/">
                        <TestTemplate/>
                    </Route>

                </Switch>
            </Router>);
    }

    render() {
        return (
            <div>
                {(localStorage.getItem("isLogin") === "true" ? this.renderMain() : this.renderLogin())}
            </div>
        )
    }
}

export default connect(state => ({state: state}),
    dispatch => ({
        logOut: () => {
            dispatch({type: 'LOGOUT'});
        },
        logIn: () =>{
            dispatch({type: 'LOGIN'})
        }
    }))(UrlsRouter);