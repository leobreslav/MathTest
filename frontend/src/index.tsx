import './index.css';
import React from "react";
import ReactDOM from 'react-dom';
import UrlsRouter from "./main/UrlsRouter";
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Provider} from 'react-redux'
import store from './redux/store'

let render = () => ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <UrlsRouter/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
render();

