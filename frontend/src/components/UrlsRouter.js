import React from 'react';
import Set from "./Set";
import Users from "./Users";
import Login from "./Login";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

class UrlsRouter extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLogin: props.isLogin
        }
    }


    renderLogin() {
        return (
            <Router>
                <Redirect to={"/login"}/>
                    <Switch >
                        <Route path="/login">
                            <Login />
                        </Route>
                    </Switch>
            </Router>);
    }

    renderMain(){
        return (
            <Router>
                <Redirect to={"/"}/>
                <div>
                    <div>
                        <Link to="/">Home</Link>
                        <Link to="/sets">Sets</Link>
                        <Link to="/users">Users</Link>
                    </div>
                    <Switch>
                        <Route path="/sets">
                            <ul>
                                <Set key={this.state.key}/>
                            </ul>
                        </Route>

                        <Route path="/users">
                            <ul>
                                <Users key={this.state.key}/>
                            </ul>
                        </Route>

                        <Route path="/">
                            :)
                        </Route>
                    </Switch>
                </div>
            </Router>);
    }

    render() {
        return (
            <div className='App'>
                <div className='product-list'>
                    {(this.state.isLogin ? this.renderMain() :this.renderLogin())}
                </div>
            </div>
        )
    }
}

export default UrlsRouter;