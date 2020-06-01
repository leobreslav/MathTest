import React from 'react';
import Task from "./Task";
import {ProblemPrototype} from './DataClasses';
import {getHeaders, loading} from './Functions'
import url from "../Url";
import {Spinner} from "react-bootstrap";

class SetState{
    data: ProblemPrototype[] =  [];
    isLoading: boolean = true;
}

class Set extends React.Component<{}, SetState> {

    constructor(props : {}) {
        super(props);
        this.state = {
            data: [],
            isLoading: true
        }
    }
    componentDidMount() {
        fetch(url+ "/api/problem_prototypes" , {headers: getHeaders()}).then(res => {
            return res.json();
        }).then(data => {
            this.setState({ data,
                isLoading: false,});
        });
    }
    renderProducts() {
        const {data, isLoading} = this.state;
        if (isLoading) {
            return loading;
        } else {
            return data.map((item: ProblemPrototype) => {
                return (
                    <li><div>{item.name}</div><ul><Task id = {item.id}/></ul></li>
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
