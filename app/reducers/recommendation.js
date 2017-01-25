import { RECOMMEND_FOR_USER } from '_actions';
const INITIAL_STATE = [];


export default (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case RECOMMEND_FOR_USER: return action.recommendations;
    default: return state;
  }
}
