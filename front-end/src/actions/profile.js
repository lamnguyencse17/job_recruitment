import axios from "axios";
import {GET_PROFILE, POST_PROFILE} from "./types"

export const getProfile = (id, token) => dispatch => {
    axios
        .get(
            `http://127.0.0.1:5000/api/profiles/${id}`,
            {},
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
        .catch(err => console.log(err));
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
    .catch(err => console.log(err));
}