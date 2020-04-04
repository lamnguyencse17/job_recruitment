import axios from "axios";

import {SEARCH_TERM} from "../types/control_types";

export const searchProcess = (term) => dispatch => {
    axios.get(`http://127.0.0.1:5000/api/actions/search?term=${term}`,
    {},{
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        console.log(res.data)
        dispatch({type: SEARCH_TERM, payload: res.data}); // SEACH RESULTS
    }).catch(err => console.log(err));
}