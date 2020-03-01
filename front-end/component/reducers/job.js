import { GET_JOB, SET_JOB } from "../actions/types";

const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        default: return state;
        case GET_JOB:
            return action.payload
        case SET_JOB:
            return action.payload
    }
}