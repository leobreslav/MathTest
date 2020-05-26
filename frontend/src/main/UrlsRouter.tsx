import React from 'react';
import Set from "./Set";
import Users from "./Users";
import Login from "../login/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import {TestTemplate} from "./test-template/TestTemplate";


class st_for_urls {
    isLogin: boolean = false;
    key: string = ""
}

class UrlsRouter extends React.Component<any, st_for_urls> {
    constructor(props: any) {
        super(props);
        console.log(props);
        this.state = {
            isLogin: props.state.isLogin,
            key: props.state.key,
        }
    }


    renderLogin() {
        return (
            <Router>
                <Redirect to={"/login"}/>
                <Switch>
                    <Route path="/login">
                        <Login dispatch={this.props.dispatch}/>
                    </Route>
                </Switch>
            </Router>);
    }

    renderMain() {
        console.log(this.props.state.key);
        return (
            <Router>
                <Redirect to={"/"}/>
                <div>
                    <div>
                        <Link to="/sets">Sets</Link>
                        <Link to="/users">Users</Link>
                        <Link to="/">Test-template</Link>
                    </div>
                    <Switch>
                        <Route path="/sets">
                            <Set cook={this.props.state.key}/>

                        </Route>

                        <Route path="/users">
                            <Users cook={this.props.state.key}/>
                        </Route>
                        <Route path="/">
                            <TestTemplate cook={this.props.state.key}/>
                        </Route>
                    </Switch>
                </div>
            </Router>);
    }

    render() {
        console.log("render");
        console.log(this.props.state);
        return (
            <div className='App'>
                <div className='product-list'>
                    {(this.props.state.isLogin ? this.renderMain() : this.renderLogin())}
                </div>
            </div>
        )
    }
}

export default UrlsRouter;