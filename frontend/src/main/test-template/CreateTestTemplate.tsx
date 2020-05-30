import React from 'react';
import {ProblemPrototype} from '../DataClasses';
import {getHeaders} from '../Functions';
import {Alert} from 'react-bootstrap'

class TestContentState {
    chosenProblems: ProblemPrototype[] = [];
    availableProblems: ProblemPrototype[] = [];
    name: string = '';
    show_alert: boolean = false;
}


export class TestTemplate extends React.Component<{}> {

    render(): React.ReactNode {
        return (
            <div>
                <TestContent/>
            </div>
        )
    }
}


export class TestContent extends React.Component<{}, TestContentState> {

    // TODO change any to required type
    constructor(props: {}) {
        super(props);
        this.state = {
            chosenProblems: [],
            availableProblems: [],
            name: '',
            show_alert: false
        }
    }


    componentDidMount(): void {
        fetch("/api/problem_prototypes"
        , {headers: getHeaders()}).then(res => {
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

    renderAlert(): React.ReactNode {
        if (this.state.show_alert){
            setInterval(() => {this.setState({show_alert: false})}, 5000)
            return (
                <Alert variant="success" onClose={() => this.setState({show_alert: false})} dismissible>
                    Template created.
                </Alert>
            )
        }
        return <div></div>
    }

    render(): React.ReactNode {
        return (
            <div>
                {
                    this.renderAlert()
                }
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
                                    headers: getHeaders()
                                }
                            ).then(
                                res => {
                                    if (res.ok){
                                        this.setState({show_alert: true, chosenProblems: []});
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