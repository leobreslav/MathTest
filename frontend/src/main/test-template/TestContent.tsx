import React from 'react';
import './TestTemplate.css'
import {ProblemPrototype} from '../DataClasses';
import {getCookie} from '../Functions';

class TestContentState {
    chosenProblems: ProblemPrototype[] = [];
    availableProblems: ProblemPrototype[] = [];
    name: string = '';
    cookie: string = '';
}

export class TestContent extends React.Component<any, TestContentState> {

    // TODO change any to required type
    constructor(props: any) {
        super(props);
        this.state = {
            chosenProblems: [],
            availableProblems: [],
            name: '',
            cookie: props.cook
        }
    }


    componentDidMount(): void {
        fetch("/api/problem_prototypes"
        , {headers: {
                    Authorization: `Token ${this.state.cookie}`
                }}).then(res => {
            return res.json();
        }).then(data => {
            this.setState({availableProblems: data});
        })
    }

    renderProblems(list: Array<ProblemPrototype>, buttonShouldAdd: boolean) {
        let buttonName = 'удалить';
        if (buttonShouldAdd) {
            buttonName = 'Добавить'
        }
        return list.map(item => {
            return (
                <li className="list-group-item">
                    <h5>{item.name}</h5>
                    <p>{item.example.problem}</p>
                    <button onClick={() => {
                        if (buttonShouldAdd) {
                            this.setState(state => ({
                                chosenProblems: [...state.chosenProblems, item]
                            }))
                        } else {
                            let newChosenProblems = [...this.state.chosenProblems]
                            newChosenProblems.splice(this.state.chosenProblems.indexOf(item), 1)
                            this.setState({chosenProblems: newChosenProblems})

                        }
                        this.render()
                    }}
                            className="btn btn-primary float-right">{buttonName}
                    </button>
                </li>

            )
        })
    }


    render(): React.ReactNode {
        return (
            <div>
                <div className="input-group mt-3 mr-auto ml-auto w-50">
                    <input className="form-control" onChange={ event => this.setState({name: event.target.value})} placeholder="введите название теста"/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" onClick={() => {
                            const body = {
                                name: this.state.name,
                                prototype_ids: this.state.chosenProblems.map(
                                    (prototype: ProblemPrototype) => prototype.id
                                    )
                            };
                            fetch("/api/generate_template",
                                {
                                    method: 'POST',
                                    body: JSON.stringify(body),
                                    headers: {
                                        Authorization: `Token ${this.state.cookie}`,
                                        'X-CSRFToken': getCookie('csrftoken'),
                                        'Content-Type': 'application/json'
                                    }
                                }
                            )
                        }}>создать
                        </button>
                    </div>
                </div>
                <div>
                    <div className='w-50 float-right mt-5 mr-1'>
                        <ul className="list-group">
                            <li className="list-group-item active">список задач</li>
                            {this.renderProblems(this.state.availableProblems, true)}
                        </ul>
                    </div>
                    <div>
                        <div className='w-25 float-left mt-5 ml-1'>
                            <ul className="list-group">
                                <li className="list-group-item active">добавленные задачи</li>
                                {this.renderProblems(this.state.chosenProblems, false)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}