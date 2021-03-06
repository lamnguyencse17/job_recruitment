import {
  REGISTER_PROCESS,
  LOGIN_PROCESS,
  LOGOUT_PROCESS,
  AUTH_PROCESS,
  VERIFY_PROCESS
} from "Components/actions/types/auth_types";
import { SET_AUTH } from "Components/actions/types/control_types";

const initialState = {
  id: "",
  username: "",
  token: "",
  role: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    case SET_AUTH:
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("role", action.payload.role);
      return action.payload;
    case REGISTER_PROCESS:
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        id: action.payload.id,
        token: action.payload.token,
        username: action.payload.username,
        role: action.payload.role
      };
    case LOGIN_PROCESS:
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        id: action.payload.id,
        token: action.payload.token,
        username: action.payload.username,
        role: action.payload.role
      };
    case LOGOUT_PROCESS:
      localStorage.clear();
      return {
        ...state,
        id: "",
        token: "",
        username: "",
        role: ""
      };
    case AUTH_PROCESS:
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        id: action.payload.id,
        role: action.payload.role
      };
    case VERIFY_PROCESS:
      return state;
  }
}
