import {LoginStatus} from '../../main/DataClasses';
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT"


const login_reducer = (
    state: LoginStatus = {isLogin: false, token: "", username: ""},
    action: { type: string, key: string }
): LoginStatus => {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                isLogin: true,
            });
        case LOGOUT:
            localStorage.setItem("isLogin", "false")
            return Object.assign({}, state, {
                isLogin: false,
                key: "",
            });
        default:
            return state;
    }

};
export default login_reducer;
