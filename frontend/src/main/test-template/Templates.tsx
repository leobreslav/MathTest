import React from 'react';
import '../../App.css';
import {TestTemplate} from '../DataClasses';
import {getHeaders, loading} from '../Functions';
import {Container, Card, Row} from 'react-bootstrap'
import url from "../../Url";

export class TestTemplatesComponent extends React.Component<{}, {is_loading:boolean, data: TestTemplate[]}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            is_loading: true,
            data: []
        }
        fetch(url+ "/api/templates", {
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
                        </Card.Text>
                    </Card>
            )
        })
    }

    render(): React.ReactNode {
        if (this.state.is_loading) {
            return loading;
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