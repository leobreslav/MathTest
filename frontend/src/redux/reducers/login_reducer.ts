import {LoginStatus} from '../../main/DataClasses';
import Cookies from 'universal-cookie';
import {setLoginCookie} from '../../main/Functions'
const LOGIN = "LOGIN";


const login_reducer = (
    state: LoginStatus = (new Cookies).get<LoginStatus>("login_status"),
    action: {type: string, state: LoginStatus}
    ) : LoginStatus => {
    switch (action.type) {
        case LOGIN:
            state = action.state;
            setLoginCookie(state);
            return state;
        default:
            if (state === undefined){
                state = {is_logged_in: false, token: "", username: ""}
                setLoginCookie(state);
            }
            return state;
    }

};
export default login_reducer;
