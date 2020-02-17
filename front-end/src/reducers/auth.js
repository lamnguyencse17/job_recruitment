import {
    REGISTER_PROCESS,
    LOGIN_PROCESS,
    LOGOUT_PROCESS,
    AUTH_PROCESS
} from "../actions/types";

const initialState = {
    id: localStorage.getItem("id"),
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role")
};

export default function (state = initialState, action) {
    switch (action.type) {
        default:
            return state;
        case REGISTER_PROCESS:
            localStorage.setItem("id", action.payload.id);
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("username", action.payload.username)
            localStorage.setItem("role", action.payload.role)
            return {
                ...state,
                id: action.payload.id,
                token: action.payload.token,
                username: action.payload.username,
                role: action.payload.role
            }
        case LOGIN_PROCESS:
            localStorage.setItem("id", action.payload.id);
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("username", action.payload.username)
            localStorage.setItem("role", action.payload.role)
            return {
                ...state,
                id: action.payload.id,
                token: action.payload.token,
                username: action.payload.username,
                role: action.payload.role,
            }
        case LOGOUT_PROCESS:
            localStorage.clear();
            return {
                ...state,
                id: "",
                token: "",
                username: "",
                role: ""
            }
        case AUTH_PROCESS:
            localStorage.setItem("id", action.payload.id);
            localStorage.setItem("role", action.payload.role);
            return {
                ...state,
                id: action.payload.id,
                role: action.payload.role,
            }

    }
}