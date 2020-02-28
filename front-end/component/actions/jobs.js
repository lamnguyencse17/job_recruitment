import axios from "axios";
import { GET_JOBS } from "./types";
import { setErrors } from './errors';

export const getJobs = (page) => async dispatch => {
    let result = await axios
        .get(
            `http://127.0.0.1:5000/api/jobs/${page}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(res => {
            dispatch({ type: GET_JOBS, payload: res.data });
            return res.data;
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
    return result;
};