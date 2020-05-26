import React from 'react';

class st_for_task {
    data: any = [];
    id: number = 0;
    cook: string = "";
    isLoading: boolean = true
}

class Task extends React.Component<any, st_for_task> {
    private url = "";
    constructor(props : any) {
        super(props);
        this.state = {
            data: [],
            id: props.id,
            cook: props.cook,
            isLoading: true,
        }
    }

    componentDidMount() {
        fetch(this.url + `/api/problem_heads/${this.state.id}`
            , {headers: {
                    Authorization: `Token ${this.state.cook}`
                }}).then(res => {
            return res.json();
        }).then(data => {
            this.setState({ data,
                isLoading: false,});
        });
    }

    renderProducts() {
        const {data, isLoading} = this.state;
        if (isLoading) {
            return <div> Загрузка!!!!</div>
        } else {
            return data.map((item: any) => {
                return <li key={item} > {(item.problem.length - 20 > 3? item.problem.substring(0, 19) + "..." : item.problem)}</li>
            })
        }
    }

    render() {
        return (
            <div >
                <div className='product-list'>
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default Task;
