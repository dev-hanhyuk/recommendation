import axios from 'axios';
import { LIKE, DISLIKE } from '_actions';
import { recommendForUser } from '_actions/recommendation'

export const like = (user, item) => dispatch => {
  return axios.post('/api/like', { user, item })
    .then(() => dispatch(recommendForUser(user)))
    .catch(err => console.error(err))
}


export const dislike = (user, item) => dispatch => {
  return axios.post('/api/dislike', { user, item })
    .then(() => dispatch(recommendForUser(user)))
}
