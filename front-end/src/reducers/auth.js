import {
    REGISTER_PROCESS,
    LOGIN_PROCESS,
    LOGOUT_PROCESS
} from "../actions/types";

const initialState = {
    id: localStorage.getItem("id"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    token: localStorage.getItem("token")
};

export default function (state = initialState, action) {
    switch (action.type) {
        default:
            return state;
        case REGISTER_PROCESS:
            localStorage.setItem("id", action.payload.id);
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("username", action.payload.username)
            return {
                ...state,
                id: action.payload.id,
                token: action.payload.token,
                username: action.payload.username,
            }
        case LOGIN_PROCESS:
            localStorage.setItem("id", action.payload.id);
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("username", action.payload.username)
            localStorage.setItem("email", action.payload.email)
            return {
                ...state,
                id: action.payload.id,
                token: action.payload.token,
                username: action.payload.username,
                email: action.payload.email ? action.payload.email : ""
            }
        case LOGOUT_PROCESS:
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("email")
            return {
                ...state,
                id: "",
                token: "",
                username: "",
                email: ""
            }
    }
}