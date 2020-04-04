import { combineReducers } from "redux";
import auth from "./auth";
import control from "./control";
import models from "./models"

export default combineReducers({ auth, control, models });
