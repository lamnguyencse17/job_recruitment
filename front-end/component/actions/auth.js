import axios from "axios";

import {
    REGISTER_PROCESS,
    LOGIN_PROCESS,
    LOGOUT_PROCESS,
    AUTH_PROCESS,
    VERIFY_PROCESS,
    CLEAR_ERRORS
} from "./types";
import { setErrors } from './errors';

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
            return { id: res.data.id, token: res.data.token };
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data.message, err.response.status));
            return false;
        });
    return result;
};

export const registerProcess = (username, password, role) => async dispatch => {
    let result = await axios
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
            res.data.role = role;
            dispatch({ type: REGISTER_PROCESS, payload: res.data }); // payload: TOKEN + ID + username
            return true;
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
            return false;
        });
    return result;
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
        .then(() => {
            dispatch({ type: CLEAR_ERRORS, payload: true });
            dispatch({ type: LOGOUT_PROCESS, payload: true }); // is not needed
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        }); // Error would be Token expired
};

export const authProcess = (token) => async dispatch => {
    let result = await axios
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
            return true
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: LOGOUT_PROCESS, payload: true });
            return false
        });
    return result
};

export const verifyProcess = (token, password) => dispatch => {
    axios
        .post(
            'http://127.0.0.1:5000/api/auths/verify',
            {
                password: password
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
            }
        )
        .then(() => {
            dispatch({ type: VERIFY_PROCESS, payload: true }); // payload: id, role
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors("Wrong password", 401));
        });
};