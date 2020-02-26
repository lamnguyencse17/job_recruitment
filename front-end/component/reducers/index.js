import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import errors from "./errors";
import companies from "./companies";
import company from "./company";

export default combineReducers({ auth, profile, errors, companies, company });
