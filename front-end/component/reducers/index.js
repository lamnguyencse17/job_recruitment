import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import errors from "./errors";
import companies from "./companies";
import company from "./company";
import jobs from "./jobs";
import job from "./job"

export default combineReducers({ auth, profile, errors, companies, company, jobs, job });
