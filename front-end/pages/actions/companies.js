import axios from "axios";
import { GET_COMPANIES} from "./types";
import { setErrors } from './errors';

export const getCompanies =  (page) => async dispatch => {
    let result = await axios
        .get(
            `http://127.0.0.1:5000/api/companies/${page}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(res => {
            dispatch({ type: GET_COMPANIES, payload: res.data });
            return res.data
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
    return result
}