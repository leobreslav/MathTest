import React from 'react';
import {getHeaders} from './Functions';
import {User} from './DataClasses'

class UsersState {
    data: User[] = [];
    isLoading: boolean = true;
}

class Users extends React.Component<{}, UsersState> {
    private url = "";
    constructor(props : {}) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
        }
    }
    componentDidMount() {
        fetch(this.url + "/api/users",
         {headers: getHeaders()}).then(res => {
            return res.json();
        }).then(data => {
            this.setState({ data,
                isLoading: false,});
        });
    }
    renderProducts() {
        const { data, isLoading } = this.state;
        if (isLoading) {
            return <div> Загрузка!!!!</div>
        } else {
            return data.map((item: User) => {
                return (
                    <li>{item.username}</li>
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
