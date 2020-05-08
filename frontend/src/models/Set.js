import React from 'react';
import Task from "./Task";
class Set extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
        }
    }
    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/problem_prototypes', true);
        xhr.send();
        this.setState({ isLoading: true });

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return false
            }

            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.statusText)
            } else {
                console.log(xhr);
                this.setState({
                    data: JSON.parse(xhr.response),
                    isLoading: false,
                })
            }
        }
    }
    renderProducts() {
        const { data, isLoading } = this.state;
        if (isLoading) {
            return <div> Загрузка!!!!</div>
        } else {
            return data.map(item => {
                return (
                    <li><div>{item.name}</div><ul><Task id = {item.id}/></ul></li>
                );
            })
        }
    }
    render() {
        return (
            <div className='App'>
                <div className='product-list'>
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default Set;
