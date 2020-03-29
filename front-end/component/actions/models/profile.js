import axios from "axios";
import { GET_PROFILE, POST_PROFILE, PUT_PROFILE, DELETE_PROFILE} from "../types/model_types";
import {LOGOUT_PROCESS} from "../types/auth_types"
import {CLEAR_ERRORS} from "../types/control_types"
import { setErrors } from '../control/errors';

export const getProfile = (id, token) => dispatch => {
    axios
        .get(
            `http://127.0.0.1:5000/api/profiles/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
            }
        )
        .then(res => {
            dispatch({ type: GET_PROFILE, payload: res.data }); // payload: email, dob, name, cvs[]
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
};

export const postProfile = (email, dob, name, token) => dispatch => {
    axios.post("http://127.0.0.1:5000/api/profiles/",
        {
            name: name,
            email: email,
            dob: dob
        }, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    }).then(res => {
        dispatch({ type: POST_PROFILE, payload: res.data }); // payload: email, dob, name, cvs[]
    })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
};

export const putProfile = (email, dob, name, token) => dispatch => {
    axios.put("http://127.0.0.1:5000/api/profiles/",
        {
            name: name,
            email: email,
            dob: dob
        }, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    }).then(res => {
        dispatch({ type: PUT_PROFILE, payload: res.data }); // payload: email, dob, name
    })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
};

export const deleteProfile = (token) => async (dispatch) => {
    let result = await axios.delete("http://127.0.0.1:500/api/profiles/",
        {
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            }
        }).then(() => {
            dispatch({ type: DELETE_PROFILE, payload: true });
            dispatch({ type: LOGOUT_PROCESS, payload: true });
            dispatch({ type: CLEAR_ERRORS, payload: true });
            return true;
        }).catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
            return false;
        });
    return result;
};