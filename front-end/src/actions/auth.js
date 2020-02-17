import axios from "axios";

import {
    REGISTER_PROCESS,
    LOGIN_PROCESS,
    LOGOUT_PROCESS,
    AUTH_PROCESS
} from "./types";
import { createMessage, returnErrors } from './messages'

export const loginProcess = (username, password) => async (dispatch) => {
    let result = await axios
        .post(
            "http://127.0.0.1:5000/api/auths/login",
            {
                username: username,
                password: password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(res => {
            dispatch({ type: LOGIN_PROCESS, payload: res.data }); // payload: TOKEN + ID + username + email
            return {id: res.data.id, token: res.data.token}
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status))
        });
    return result
};

export const registerProcess = (username, password, role) => dispatch => {
    axios
        .post(
            "http://127.0.0.1:5000/api/auths/register",
            {
                username: username,
                password: password,
                role: role
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(res => {
                res.data.role = role
                dispatch({ type: REGISTER_PROCESS, payload: res.data }); // payload: TOKEN + ID + username
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status))
        });
};

export const logoutProcess = (token) => dispatch => {
    axios
        .post(
            "http://127.0.0.1:5000/api/auths/logout",
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token 
                },
            }
        )
        .then(res => {
            if (res.status == 200){
                dispatch({ type: LOGOUT_PROCESS, payload: true }); // is not needed
            } else {
                console.log(res.data)
            }
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status))
        }); // Error would be Token expired
};

export const authProcess = (token) => dispatch => {
    axios
        .get(
            'http://127.0.0.1:5000/api/auths/verify',
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token 
                },
            }
        )
        .then(res => {
            dispatch({ type: AUTH_PROCESS, payload: res.data }); // payload: id, role
        })
        .catch(err => {
            console.log(err)
            dispatch({ type: LOGOUT_PROCESS, payload: true})
            dispatch(createMessage("Logged Out!"))
        });
}