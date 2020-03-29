import axios from "axios";
import { GET_COMPANY} from "../types/model_types";
import { setErrors } from '../control/errors';

export const getCompany =  (id) => async dispatch => {
    let result = await axios
        .get(
            `http://127.0.0.1:5000/api/companies/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(res => {
            dispatch({ type: GET_COMPANY, payload: res.data });
            return res.data
        })
        .catch(err => {
            console.log(err);
            dispatch(setErrors(err.response.data, err.response.status));
        });
    return result
}