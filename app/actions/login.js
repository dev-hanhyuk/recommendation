import axios from 'axios';
import { USER_LOGIN } from '_actions';
import { recommendForUser } from '_actions/recommendation';

let user;

export const userLogin = (email, password) => dispatch =>
  axios.post('/api/user/login', { email, password })
    .then(res => {
      user = res.data;
      return dispatch({ type: USER_LOGIN, user })
    })
    .catch(err => console.error(err))