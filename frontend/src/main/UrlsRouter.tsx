import React from 'react';
import Set from "./Set";
import '../App.css'
import Users from "./Users";
import Login from "../login/Login";
import {TestTemplatesComponent} from "./test-template/Templates"
import {Navbar, Nav} from "react-bootstrap"
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {TestTemplate} from "./test-template/CreateTestTemplate";
import { LoginStatus } from './DataClasses';

class UrlsRouter extends React.Component<{login_status: LoginStatus}> {

    renderLogin() {
        return (
            <Router>
                <Redirect to={"/login"}/>
                <Switch>
                    <Route path="/login">
                        <Login onLogin={() => {this.forceUpdate()}}/>
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

                    </Navbar>
                    <Switch>
                        <Route path="/templates">
                            <TestTemplatesComponent/>
                        </Route>
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
            <div className='App'>
                    {(this.props.login_status.is_logged_in ? this.renderMain() : this.renderLogin())}
            </div>
        )
    }
}

export default connect(
    (state: LoginStatus) => {
        return {login_status: state};
    }
    ) (UrlsRouter);