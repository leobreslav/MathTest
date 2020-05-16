import React from 'react';
import state from "../state";

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            id: props.id,
        }
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/problem_heads/${this.state.id}`, true);
        xhr.setRequestHeader("Authorization", `Token ${state.key}`);
        xhr.send();
        this.setState({isLoading: true});

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
        const {data, isLoading} = this.state;
        if (isLoading) {
            return <div> Загрузка!!!!</div>
        } else {
            return data.map(item => {
                return <li key={item} > {(item.problem.length - 20 > 3? item.problem.substring(0, 19) + "..." : item.problem)}</li>
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

export default Task;
