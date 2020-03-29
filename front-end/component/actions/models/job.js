import axios from "axios";
import { GET_JOB } from "../types/model_types";
import { setErrors } from '../control/errors';

export const getJob = (id) => async dispatch => {
    console.log(id)
    let result = await axios
        .get(
            `http://127.0.0.1:5000/api/jobs/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(res => {
            dispatch({ type: GET_JOB, payload: res.data });
            return res.data;
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
    return result;
};