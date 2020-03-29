import {
  GET_PROFILE,
  POST_PROFILE,
  PUT_PROFILE,
  DELETE_PROFILE
} from "Components/actions/types/model_types";
import { SET_PROFILE } from "Components/actions/types/control_types";

const initialState = {
  name: "",
  email: "",
  dob: "",
  cvs: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    case SET_PROFILE:
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("dob", action.payload.dob);
      localStorage.setItem("cvs", action.payload.cvs);
      return action.payload;
    case GET_PROFILE:
    case POST_PROFILE:
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("dob", action.payload.dob);
      localStorage.setItem("cvs", action.payload.cvs);
      return {
        ...state,
        name: action.payload.name ? action.payload.name : state.name,
        email: action.payload.email ? action.payload.email : state.email,
        dob: action.payload.dob ? action.payload.dob : state.dob,
        cvs: action.payload.cvs ? action.payload.cvs : state.cvs
      };
    case PUT_PROFILE:
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("dob", action.payload.dob);
      return {
        ...state,
        name: action.payload.name ? action.payload.name : state.name,
        email: action.payload.email ? action.payload.email : state.email,
        dob: action.payload.dob ? action.payload.dob : state.dob
      };
    case DELETE_PROFILE:
      localStorage.clear();
      return {
        name: "",
        email: "",
        dob: "",
        cvs: []
      };
  }
}
