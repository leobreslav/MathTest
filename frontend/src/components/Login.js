import React from 'react';
import {login} from "../state";
import "bootstrap/dist/css/bootstrap.css"

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idlog: React.createRef(),
            idpass: React.createRef(),
            isLogin: false,
        }
    }

    componentDidMount() {
    }

    send() {
        let logtext = this.state.idlog.current.value;
        let passtext = this.state.idpass.current.value;


        login(logtext, passtext);
    }

    render() {
        const formsStyle = {
            width: '350px',
            height: '20%',
            marginRight: 'auto',
            marginLeft: 'auto',
            marginTop: '20%',
        };
        return (
            <div className="container">
                <form style={formsStyle} className="center-block">
                    <div className="form-group">
                        <input type="login" ref={this.state.idlog} className="form-control" id="exampleInputEmail1"
                               aria-describedby="emailHelp" placeholder="логин"/>
                    </div>
                    <div className="form-group">
                        <input ref={this.state.idpass} type="password" className="form-control"
                               id="exampleInputPassword1"
                               placeholder="пароль"/>
                    </div>
                    <div className="form-group text-center" style={{display: "block"}}>
                        <button type="submit" className="btn btn-primary" onClick={() => {
                            this.send()
                        }}>Вход
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login;
