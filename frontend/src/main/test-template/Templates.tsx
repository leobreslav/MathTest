import React from 'react';
import '../../App.css';
import {TestTemplate} from '../DataClasses';
import {getHeaders} from '../Functions';
import {Spinner, Container, Card, Row, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'



export class TestTemplatesComponent extends React.Component<{}, {is_loading:boolean, data: TestTemplate[]}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            is_loading: true,
            data: []
        }
        fetch("/api/templates", {
            headers: getHeaders(),
        }).then(
            data =>{
                return data.json();
            }
        ).then(
            data =>{
                this.setState({data, is_loading: false})
            }
        )
    }

    renderItems(): React.ReactNode {
        return this.state.data.map((item: TestTemplate) => {
            return (
                    <Card style={{ width: '18rem', margin: "20px"}}>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                            <p>
                                Items: {item.items.length}
                            </p>
                            <p>
                                Prototypes: {item.prototypes.length}
                            </p>
                            <p>
                                Link to test: <Link to={"/generate_test?id="+item.id}>{"/generate_test?id="+item.id}</Link>
                            </p>
                        </Card.Text>
                    </Card>
            )
        })
    }

    render(): React.ReactNode {
        if (this.state.is_loading) {
            return (
                <div>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )
        }

        return (
            <Container fluid="lg">
                <Row>
                {
                    this.renderItems()
                }
                </Row>
            </Container>
        )
    }
}