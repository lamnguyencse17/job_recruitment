import { combineReducers } from "redux";
import errors from "./control/errors";
import search from "./control/search";

export default combineReducers({errors, search});