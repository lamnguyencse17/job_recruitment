import { SET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
    show: false,
    variant: "danger",
    msg: "",
    status: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                show: true,
                msg: action.payload.msg,
                status: action.payload.status
            };
        case CLEAR_ERRORS:
            return {
                show: false,
                variant: "danger",
                msg: "",
                status: null
            };
        default:
            return state;
    }
}