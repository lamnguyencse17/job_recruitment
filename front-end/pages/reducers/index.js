import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import errors from "./errors";

export default combineReducers({ auth, profile, errors });
