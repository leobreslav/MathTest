import React from 'react';
import {Test, ProblemItem} from '../DataClasses';
import {Spinner, Jumbotron, ButtonGroup, Button, Card, Form, Container} from 'react-bootstrap';
import {getHeaders} from '../Functions';
import { RouteComponentProps } from 'react-router-dom';
import * as qs from 'qs';
import { isString } from 'util';
import {Redirect} from 'react-router'

class TestItemGenerator extends React.Component<RouteComponentProps, {isLoading: boolean, loadedItemId: number | null, yesSelected: boolean | null}> {
    constructor(props: RouteComponentProps){
        super(props);
        this.state = {
            loadedItemId: null,
            isLoading: false,
            yesSelected: null
        }
        this.generateItem = this.generateItem.bind(this);
    }

    template_id(): number | undefined{
        let id = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id; 
        if (isString(id)){
            return parseInt(id);
        }
    }

    generateItem(event: any){
        event.preventDefault();
        console.log(this);
        fetch('/api/generate_test?template_id='+ this.template_id(),
            {headers: getHeaders()}
        ).then( res => {
            res.json().then((data: {item_id: number}) =>
                {
                    this.setState({loadedItemId: data.item_id, yesSelected: true});
                }
            )
        });
    }

    render(): React.ReactNode{
        if (this.state.loadedItemId === null && this.state.yesSelected === null){
            return (
                <div>
                    <Jumbotron fluid>
                        <h3>
                            Do you want to start test?
                        </h3>
                        <p>
                        </p>
                        <ButtonGroup>
                            <Button type="submit" onClick={this.generateItem}>Yes</Button>
                            <Button variant="secondary" onClick={ (event:any) => {this.setState({yesSelected: false})}}>No</Button>
                        </ButtonGroup>

                    </Jumbotron>
                </div>
            )
        }
        if (this.state.isLoading) {
            return (
                <div>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        if (this.state.yesSelected)
            return (<Redirect to={"/test?id=" + this.state.loadedItemId}/>)
        return (<Redirect to="/"/>)
    }
}

class TestComponent extends React.Component<RouteComponentProps, {isLoading: boolean, test: Test}> {

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
                            {problem.problem_head.problem}
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

export {TestItemGenerator, TestComponent};