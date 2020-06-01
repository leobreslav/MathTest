import React from 'react';
import Set from "./Set";
import '../App.css'
import Users from "./Users";
import Login from "../login/Login";
import {TestTemplatesComponent} from "./test-template/Templates"
import {Navbar, Nav} from "react-bootstrap"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import {TestTemplate} from "./test-template/CreateTestTemplate";

class UrlsRouter extends React.Component<any, any>{

    constructor(props : any) {
        super(props);
    }

    renderLogin() {
        return (
            <Router>
                <Redirect to={"/login"}/>
                <Switch>
                    <Route path="/login">
                        <Login onLogin = {this.props.dispatch}/>
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
                            console.log("keydown");
                            this.props.dispatch({type: "LOGOUT"})
                        }}>
                            Exit
                        </Link>

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
        console.log(localStorage.getItem("isLogin"));
        return (
            <div >
                    {(localStorage.getItem("isLogin") === "true" ? this.renderMain() : this.renderLogin())}
            </div>
        )
    }
}

export default UrlsRouter;