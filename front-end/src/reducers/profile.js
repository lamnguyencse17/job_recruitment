import { GET_PROFILE, POST_PROFILE } from "../actions/types";

const initialState = {
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    dob: localStorage.getItem("dob"),
    cvs: localStorage.getItem("cvs")
}

export default function (state = initialState, action) {
    switch (action.type) {
        default:
            return state;
        case GET_PROFILE:
        case POST_PROFILE:
            localStorage.setItem("name", action.payload.name)
            localStorage.setItem("email", action.payload.email)
            localStorage.setItem("dob", action.payload.dob)
            localStorage.setItem("cvs", action.payload.cvs)
            return {
                ...state,
                name: action.payload.name ? action.payload.name : state.name,
                email: action.payload.email ? action.payload.email : state.email,
                dob: action.payload.dob ? action.payload.dob : state.dob,
                cvs: action.payload.cvs ? action.payload.cvs : state.cvs
            }
    }
}