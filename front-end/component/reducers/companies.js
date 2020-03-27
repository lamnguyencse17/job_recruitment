import { GET_COMPANIES, SET_COMPANIES } from "../actions/types";

const initialState = {
    page: [], // name, location, description, image, size, email, phone, jobs
    nextPage: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        default: return state;
        case GET_COMPANIES:
            return {
                ...state,
                page: action.payload,
            };
        case SET_COMPANIES:
            return {
                ...state,
                page: action.payload
            };
    }
}