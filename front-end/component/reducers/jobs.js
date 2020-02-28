import { GET_JOBS, SET_JOBS } from "../actions/types";

const initialState = {
    page: [],
    nextPage: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        default: return state;
        case GET_JOBS:
            return {
                ...state,
                page: action.payload,
            };
        case SET_JOBS:
            return {
                ...state,
                page: action.payload
            };
    }
}