import React from 'react';
import {Test, ProblemItem, MathJaxConfig} from '../DataClasses';
import {Spinner, Button, Card, Form, Container} from 'react-bootstrap';
import {getHeaders} from '../Functions';
import { RouteComponentProps } from 'react-router-dom';
import * as qs from 'qs';
import { isString } from 'util';
import MathJax from 'react-mathjax-preview';

export class TestComponent extends React.Component<RouteComponentProps, {isLoading: boolean, test: Test}> {

    constructor(props: RouteComponentProps){
        super(props);

        this.state = {
            isLoading: true,
            test: new Test()
        }
        this.onAllButtonClick = this.onAllButtonClick.bind(this);
        this.onAnswerHandler = this.onAnswerHandler.bind(this);
        this.onProblemButtonClick = this.onProblemButtonClick.bind(this);
    }

    componentDidMount(){
        fetch("/api/get_test?id=" + this.item_id(), {
            headers: getHeaders()
        }).then(res => {
            return res.json();
        }).then(
            (data: Test) => {
                this.setState({
                    isLoading: false,
                    test: data
                });
            }
        )
    }
    
    item_id(): number | undefined{
        let id = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id; 
        if (isString(id)){
            return parseInt(id);
        }
    }

    onAnswerHandler(event: any){
        let ids: {problem: number, point: number} = JSON.parse(event.target.id);
        let test = this.state.test;
        test.problem_items.find(
            val => val.id == ids.problem
        )!.points.find(
            point => point.id== ids.point
        )!.answer = event.target.value;
        this.setState({test});
    }

    onProblemButtonClick(event: any){
        let id = parseInt(event.target.id);
        this.state.test.problem_items.find(
            val => val.id == id
            )!.points.forEach(point => {
                fetch("/api/point_item",{
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        id: point.id,
                        answer: point.answer
                    })
                });
        }); 
    }

    onAllButtonClick(event: any) {
        this.state.test.problem_items.forEach(
            problem => {
                problem.points.forEach(
                    point => {
                        fetch("/api/point_item",{
                            method: "PUT",
                            headers: getHeaders(),
                            body: JSON.stringify({
                                id: point.id,
                                answer: point.answer
                            })
                        });
                    }
                )
            }
        )
    }

    renderPoints(problemItem: ProblemItem) {
        return problemItem.problem_head.problempoint_set.map(point => {
            let item = problemItem.points.find(point_item => point_item.num_in_problem==point.num_in_problem)!;
            return (
                <Form.Group as={Card} size="sm" style={{margin: "8px"}}>
                    <Form.Label >
                        Point {item.num_in_problem + 1}
                    </Form.Label>
                    <Form.Control
                        onChange={this.onAnswerHandler}
                        placeholder="enter your answer"
                        name="problem_point"
                        id={JSON.stringify({problem: problemItem.id, point: item.id})}
                        defaultValue={item.answer} />
                </Form.Group>
            )
        })
    }

    renderProblems() {
        return this.state.test.problem_items.map((problem) => {
            return (
                <Card as={Form} style={{margin: "32px"}} fluid>
                    <Form.Group>
                        <Form.Label>Problem {problem.index+1}</Form.Label>
                        <Form.Text>
                            <MathJax 
                            config={
                                MathJaxConfig
                            }
                            math={problem.problem_head.problem}>
                                
                            </MathJax>
                        </Form.Text>
                        {this.renderPoints(problem)}
                        <Button id={problem.id.toString()} onClick={this.onProblemButtonClick}>Save Answer</Button>
                    </Form.Group>
                </Card>
            )
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        return (
            <Container>
                <h2>
                    {this.state.test.name}
                </h2>
                {this.renderProblems()}
                <Button type="submit" onClick={this.onAllButtonClick}>Save All</Button>
            </Container>
        )
    }


}