import { USER_LOGIN } from '_actions';

const INITIAL_STATE = {
  email: '',
  password: ''
};


export default (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOGIN: return action.user;
    default: return state;
  }
}