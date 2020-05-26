import React from 'react';
import '../../App.css';
import {TestContent} from "./TestContent";

class st_for_testtempl{
    cook: string = ""
}

export class TestTemplate extends React.Component<any, st_for_testtempl> {

    constructor(props: any) {
        super(props);
        console.log(props);
        this.state = {
            cook: props.cook,
        }
    }

    render(): React.ReactNode {
        return (
            <div>
                <TestContent cook = {this.state.cook} />
            </div>
        )
    }
}