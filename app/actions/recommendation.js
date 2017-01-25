import axios from 'axios';
import { RECOMMEND_FOR_USER } from '_actions';

export const recommendForUser = (user) => dispatch =>
  axios.get('/api/recommendations/' + user)
    .then(res => {
      // const items = res.data.items;
      const recommendations = res.data.suggestions;
      // { items, user: req.params.user, likes, dislikes, suggestions: s.slice(0, 5) }
      return dispatch({ type: RECOMMEND_FOR_USER, recommendations })
    })
