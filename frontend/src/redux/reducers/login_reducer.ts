import {Simulate} from "react-dom/test-utils";

const LOGIN = "LOGIN";

const login_reducer = (state: any = {isLogin: false}, action: any) => {
    switch (action.type) {
        case LOGIN:
            let key = action.key;
            console.log(key);
            return Object.assign({}, state, {
                isLogin: true,
                key: key
            });
        default:
            return state;
    }

};
export default login_reducer;
