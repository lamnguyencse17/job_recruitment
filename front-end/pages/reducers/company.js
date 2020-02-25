import { GET_COMPANY, SET_COMPANY } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        default: return state;
        case GET_COMPANY:
            return action.payload;
        case SET_COMPANY:
            return action.payload;
    }
}