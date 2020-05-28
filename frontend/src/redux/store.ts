import {combineReducers, createStore} from "redux";
import login_reducer from "./reducers/login_reducer";


let store = createStore(login_reducer);

export default store;