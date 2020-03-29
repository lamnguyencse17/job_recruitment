import { CREATE_MESSAGE } from "../types/control_types";

//CREATE MESSAGE
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGE,
        payload: msg
    };
};


