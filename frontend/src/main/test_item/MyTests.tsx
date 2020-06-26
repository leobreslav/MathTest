
import React from 'react'
import {Test} from '../DataClasses'
import {loading} from '../Functions'
import {Card, Container} from 'react-bootstrap'
import {getHeaders} from '../Functions'

export class MyTests extends React.Component<{}, {
    tests: Test[],
    isLoading: boolean
}>{
    constructor(props: {}){
        super(props);
        this.state = {
            tests: [],
            isLoading: true
        }
    }
    componentDidMount() {
        fetch('/api/tests', {headers: getHeaders()}).then(
            response => response.json()
        ).then(tests => {
            this.setState({tests, isLoading: false})
        })
    }

    renderTests(){
        return this.state.tests.map(
            (test) => {
                return (
                    <Card>
                        <Card.Header>{test.name}</Card.Header>
                        <Card.Body>
                            Complete: {test.isComplete() ? "Yes" : "No"}
                            Your score: {test.score()}
                            Link to continue test: <a href={"/test?id=" + test.id}></a>
                        </Card.Body>
                    </Card>
                )
            }
        )
    }

    render(){
        if (this.state.isLoading){
            return loading()
        }
        return(
            <Container>
                {this.renderTests()}
            </Container>
        )
    }

}