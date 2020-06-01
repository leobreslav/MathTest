import React from 'react';
import {getHeaders, loading} from './Functions';
import {User} from './DataClasses'
import url from "../Url";
import {Spinner} from "react-bootstrap";

class UsersState {
    data: User[] = [];
    isLoading: boolean = true;
}

class Users extends React.Component<{}, UsersState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        fetch(url + "/api/users",
            {headers: getHeaders()}).then(res => {
            return res.json();
        }).then(data => {
            this.setState({
                data,
                isLoading: false,
            });
        });
    }

    renderProducts() {
        const {data, isLoading} = this.state;
        if (isLoading) {
            return loading;
        } else {
            return data.map((item: User, index) => {
                return (
                    <li key={index}>{item.username}</li>
                );
            })
        }
    }

    render() {
        return (
            <div className='App'>
                <div className='product-list'>
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default Users;
