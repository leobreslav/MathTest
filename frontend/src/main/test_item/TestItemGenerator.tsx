import React from 'react';
import {Spinner, Jumbotron, ButtonGroup, Button} from 'react-bootstrap';
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


export {TestItemGenerator};