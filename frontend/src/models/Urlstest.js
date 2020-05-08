import React from 'react';
import Set from "./Set";
import Users from "./Users";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

let testurl = () => {
    return (
        <Router>
            <div>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/sets">Sets</Link>
                    <Link to="/users">Users</Link>
                </div>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/sets">
                        <ul>
                            <Set/>
                        </ul>
                    </Route>
                    <Route path="/users">
                        <ul>
                            <Users/>
                        </ul>
                    </Route>
                    <Route path="/">
                        :)
                    </Route>
                </Switch>
            </div>
        </Router>);
};

export default testurl;