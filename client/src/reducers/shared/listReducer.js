import { SET_LIST } from "../../actions/constants/types";

const initialState = []

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_LIST:
			return action.list;
		default:
			return state;
	}
}