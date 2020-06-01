import React from 'react';
import {ProblemHead} from './DataClasses';
import {getHeaders, loading} from './Functions';
import url from "../Url";
import {Spinner} from "react-bootstrap";

class TaskState {
    data: ProblemHead[] = [];
    id: number = 0;
    cookie: string = "";
    isLoading: boolean = true
}

class Task extends React.Component<any, TaskState> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
            id: props.id,
            cookie: props.cook,
            isLoading: true,
        }
    }

    componentDidMount() {
        fetch(url + `/api/problem_heads/${this.state.id}`
            , {headers: getHeaders()}).then(res => {
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
            return data.map((item: ProblemHead) => {
                return <li
                    key={item.id}> {(item.problem.length - 20 > 3 ? item.problem.substring(0, 19) + "..." : item.problem)}</li>
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

export default Task;
