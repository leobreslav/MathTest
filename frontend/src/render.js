import ReactDOM from "react-dom";
import React from "react";
import UrlsRouter from "./components/UrlsRouter";
import './index.css';
let render = (state) => ReactDOM.render(
    <React.StrictMode>
        <UrlsRouter  key = {state.key} isLogin = {state.isLogin}/>
    </React.StrictMode>,
    document.getElementById('root')
);

export default render;