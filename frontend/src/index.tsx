import './index.css';
import React from "react";
import ReactDOM from 'react-dom';
import UrlsRouter from "./main/UrlsRouter";
import store from "./redux/store";
import {BrowserRouter} from "react-router-dom";
store.subscribe(() =>{
    render(store.getState());
});
let render = (state: any) => ReactDOM.render(
    <BrowserRouter>
        <UrlsRouter state = {state} dispatch ={store.dispatch.bind(store)} />
    </BrowserRouter>,
    document.getElementById('root')
);
render(store.getState());

