import './index.css';
import React from "react";
import ReactDOM from 'react-dom';
import UrlsRouter from "./main/UrlsRouter";
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

let render = () => ReactDOM.render(
    <BrowserRouter>
        <UrlsRouter/>
    </BrowserRouter>,
    document.getElementById('root')
);
render();

