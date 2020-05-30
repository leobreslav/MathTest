import React from 'react';
import {ProblemHead} from './DataClasses';
import {getHeaders} from './Functions';

class TaskState {
    data: ProblemHead[] = [];
    id: number = 0;
    cookie: string = "";
    isLoading: boolean = true
}

class Task extends React.Component<any, TaskState> {
    private url = "";
    constructor(props : any) {
        super(props);
        this.state = {
            data: [],
            id: props.id,
            cookie: props.cook,
            isLoading: true,
        }
    }

    componentDidMount() {
        fetch(this.url + `/api/problem_heads/${this.state.id}`
            , {headers: getHeaders()}).then(res => {
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
            return data.map((item: ProblemHead) => {
                return <li key={item.id} > {(item.problem.length - 20 > 3? item.problem.substring(0, 19) + "..." : item.problem)}</li>
            })
        }
    }

    render() {
        return (
            <div >
                <div className='product-list'>
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default Task;
