import React from 'react';

class sr_for_users {
    data: any = [];
    isLoading: boolean = true;
    cook: string = "";
}

class Users extends React.Component<any, sr_for_users> {
    private url = "";
    constructor(props : any) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            cook: props.cook,
        }
    }
    componentDidMount() {
        fetch(this.url + "/api/users"
            , {headers: {
                    Authorization: `Token ${this.state.cook}`
                }}).then(res => {
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
            return data.map((item: any) => {
                console.log(item);
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
