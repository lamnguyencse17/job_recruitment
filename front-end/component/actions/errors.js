import { SET_ERRORS, CLEAR_ERRORS } from "./types";

export const setErrors = (msg, status) => {
    return {
        type: SET_ERRORS,
        payload: { msg, status }
    };
};

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    };
};