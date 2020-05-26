import React from 'react';
import Task from "./Task";

class st_for_set{
    data: any =  [];
    cook: string = "";
    isLoading: boolean = true;
}

class Set extends React.Component<any, st_for_set> {
    private url = "";

    constructor(props : any) {
        super(props);
        this.state = {
            data: [],
            cook: props.cook,
            isLoading: true
        }
    }
    componentDidMount() {
        fetch(this.url + "/api/problem_prototypes" , {headers: {
                    Authorization: `Token ${this.state.cook}`
                }}).then(res => {
            return res.json();
        }).then(data => {
            this.setState({ data,
                isLoading: false,});
        });
    }
    renderProducts() {
        const {data, isLoading} = this.state;
        if (isLoading) {
            return <div> Загрузка!!!!</div>
        } else {
            return data.map((item: any ) => {
                return (
                    <li><div>{item.name}</div><ul><Task cook = {this.state.cook} id = {item.id}/></ul></li>
                );
            })
        }
    }


    render() {
        return (
            <div>
                <div className='product-list'>
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default Set;
