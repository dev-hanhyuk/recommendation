import { FETCH_ITEMS_FROM_SERVER } from '_actions';

const INITIAL_STATE = {
  items: []
};


export default (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ITEMS_FROM_SERVER: return {...state, items: [...action.items]};
    default: return state;
  }
}