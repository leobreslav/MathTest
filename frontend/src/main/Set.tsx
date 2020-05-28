import React from 'react';
import Task from "./Task";
import {ProblemPrototype} from './DataClasses';

class SetState{
    data: ProblemPrototype[] =  [];
    cookie: string = "";
    isLoading: boolean = true;
}

class Set extends React.Component<any, SetState> {
    private url = "";

    constructor(props : any) {
        super(props);
        this.state = {
            data: [],
            cookie: props.cook,
            isLoading: true
        }
    }
    componentDidMount() {

        fetch(this.url + "/api/problem_prototypes" , {headers: {
                    Authorization: `Token ${this.state.cookie}`
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
            return data.map((item: ProblemPrototype) => {
                return (
                    <li><div>{item.name}</div><ul><Task cook = {this.state.cookie} id = {item.id}/></ul></li>
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
