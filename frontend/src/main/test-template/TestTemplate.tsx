import React from 'react';
import '../../App.css';
import {TestContent} from "./TestContent";

class TestTemplateState{
    cookie: string = ""
}

export class TestTemplate extends React.Component<any, TestTemplateState> {

    constructor(props: any) {
        super(props);
        this.state = {
            cookie: props.cook,
        }
    }

    render(): React.ReactNode {
        return (
            <div>
                <TestContent cook = {this.state.cookie} />
            </div>
        )
    }
}