import axios from 'axios';
import { FETCH_ITEMS_FROM_SERVER } from '_actions'

export const fetchItemsFromServer = () => dispatch =>
  axios.get('/api/items')
    .then(res => {
      const items = res.data;
      dispatch({ type: FETCH_ITEMS_FROM_SERVER, items })
    })
    .catch(err => console.error(err))