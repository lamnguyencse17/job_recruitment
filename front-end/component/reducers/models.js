import { combineReducers } from "redux";
import profile from "./models/profile";
import companies from "./models/companies";
import company from "./models/company";
import jobs from "./models/jobs";
import job from "./models/job"

export default combineReducers({ profile, companies, company, jobs, job });
