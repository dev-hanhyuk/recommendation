import { combineReducers } from 'redux';

import userReducer from './user';
import itemReducer from './item';
import recommendationReducer from './recommendation';

export default combineReducers({
  user: userReducer,
  item: itemReducer,
  recommendations: recommendationReducer
});